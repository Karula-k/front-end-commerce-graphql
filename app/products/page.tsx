"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { ProductManagement } from "@/components/product-management";
import { GET_PRODUCTS, GetProductsResponse } from "@/lib/graphql/queries";
import { Product } from "@/lib/stores/cart-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  const { data, loading, error, refetch } = useQuery<GetProductsResponse>(GET_PRODUCTS, {
    variables: {
      name: searchQuery || undefined,
      category: categoryFilter || undefined,
      minPrice: priceFilter.min || undefined,
      maxPrice: priceFilter.max || undefined,
    },
  });

  const products = useMemo(() => {
    return data?.getProducts || [];
  }, [data]) as Product[];

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category)
    );
    return Array.from(uniqueCategories);
  }, [products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const handlePriceFilter = (
    minPrice: number | null,
    maxPrice: number | null
  ) => {
    setPriceFilter({ min: minPrice, max: maxPrice });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Catalogue
            </h1>
            <p className="text-gray-600">
              Search and purchase equipment for your team.
            </p>
          </div>
          <ProductManagement mode="create" onSuccess={refetch} />
        </div>
      </div>

      <ProductFilters
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onPriceFilter={handlePriceFilter}
        categories={categories}
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg font-medium">No products found</div>
          <div className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria or filters
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              Showing {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select defaultValue="price-low">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRefresh={refetch}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
