import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Catalogue
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Search and purchase equipment for your team. Browse through our
            comprehensive collection of products with advanced filtering and
            search capabilities.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Products
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="border-gray-300"
            >
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
