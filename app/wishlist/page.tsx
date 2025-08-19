"use client";
import { CardWithForm } from "@/components/card";
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

interface wishlistItems{
  id: number;

productId:number

}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlists,setWishlists]=useState<wishlistItems[]>([])


// Fetch wishlist items
useEffect(() => {
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/wishlistitems?wishlistId=1");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.wishlistItem && Array.isArray(data.wishlistItem)) {
        setWishlists(data.wishlistItem);
      } else {
        throw new Error("Expected a 'wishlistItems' array in the response");
      }
    } catch (error) {
      console.error("Failed to fetch wishlist items:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch wishlist items");
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  fetchWishlistItems();
}, []);
  console.log("d",wishlists)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Use a Map to store unique products by their ID
      const productsMap = new Map<number, Product>();
      
      for (const wishlistItem of wishlists) {
        try {
          // Skip if we already have this product
          if (productsMap.has(wishlistItem.productId)) continue;
          
          const response = await fetch(`/api/products?id=${wishlistItem.productId}`);
          
          if (!response.ok) {
            console.error(`HTTP error for product ${wishlistItem.productId}! status: ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          if (data.product) {
            productsMap.set(wishlistItem.productId, data.product);
          }
        } catch (error) {
          console.error(`Failed to fetch product ${wishlistItem.productId}:`, error);
        }
      }
      
      setProducts(Array.from(productsMap.values()));
    } catch (error) {
      console.error("Failed during products fetching process:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [wishlists]);

console.log("p",products)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-50">
        {/* Logo */}
        <img
          src="/logo.svg" // Change to your logo path
          alt="Logo"
          className="w-24 h-24 mb-4 animate-pulse"
        />
        {/* Loading text */}
        <p className="text-gray-500 mb-4">Loading products...</p>
        {/* Progress Bar (Fake animation) */}
        <div className="w-64 h-2 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-blue-500 animate-loading-bar" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 w-full min-h-screen bg-gray-50">
      {products.length === 0 ? (
        <></>
        // <div className="col-span-full text-center">
        //   <p className="text-gray-500">No products available.</p>
        // </div>
      ) : (
        products.map((product) => (
          <div 
            key={product.id} 
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
           
            <CardWithForm product={product} />
          </div>
        ))
      )}
    </div>
  );
}