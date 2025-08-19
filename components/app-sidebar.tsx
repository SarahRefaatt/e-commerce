"use client"

import * as React from "react"
import {
  IconCategory,
  IconDiscount,
  IconHome,
  IconLogout,
  IconMail,
  IconShoppingBag,
  IconUser,
  IconInfoCircle,
  IconSearch,
  IconSettings,
  IconHelp,
  IconHeart,
  IconHistory,
  IconStar,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    { title: "Home", url: "/", icon: IconHome },
    { title: "Shop", url: "/s/products", icon: IconShoppingBag },
    // { title: "Deals", url: "/", icon: IconDiscount },
    { title: "Wishlist", url: "/wishlist", icon: IconHeart },
  ],
  navSecondary: [
    // { title: "Order History", url: "/orders", icon: IconHistory },
    // { title: "Reviews", url: "/reviews", icon: IconStar },
    // { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Help Center", url: "/help", icon: IconHelp },
    { title: "Contact Us", url: "/contact", icon: IconMail },
    { title: "About Us", url: "/about", icon: IconInfoCircle },
  ],
  utilities: [{ name: "Search", url: "/search", icon: IconSearch }],
}

// Pressable NavItem component
const PressableNavItem = ({ item }: { item: typeof data.navMain[0] }) => (
  <a
    href={item.url}
    className="flex items-center gap-3 p-2 rounded-md transition-all
               hover:bg-accent hover:text-accent-foreground
               active:scale-95 cursor-pointer"
  >
    <item.icon className="size-5" />
    <span>{item.title}</span>
  </a>
)

// Modified NavMain component
const PressableNavMain = ({ items }: { items: typeof data.navMain }) => (
  <nav className="space-y-1">
    {items.map((item) => (
      <PressableNavItem key={item.title} item={item} />
    ))}
  </nav>
)

// Modified NavSecondary component
const PressableNavSecondary = ({ items }: { items: typeof data.navSecondary }) => (
  <nav className="space-y-1">
    {items.map((item) => (
      <PressableNavItem key={item.title} item={item} />
    ))}
  </nav>
)

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/" className="flex items-center gap-2">
                <IconShoppingBag className="!size-6 text-primary" />
                <span className="text-lg font-bold">ShopEase</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="flex flex-col gap-4">
        <PressableNavMain items={data.navMain} />
        <PressableNavSecondary items={data.navSecondary} />
      </SidebarContent>

      {/* Footer */}
      {/* <SidebarFooter>
        <NavUser user={data.user} />
        <div className="mt-2">
          <button className="flex items-center gap-2 p-2 rounded-md w-full
                          hover:bg-accent hover:text-accent-foreground
                          transition-all active:scale-95">
            <IconLogout className="size-5" />
            <span>Log Out</span>
          </button>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  )
}