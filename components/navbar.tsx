"use client";

import Link from "next/link";
import { ShoppingCart, Package, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/stores/cart-store";
import { useState } from "react";

const navItems = [
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: User },
];

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
          onClick={onItemClick}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
}

export function Navbar() {
  const { getTotalItems, setCartOpen } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center max-w-7xl mx-auto px-6">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Orbital</span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium ml-8">
            <NavContent />
          </nav>
        </div>

        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="h-6 w-6" />
                  <span className="font-bold">E-Commerce Store</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <NavContent onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Package className="h-6 w-6" />
              <span className="font-bold">Store</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
