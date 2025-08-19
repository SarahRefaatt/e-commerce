"use client";

import {
  IconBaseline,
  IconBasket,
  IconHttpDelete,
  IconTrash,
} from "@tabler/icons-react";
import { Icon } from "lucide-react";
import {
  JSX,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { object, string, number, z } from "zod";
import { DELETE } from "../api/carts/route";

interface Cart {
  id: string;
  customerId: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    variantId: string;
  }[];
}

interface Product {
  product: {
    stock_quantity: number;
    id: number;
    name: string;
    brand: string;
    price: string;
    description: string;
    variantId: number;
    productVariant: {
      time:
        | string
        | number
        | bigint
        | boolean
        | ReactElement<unknown, string | JSXElementConstructor<any>>
        | ReactPortal
        | Iterable<ReactNode>
        | Promise<
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | ReactPortal
            | Iterable<ReactNode>
            | null
            | undefined
          >
        | null
        | undefined;
      reduce(arg0: (sum: any, _: any, vIdx: any) => any, arg1: number): unknown;
      map(
        arg0: (
          variant: {
            color:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
            size:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
            time:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
          },
          vIdx: any
        ) => JSX.Element
      ): any;

      id: number;
      color: string;
      productid: number;
      quantity: number;
      size: string;
    };
    quantity_: string;
  };
}
[];

export default function CartPage() {
  const [cart, setCart] = useState<Cart>();
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState({
    cart: true,
    products: true,
  });

  const [products_, setProducts_] = useState<Product>();
  const [error, setError] = useState<string | null>(null);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/carts");
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();

        if (data.carts) {
          setCart(data.carts[0]);
        } else {
          throw new Error("No cart found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading((prev) => ({ ...prev, cart: false }));
      }
    };

    fetchCart();
  }, []);

  // useEffect(() => {
  //   if (!cart) return;

  //   const fetchProducts = async () => {
  //     try {
  //       const productIds = [...new Set(cart.items.map(item => item.productId))];
  //       const productVarinatIds = [...new Set(cart.items.map(item => item.variantId))];
  //       const productQuantity= [...new Set(cart.items.map(item => item.quantity))];

  //       const productPromises = productIds.map(async (id) => {
  //         const response = await fetch(`/api/products?id=${id}`);
  //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //         return await response.json();
  //       });

  //         const productVariantPromises = productVarinatIds.map(async (id) => {
  //         const response = await fetch(`/api/product_variants?id=1${id}`);
  //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //         return await response.json();
  //       });
  //         const productQuantityPromises = productQuantity.map(async (id) => {

  //       });

  //       const productsData = await Promise.all(productPromises);
  //       const validProducts = productsData.filter(Boolean);

  //       setProducts(validProducts); // products is an array here
  //     } catch (err) {
  //       console.error(err);
  //       setError('Failed to load products. Please try again.');
  //     } finally {
  //       setLoading(prev => ({ ...prev, products: false }));
  //     }
  //   };

  //   fetchProducts();
  // }, [cart]);

  // useEffect(() => {
  //   if (!cart) return;

  //   const fetchProducts = async () => {
  //     try {
  //       // Prepare cart items data
  //       const cartItems = cart.items.map((item) => ({
  //         productId: item.productId,
  //         variantId: item.variantId,
  //         quantity: item.quantity,
  //       }));

  //       // Get unique IDs (filter out null variant IDs)
  //       const productIds = [
  //         ...new Set(cartItems.map((item) => item.productId)),
  //       ];
  //       const variantIds = [
  //         ...new Set(
  //           cartItems.map((item) => item.variantId).filter((id) => id !== null)
  //         ),
  //       ];

  //       // Fetch products and variants (only if variant IDs exist)
  //       const productPromises = productIds.map(async (id) => {
  //         const response = await fetch(`/api/products?id=${id}`);
  //         if (!response.ok) throw new Error(`Failed to fetch product ${id}`);
  //         return await response.json();
  //       });

  //       const variantPromises =
  //         variantIds.length > 0
  //           ? variantIds.map(async (id) => {
  //               const response = await fetch(`/api/product_variants?id=${id}`);
  //               if (!response.ok)
  //                 throw new Error(`Failed to fetch variant ${id}`);
  //               return await response.json();
  //             })
  //           : [];

  //       const [productsData, variantsData] = await Promise.all([
  //         Promise.all(productPromises),
  //         Promise.all(variantPromises),
  //       ]);

  //       // Combine all data
  //       const enrichedProducts = productsData.map((product) => {
  //         // Find all cart items for this product
  //         const productCartItems = cartItems.filter(
  //           (item) => item.productId === product.id
  //         );

  //         // Handle cases with and without variants
  //         if (
  //           variantIds.length === 0 ||
  //           productCartItems.every((item) => item.variantId === null)
  //         ) {
  //           // Product has no variants - use product quantity directly
  //           const totalQuantity = productCartItems.reduce(
  //             (sum, item) => sum + item.quantity,
  //             0
  //           );
  //           return {
  //             ...product,
  //             quantity: totalQuantity,
  //             variants: null, // Explicitly mark as no variants
  //           };
  //         } else {
  //           // Product has variants
  //           const productVariants = variantsData.filter((variant) =>
  //             productCartItems.some((item) => item.variantId === variant.id)
  //           );

  //           const variantsWithQuantity = productVariants
  //             .filter(
  //               (variant) => typeof variant === "object" && variant !== null
  //             )
  //             .map((variant) => {
  //               const cartItem = productCartItems.find(
  //                 (item) => item.variantId === variant.id
  //               );
  //               return {
  //                 ...variant,
  //                 quantity: cartItem ? cartItem.quantity : 0,
  //               };
  //             });

  //           const totalQuantity = productCartItems.reduce(
  //             (sum, item) => sum + item.quantity,
  //             0
  //           );

  //           return {
  //             ...product,
  //             quantity: totalQuantity,
  //             variants: variantsWithQuantity,
  //           };
  //         }
  //       });

  //       setProducts(enrichedProducts);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setError("Failed to load products. Please try again.");
  //     } finally {
  //       setLoading((prev) => ({ ...prev, products: false }));
  //     }
  //   };

  //   fetchProducts();
  // }, [cart]);

  useEffect(() => {
    if (!cart) return;

    const fetchProductData = async () => {
      try {
        const productList: Product[] = [];

        for (const item of cart.items) {
          // Fetch product and variant data in parallel
          const [productResponse, variantResponse] = await Promise.all([
            fetch(`/api/products/?id=${item.productId}`),
            fetch(`/api/product_variants/?id=${item.variantId}`),
          ]);

          if (!productResponse.ok || !variantResponse.ok) {
            throw new Error("Failed to fetch product data");
          }

          const productData = await productResponse.json();
          const variantData = await variantResponse.json();

          console.log("product", productData);
          console.log("variantData", variantData);

          // Construct product object according to interface
          const product: Product = {
            product: {
              stock_quantity: productData.product.stock_quantity,
              id: Number(productData.product.id),
              name: productData.product.name,
              brand: productData.product.brand,
              price: productData.product.price,
              description: productData.product.description,
              variantId: Number(item.variantId),
              productVariant: {
                id: variantData.product_variant.id,
                color: variantData.product_variant.color,
                productid: productData.product.id,
                quantity: item.quantity,
                size: variantData.product_variant.size,
                reduce: function (
                  callback: (
                    sum: number,
                    current: any,
                    index: number
                  ) => number,
                  initialValue: number
                ): number {
                  // Implementation for reducing variant quantities or other numeric values
                  return initialValue;
                },
                map: function (
                  callback: (
                    variant: {
                      color:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | ReactPortal
                        | Iterable<ReactNode>
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      size:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | ReactPortal
                        | Iterable<ReactNode>
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      time:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | ReactPortal
                        | Iterable<ReactNode>
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    },
                    index: number
                  ) => JSX.Element
                ): JSX.Element[] {
                  // Implementation for mapping over variant properties
                  return [
                    callback(
                      {
                        color: this.color,
                        size: this.size,
                        time: this.time,
                      },
                      0
                    ),
                  ];
                },
                time: undefined,
              },
              quantity_: item.quantity.toString(),
            },
          };

          console.log("WHOLE PRODUCT", product);
          productList.push(product);
        }

        setProducts(
          productList.reduce((acc, product) => {
            acc[product.product.id] = product;
            return acc;
          }, {} as Record<number, Product>)
        );

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load products");
      }
    };

    fetchProductData();
  }, [cart]);

  console.log("hereeee", products);

  async function handleDeleteItem(id: number) {
    // try {
    //   const response = await fetch(`/api/carts/?id=${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to delete cart');
    //   }
    //   // Refresh the cart data after successful deletion
    //   window.location.reload();
    // } catch (error) {
    //   console.error('Error deleting cart:', error);
    // }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/carts/?id=${cart?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }

      // Refresh the cart data after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  }

  console.log("aa", cart);
  // console.log("pro:",products[0].product.productVariant[0].color)
  if (loading.cart) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cart) return <div>No cart found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Cart Header */}
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 border-b">
                <div className="col-span-5 font-medium text-gray-700">
                  Product
                </div>
                <div className="col-span-2 font-medium text-gray-700 text-center">
                  Price
                </div>
                <div className="col-span-3 font-medium text-gray-700 text-center">
                  Quantity
                </div>
                <div className="col-span-2 font-medium text-gray-700 text-right pr-20">
                  Total
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {Object.values(products).map((prod, idx) => {
                  const price = parseFloat(prod.product?.price);
                  if (isNaN(price)) {
                    console.warn("Product missing valid price:", prod);
                    return null;
                  }

                  const variants = prod.product?.productVariant || [];

                  return variants.map((variant, vIdx) => {
                    const quantity = cart.items[vIdx]?.quantity ?? 1;
                    const itemTotal = price * quantity;

                    return (
                      <div
                        key={`${idx}-${vIdx}`}
                        className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                      >
                        {/* Product Image & Info */}
                        <div className="col-span-5 flex items-center gap-4">
                          <a href={`/w/products/${idx}`}>
                            <div className="w-20 h-20 rounded-md overflow-hidden border">
                              <img
                                src="/assets/img1.png"
                                alt={prod.product?.name || "Unnamed Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </a>
                          <div>
                            <h3 className="font-medium text-gray-900 text-base">
                              {prod.product?.name || "Unnamed Product"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Brand: {prod.product?.brand}
                            </p>
                            <p className="text-sm text-gray-500">
                              {variant.color} | {variant.size}
                            </p>
                            {variant.time && (
                              <p className="text-sm text-gray-400">
                                Time: {variant.time}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center text-gray-900 font-medium text-sm">
                          ${price.toFixed(2)}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center items-center text-gray-600 text-sm">
                          <span>{quantity}</span>
                        </div>

                        {/* Total Price */}
                        <div className="col-span-2 text-right text-gray-900 font-semibold text-sm">
                          ${itemTotal.toFixed(2)}
                        </div>

                        {/* Delete Button */}
                        <div className="col-span-1 flex justify-center items-center">
                          <button
                            onClick={() => handleDeleteItem(prod.product?.id)}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                            title="Remove product"
                          >
                            <IconTrash className="text-red-600 w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>

              {/* Cart Footer */}
              <div className="p-4 border-t flex justify-between items-center">
                <a href="/w/products">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Continue Shopping
                  </button>
                </a>

                <button
                  onClick={() => handleDelete()}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-6 h-fit sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {/* Calculate subtotal from all items */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    $
                    {Object.values(products)
                      .reduce((total, prod) => {
                        const price = parseFloat(prod.product?.price) || 0;
                        const variants = prod.product?.productVariant || [];
                        const variantTotal = variants.reduce((sum, _, vIdx) => {
                          const quantity = cart.items[vIdx]?.quantity ?? 1;
                          return sum + price * quantity;
                        }, 0);
                        return total + variantTotal;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>

                {/* Shipping - you might want to make this dynamic based on rules */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {Object.values(products).length > 0 ? "$5.99" : "$0.00"}
                  </span>
                </div>

                {/* Tax calculation - adjust rate as needed */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    $
                    {(
                      Object.values(products).reduce((total, prod) => {
                        const price = parseFloat(prod.product?.price) || 0;
                        const variants = prod.product?.productVariant || [];
                        const variantTotal = variants.reduce((sum, _, vIdx) => {
                          const quantity = cart.items[vIdx]?.quantity ?? 1;
                          return sum + price * quantity;
                        }, 0);
                        return total + variantTotal;
                      }, 0) * 0.08
                    ).toFixed(2)}{" "}
                    {/* 8% tax rate example */}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    $
                    {(
                      Object.values(products).reduce((total, prod) => {
                        const price = parseFloat(prod.product?.price) || 0;
                        const variants = prod.product?.productVariant || [];
                        const variantTotal = variants.reduce((sum, _, vIdx) => {
                          const quantity = cart.items[vIdx]?.quantity ?? 1;
                          return sum + price * quantity;
                        }, 0);
                        return total + variantTotal;
                      }, 0) *
                        1.08 +
                      (Object.values(products).length > 0 ? 5.99 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <a href="/order">
                <button
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={Object.values(products).length === 0}
                >
                  Proceed to Checkout
                </button>
              </a>

              <div className="mt-4 text-center text-sm text-gray-500">
                or{" "}
                <a
                  href="/s/products"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
