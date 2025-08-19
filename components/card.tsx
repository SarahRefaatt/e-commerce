// 





"use client"
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react";
// import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


type Product = {
  id: number;
  name?: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  stock_quantity?: string;
  image_url?: string;
  productVariant?: {
    id: number;
    color: string;
    size: string;
    quantity: number;
  }[];
};

type WishlistData = {
  wishlist: {
    id: number;
    WishlistItem: {
      id: number;
      productId: number;
    }[];
  } | null;
};

export function CardWithForm({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  // const { toast } = useToast();

  // Fetch favorite status with error handling and retries
  const fetchFavoriteStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wishlists?customerId=1`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data: WishlistData = await res.json();
      const favoriteItem = data.wishlist?.WishlistItem.find(
        (item) => item.productId === product.id
      );
      
      setIsFavorite(!!favoriteItem);
      setWishlistItemId(favoriteItem?.id || null);
    } catch (error) {
      console.error("Error fetching favorite status:", error);
      // toast({
      //   title: "Error",
      //   description: "Could not load wishlist status",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  const handleWishlistAction = async (action: 'add' | 'remove') => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (action === 'add') {
        // Get or create wishlist
        const wishlistRes = await fetch(`/api/wishlists?customerId=1`);
        
        if (!wishlistRes.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const data: WishlistData = await wishlistRes.json();
        let wishlistId = data.wishlist?.id;

        if (!wishlistId) {
          const createRes = await fetch(`/api/wishlists`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: 1 }),
          });

          if (!createRes.ok) {
            throw new Error('Failed to create wishlist');
          }

          const newWishlist = await createRes.json();
          wishlistId = newWishlist.id;
        }

        // Add item to wishlist
        const addItemRes = await fetch(`/api/wishlistitems`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            wishlistId, 
            productId: product.id 
          }),
        });

        if (!addItemRes.ok) {
          throw new Error('Failed to add item to wishlist');
        }

        const addedItem = await addItemRes.json();
        setIsFavorite(true);
        setWishlistItemId(addedItem.id);
        // toast({
        //   title: "Added to favorites",
        //   description: `${product.name} was added to your wishlist`,
        // });
      } else {
        // Remove from wishlist
        if (!wishlistItemId) return;
        
        const res = await fetch(`/api/wishlistitems?id=${wishlistItemId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error('Failed to remove item from wishlist');
        }

        setIsFavorite(false);
        setWishlistItemId(null);
        // toast({
        //   title: "Removed from favorites",
        //   description: `${product.name} was removed from your wishlist`,
        // });
      }
    } catch (error) {
      console.error(`Error ${action === 'add' ? 'adding to' : 'removing from'} favorites:`, error);
      // toast({
      //   title: "Error",
      //   description: `Could not ${action === 'add' ? 'add to' : 'remove from'} favorites`,
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      handleWishlistAction('remove');
    } else {
      handleWishlistAction('add');
    }
  };

  return (
<Card className="w-full max-w-[350px] sm:max-w-[300px] md:max-w-[320px] hover:shadow-lg transition-shadow duration-300 flex flex-col  rounded-xl overflow-hidden">
  {/* Product Image */}
  <a href={`/s/products/${product.id}`} className="block flex-shrink-0">
    <CardContent className="p-0">
      <div className="relative w-full aspect-square bg-gray-100">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={product.image_url || "/assets/img3.png"}
          alt={product.name || "Product image"}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          SALE
        </div>
      </div>
    </CardContent>
  </a>

  {/* Product Info */}
{/* Product Info */}
<div className="flex flex-col flex-grow px-4 pt-3 pb-4 space-y-3">
  <CardHeader className="p-0">
    <CardTitle className="text-base font-semibold truncate">
      {product.name || "Unnamed Product"}
    </CardTitle>
    <CardDescription className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
      {product.description || "No description available"}
    </CardDescription>
  </CardHeader>

  {/* Price & Buttons */}
  <div>
    <div className="flex items-center justify-between mb-3">
      <span className="text-lg font-bold text-gray-900">
        ${product.price || "0.00"}
      </span>
      {product.originalPrice && (
        <span className="text-sm text-gray-400 line-through">
          ${product.originalPrice}
        </span>
      )}
    </div>

    <div className="flex items-center gap-2">
      <Button asChild variant="outline" className="flex-1">
        <a href={`/s/products/${product.id}`} className="flex items-center justify-center">
          <IconEye className="mr-2 h-4 w-4" />
          View
        </a>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`hover:bg-transparent ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        onClick={toggleFavorite}
        disabled={isLoading}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <IconHeartFilled className="h-5 w-5" />
        ) : (
          <IconHeart className="h-5 w-5" />
        )}
      </Button>
    </div>
  </div>
</div>

</Card>

  );
}