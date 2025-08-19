"use client";
import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

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

type OrderItem = {
  id: number;
  orderId: number;
  product_variantId: number;
  quantity: number;
  price_at_time: number;
  product: ProductVariant & {
    product: Product;
  };
};

type Order = {
  id: number;
  customerId?: number;
  shipping_address: string;
  status: string;
  total_amount: number;
  paymentStatus: string;
  items: OrderItem[];
  created_at: string;
};
type CartItemWithDetails = {
  variant: ProductVariant;
  product: Product;
};

export default function OrderSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const orderId = resolvedParams.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<CartItemWithDetails[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoadingProgress(30); // Initial progress when starting to fetch order
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data.order);
        setLoadingProgress(60); // Progress after order is fetched
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchCartItemDetails = async () => {
      if (!order || order.items.length === 0) {
        setLoading(false);
        setLoadingProgress(100);
        return;
      }

      try {
        const itemsWithDetails = await Promise.all(
          order.items.map(async (item, index) => {
            // Update progress based on how many items have been processed
            setLoadingProgress(60 + Math.floor((index / order.items.length) * 30));
            
            const variantResponse = await fetch(
              `/api/product_variants?id=${item.product_variantId}`
            );
            if (!variantResponse.ok) {
              throw new Error(
                `Failed to fetch variant ${item.product_variantId}`
              );
            }
            const variantData = await variantResponse.json();
            const variant = variantData.product_variant;

            const productResponse = await fetch(
              `/api/products?id=${variant.productid}`
            );
            if (!productResponse.ok) {
              throw new Error(`Failed to fetch product ${variant.productid}`);
            }
            const productData = await productResponse.json();
            const product = productData.product;

            return {
              variant: {
                ...variant,
                price: product.price,
              },
              product,
            };
          })
        );

        setCartItemsWithDetails(itemsWithDetails);
      } catch (error) {
        console.error("Error fetching cart item details:", error);
        toast.error("Failed to load some cart items");
      } finally {
        setLoading(false);
        setLoadingProgress(100);
      }
    };

    if (order) {
      fetchCartItemDetails();
    }
  }, [order]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Loading your order...</h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-900 h-2.5 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {loadingProgress}% complete
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order not found</h1>
        <p className="mb-4">We couldn't find your order details.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  // Only render the full order details if we have all the cart item details
  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Loading product details...</h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {loadingProgress}% complete
        </p>
      </div>
    );
  }

  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order ID: #{order.id} | Date: {orderDate}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cartItemsWithDetails.length === 0 ? (
            <p className="text-gray-500">something is wrong</p>
          ) : (
            <div className="space-y-6">
              {cartItemsWithDetails.map(({ variant, product }, index) => (
                <div
                  key={variant.id}
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

                    <p className="text-sm text-gray-600">
                      Qty: {order.items[index].quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      $
                      {(
                        order.items[index].price_at_time *
                        order.items[index].quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  $
                  {order.items
                    .reduce(
                      (sum, item) => sum + item.price_at_time * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.total_amount > 50 ? "0.00" : "7.99"}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  $
                  {(
                    order.items.reduce(
                      (sum, item) => sum + item.price_at_time * item.quantity,
                      0
                    ) * 0.1
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.shipping_address}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                <span className="capitalize">{order.paymentStatus}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-gray-600">
                    Your order is being prepared for shipment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Shipping Confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an email with tracking information once your
                    order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild className="mr-4">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/orders/${order.id}`}>View Order Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// export default function OrderSummaryPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const resolvedParams = use(params);

//   // Get id from resolved params
//   const router = useRouter();

//   const orderId = resolvedParams.id;
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   console.log("orderId", orderId);
//   const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
//     CartItemWithDetails[]
//   >([]);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await fetch(`/api/orders?id=${orderId}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch order");
//         }
//         const data = await response.json();
//         console.log(data.order);
//         setOrder(data.order);
//       } catch (error) {
//         console.error("Error fetching order:", error);
//         toast.error("Failed to load order details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   useEffect(() => {
//     const fetchCartItemDetails = async () => {
//       if (!order || order.items.length === 0) return;

//       try {
//         console.log("lool")
//         const itemsWithDetails = await Promise.all(
//           order.items.map(async (item) => {
//             // Fetch variant
//             const variantResponse = await fetch(
//               `/api/product_variants?id=${item.product_variantId}`
//             );
//             if (!variantResponse.ok) {
//               throw new Error(
//                 `Failed to fetch variant ${item.product_variantId}`
//               );
//             }
//             const variantData = await variantResponse.json();
//             console.log("variantData", variantData);
//             const variant = variantData.product_variant;

//             // Fetch product
//             const productResponse = await fetch(
//               `/api/products?id=${variant.productid}`
//             );
//             if (!productResponse.ok) {
//               throw new Error(`Failed to fetch product ${variant.productid}`);
//             }
//             const productData = await productResponse.json();
//             const product = productData.product;

//             return {
//               variant: {
//                 ...variant,
//                 price: product.price,
//               },
//               product,
//             };
//           })
//         );

//         setCartItemsWithDetails(itemsWithDetails);
//       } catch (error) {
//         console.error("Error fetching cart item details:", error);
//         toast.error("Failed to load some cart items");
//       }
//     };

//     fetchCartItemDetails();
//   }, [order]);

// console.log("ordesr: e", order);


  

//   useEffect(() => {
//     console.log("cartItemsWithDetails", cartItemsWithDetails);
//   }, [cartItemsWithDetails]);
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">Loading your order...</h1>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">Order not found</h1>
//         <p className="mb-4">We couldn't find your order details.</p>
//         <Button asChild>
//           <Link href="/">Return to Home</Link>
//         </Button>
//       </div>
//     );
//   }

//   // Format date
//   const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     // <>{order.customerId}</>
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-10 w-10 text-green-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
//           <p className="text-gray-600">
//             Thank you for your purchase. Your order has been received and is
//             being processed.
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             Order ID: #{order.id} | Date: {orderDate}
//           </p>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//           {cartItemsWithDetails.length === 0 ? (
//             <p className="text-gray-500">something is wrong</p>
//           ) : (
//             <div className="space-y-6">
//               {cartItemsWithDetails.map(({ variant, product }, index) => (
//                 <div
//                   key={variant.id}
//                   className="flex flex-col sm:flex-row gap-4 border-b pb-6"
//                 >
//                   <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
//                     <img
//                       src={product.image_url || "/assets/img1.png"}
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="font-medium">{product.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       {variant.color} | {variant.size}
//                     </p>

//                     <p className="text-sm text-gray-600">
//                       Qty: {order.items[index].quantity}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p className="font-semibold">
//                       $
//                       {(
//                         order.items[index].price_at_time *
//                         order.items[index].quantity
//                       ).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-6 pt-6 border-t">
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>
//                   $
//                   {order.items
//                     .reduce(
//                       (sum, item) => sum + item.price_at_time * item.quantity,
//                       0
//                     )
//                     .toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>${order.total_amount > 50 ? "0.00" : "7.99"}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>
//                   $
//                   {(
//                     order.items.reduce(
//                       (sum, item) => sum + item.price_at_time * item.quantity,
//                       0
//                     ) * 0.1
//                   ).toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t">
//                 <span>Total</span>
//                 <span>${order.total_amount.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//             <div className="space-y-2">
//               <p>
//                 <span className="font-medium">Address:</span>{" "}
//                 {order.shipping_address}
//               </p>
//               <p>
//                 <span className="font-medium">Status:</span>{" "}
//                 <span className="capitalize">{order.status}</span>
//               </p>
//               <p>
//                 <span className="font-medium">Payment:</span>{" "}
//                 <span className="capitalize">{order.paymentStatus}</span>
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
//             <div className="space-y-4">
//               <div className="flex items-start gap-3">
//                 <div className="bg-blue-100 p-2 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-blue-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Order Processing</p>
//                   <p className="text-sm text-gray-600">
//                     Your order is being prepared for shipment.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="bg-gray-100 p-2 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-gray-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Shipping Confirmation</p>
//                   <p className="text-sm text-gray-600">
//                     You'll receive an email with tracking information once your
//                     order ships.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-center">
//           <Button asChild className="mr-4">
//             <Link href="/">Continue Shopping</Link>
//           </Button>
//           <Button variant="outline" asChild>
//             <Link href={`/orders/${order.id}`}>View Order Details</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Page(){

//     return(

//         <><div className="div">lolo</div></>
//     )
// }
