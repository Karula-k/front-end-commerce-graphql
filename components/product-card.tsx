"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Tag, Edit } from "lucide-react";
import { Product } from "@/lib/stores/cart-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { ProductManagement } from "@/components/product-management";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onRefresh?: () => void;
}

export function ProductCard({ product, onRefresh }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Product is out of stock");
    }
  };

  // Use placeholder SVG for all products
  const getProductImage = () => {
    return "/svg/placeholder.svg";
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <Image
          src={getProductImage()}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
            Low Stock
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Category */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Tag className="h-3 w-3" />
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          {/* Product ID */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Product ID</span>
            <span className="font-mono">{product.id}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Price</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              IDR {product.price.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        {onRefresh && (
          <>
            <ProductManagement
              product={product}
              mode="edit"
              onSuccess={onRefresh}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <ProductManagement
              product={product}
              mode="delete"
              onSuccess={onRefresh}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
