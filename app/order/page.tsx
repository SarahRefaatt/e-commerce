"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductVariant = {
  id: number;
  productid: number;
  color: string;
  size: string;
  price?: number;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  brand: string;
};

interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  variantId: number;
}

interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
}

type CartItemWithDetails = {
  cartItem: CartItem;
  variant: ProductVariant;
  product: Product;
};

type Order = {
  id: number;
  customerId?: number;
  shipping_address: string;
  status: string;
  total_amount: number;
  paymentStatus: string;
  items: OrderItem[];
};

type OrderItem = {
  id: number;
  orderId: number;
  product_variantId: number;
  quantity: number;
  price_at_time: number;
  order?: Order;
  product: ProductVariant;
};



export default function OrderPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderDone, setOrderDone] = useState<Order>();
  const [order, setOrder] = useState<Order>({
    id: 0,
    customerId: 1,
    shipping_address: "",
    status: "pending",
    total_amount: 0,
    paymentStatus: "pending",
    items: []
  });

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Loading your cart...");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const router = useRouter();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingMessage("Loading your cart...");
        setLoadingProgress(30);
        
        const response = await fetch(`/api/carts?customerId=1`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        setCart(data.cart[0]);
        setLoadingProgress(50);
        setLoadingMessage("Loading cart product details...");
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load your cart");
      }
    };
    fetchCart();
  }, []);

  // Fetch product and variant details for each cart item
  useEffect(() => { 
    const fetchCartItemDetails = async () => {
      if (!cart || cart.items.length === 0) {
        setLoading(false);
        setLoadingProgress(100);
        return;
      }

      try {
        setLoadingMessage("Loading product details...");
        
        const itemsWithDetails = await Promise.all(
          cart.items.map(async (item, index) => {
            // Update progress based on items loaded
            const progress = 50 + Math.floor((index / cart.items.length) * 40);
            setLoadingProgress(progress);
            
            // Fetch variant
            const variantResponse = await fetch(`/api/product_variants?id=${item.variantId}`);
            if (!variantResponse.ok) {
              throw new Error(`Failed to fetch variant ${item.variantId}`);
            }
            
            const variantData = await variantResponse.json();
            const variant = variantData.product_variant;
            
            // Fetch product
            const productResponse = await fetch(`/api/products?id=${variant.productid}`);
            if (!productResponse.ok) {
              throw new Error(`Failed to fetch product ${variant.productid}`);
            }
            const productData = await productResponse.json();
            const product = productData.product;

            return {
              cartItem: item,
              variant: {
                ...variant,
                price: product.price
              },
              product
            };
          })
        );

        setCartItemsWithDetails(itemsWithDetails);
        setLoadingProgress(95);
        setLoadingMessage("Finalizing your order...");
      } catch (error) {
        console.error("Error fetching cart item details:", error);
        toast.error("Failed to load some cart items");
      } finally {
        setLoading(false);
        setLoadingProgress(100);
      }
    };

    if (cart) {
      fetchCartItemDetails();
    }
  }, [cart]);

  const handlePlaceOrder = async () => {
  if (!order.shipping_address) {
    toast.error("Please fill in all required shipping address fields");
    return;
  }

  try {
    setLoading(true);
    setLoadingMessage("Processing your order...");
    setLoadingProgress(70);
    
    // Create the order
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: 1,
        shipping_address: order.shipping_address,
        billing_address: order.shipping_address,
        total_amount: total,
        status: "pending",
        paymentStatus: "pending"
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    const { newOrder } = await response.json();
    setOrderDone(newOrder);
    setLoadingProgress(90);

    // Create order items
    if (cart && cart.items.length > 0) {
      // First update all product variants
      for (const item of cart.items) {
        const response3 = await fetch(`/api/product_variants?id=${item.variantId}&param=sub`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: item.quantity }),
        });

        if (!response3.ok) {
          throw new Error("Failed to update product variant stock");
        }
      }

      // Then create order items
      const orderItems = cart.items.map((item) => ({
        orderId: newOrder.id,
        product_variantId: item.variantId,
        quantity: item.quantity,
        price_at_time: Number(cartItemsWithDetails.find(ci => ci.cartItem.id === item.id)?.product.price || 0),
      }));

      const response2 = await fetch("/api/order_items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItems),
      });

      if (!response2.ok) {
        const errData = await response2.json();
        throw new Error(`Order items creation failed: ${errData.error}`);
      }

      await response2.json();
      toast.success("Order placed successfully!");
      setLoadingProgress(100);
    }
  } catch (error: any) {
    console.error("Error placing order:", error);
    toast.error(error.message || "Failed to place order");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (orderDone?.id) {
      router.push(`/order/${orderDone.id}`);
    }
  }, [orderDone, router]);

  // Calculate totals
  const subtotal = cartItemsWithDetails.reduce(
    (sum, item) => sum + (item.variant.price || item.product.price) * item.cartItem.quantity,
    0
  );
  const shippingCost = shippingMethod === "express" ? 15.99 : 7.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  if (loading || cartItemsWithDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl mb-4">{loadingMessage}</h1>
        <div className="w-full max-w-md bg-gray-200 rounded-full  mb-2">
          <div
            className="bg-blue-900 rounded-full h-3 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-600">
          {loadingProgress}% complete
        </p>
        {loadingProgress === 100 && !loading && (
          <p className="mt-4 text-green-600">Ready to proceed!</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Products */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Your Items ({cartItemsWithDetails.length})
            </h2>

            <div className="space-y-6">
              {cartItemsWithDetails.map(({ cartItem, variant, product }) => (
                <div
                  key={cartItem.id}
                  className="flex flex-col sm:flex-row gap-4 border-b pb-6"
                >
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={product.image_url || "/assets/img1.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {variant.color} | {variant.size}
                    </p>
                    <p className="font-semibold mt-1">${product.price}</p>
                    <p className="text-sm text-gray-600">Qty: {cartItem.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="shipping_address">Shipping Address *</Label>
                <Input
                  id="shipping_address"
                  name="shipping_address"
                  value={order.shipping_address}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            <RadioGroup
              value={shippingMethod}
              onValueChange={setShippingMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">
                  Standard Shipping (5-7 business days) - $7.99
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express">
                  Express Shipping (2-3 business days) - $15.99
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6 py-6 text-lg"
              onClick={handlePlaceOrder}
              disabled={!order.shipping_address}
            >
              Place Order
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}