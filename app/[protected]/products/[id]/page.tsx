"use client";
import Slider from "@/components/slider";
import { ChevronDownIcon, StarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name?: string;
  description?: string;
  price?: string;
  stock_quantity?: string;
  image_url?: string;
  productVariant?: {
    id: number;
    color: string;
    size: string;
    quantity: number;
  }[];
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const colorClassMap: Record<string, string> = {
    Black: "bg-black",
    Blue: "bg-blue-700",
    Red: "bg-red-700",
    Gray: "bg-gray-700",
    White: "bg-white border border-gray-300",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/?id=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStockError(null);

    if (!selectedColor || !selectedSize) {
      alert("Please select both color and size");
      setIsSubmitting(false);
      return;
    }

    try {
      // Fetch variant details to check stock
      const variantResponse = await fetch(
        `/api/product_variants?productid=${product?.id}&color=${selectedColor}&size=${selectedSize}`
      );

      if (!variantResponse.ok) {
        throw new Error("Failed to fetch variant details");
      }

      const variantData = await variantResponse.json();
      const variant = variantData.product_variants[0];

      if (!variant) {
        throw new Error("Selected variant not found");
      }

      // Check stock availability
      if (quantity > variant.quantity) {
        setStockError(`Only ${variant.quantity} items available in stock`);
        setIsSubmitting(false);
        return;
      }
      // Get or create cart
      let cartId;
      try {
        const cartResponse = await fetch(`/api/carts?customerId=1`);
        const cartData = await cartResponse.json();

        if (cartData.cart && cartData.cart.length > 0) {
          // Existing cart found
          cartId = cartData.cart[0].id;
        } else {
          // No cart found, create new one
          const newCartResponse = await fetch("/api/carts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: 1,
            }),
          });

          if (!newCartResponse.ok) {
            throw new Error("Failed to create new cart");
          }

          const newCartData = await newCartResponse.json();
          cartId = newCartData.cart.id;
        }
      } catch (error) {
        console.error("Error handling cart:", error);
        throw new Error("Failed to get or create cart");
      }

      // Add item to cart
      const addToCartResponse = await fetch(
        `/api/cart_items/?cartId=${cartId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product?.id,
            quantity,
            variantId: variant.id,
          }),
        }
      );

      if (!addToCartResponse.ok) {
        throw new Error("Failed to add item to cart");
      }

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error in cart process:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add product to cart"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueColors = [
    ...new Set(product?.productVariant?.map((v) => v.color) || []),
  ];
  const uniqueSizes = [
    ...new Set(product?.productVariant?.map((v) => v.size) || []),
  ];

  const isColorAvailable = (color: string) =>
    product?.productVariant?.some((v) => v.color === color && v.quantity > 0);

  const isSizeAvailable = (size: string) =>
    product?.productVariant?.some(
      (v) => v.size === size && v.color === selectedColor && v.quantity > 0
    );

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="grid lg:grid-cols-2 w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div>
        <Slider />
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <a
              href="#"
              className="text-sm font-normal text-primary hover:underline"
            >
              {product?.description}
            </a>
            <h1 className="text-2xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
              <span className="text-sm text-gray-500">(42 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900">
              ${product?.price || "89.99"}
            </span>
            <span className="text-sm text-gray-500 line-through">$120.00</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
              25% OFF
            </span>
          </div>

          {uniqueColors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="flex gap-2">
                {uniqueColors.map((color) => {
                  const available = isColorAvailable(color);
                  return (
                    <button
                      type="button"
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        colorClassMap[color] || "bg-gray-300"
                      } ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      } ${!available ? "opacity-30 cursor-not-allowed" : ""}`}
                      title={color}
                      disabled={!available}
                      onClick={() => {
                        if (available) {
                          setSelectedColor(color);
                          setSelectedSize(null); // Reset size when color changes
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {selectedColor && uniqueSizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Size Guide
                </a>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {uniqueSizes.map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      className={`px-3 py-2 border rounded-md text-center ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-300"
                      } ${!available ? "opacity-30 cursor-not-allowed" : ""}`}
                      disabled={!available}
                      onClick={() => available && setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            {stockError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {stockError}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex items-center border rounded-md">
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="px-3 py-2">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                disabled={
                  isSubmitting ||
                  !selectedColor ||
                  !selectedSize ||
                  !product?.productVariant?.some(
                    (v) =>
                      v.color === selectedColor &&
                      v.size === selectedSize &&
                      v.quantity > 0
                  )
                }
              >
                {isSubmitting ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </form>

        <div className="border-t pt-4 mt-4">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="font-medium text-gray-900">Product Details</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-2 text-sm text-gray-600 space-y-2">
              <p>{product?.description || "No description available"}</p>
              <ul className="list-disc pl-5">
                <li>High-quality materials</li>
                <li>Comfortable design</li>
                <li>Durable construction</li>
                <li>Available in multiple colors and sizes</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
