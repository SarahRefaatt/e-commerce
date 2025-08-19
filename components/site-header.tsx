"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

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

export function SiteHeader() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await fetch("/api/carts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch carts");
        }
        
        const responseData = await res.json();
        console.log("API Response:", responseData);
        
        // Handle different response formats
        const receivedCarts = responseData.carts || responseData;
        
        const formattedCarts = Array.isArray(receivedCarts) 
          ? receivedCarts.map(cart => ({
              ...cart,
              items: Array.isArray(cart.items) ? cart.items : []
            }))
          : [];
        
        console.log("Formatted carts before setting state:", formattedCarts);
        setCarts(formattedCarts);
      } catch (error) {
        console.error("Error fetching carts:", error);
        setCarts([]);
      }
    };

    fetchCarts();
  }, []);

  useEffect(() => {
    console.log("Updated carts state:", carts);
  }, [carts]);

  const cartItemCount = carts.reduce((total, cart) => {
    return total + cart.items.length;
  }, 0);

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center border-b transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] bg-background">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left Section: Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-1" />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold hidden sm:inline tracking-tight">
ShopEase            </span>
          </div>

          {/* Divider */}
          <Separator
            orientation="vertical"
            className="h-6 w-[1px] bg-border"
          />

          {/* Page Title */}
          <h1 className="text-base font-medium text-muted-foreground">
            where quality meets style
          </h1>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative cursor-pointer"
            aria-label="Shopping Cart"
            onClick={() => router.push("/carts")}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Sign In */}
          <Button variant="outline" size="sm" onClick={() => router.push("/sign_up")}>
            Sign In
          </Button>
        </div>
      </div>
    </header>
  )
}