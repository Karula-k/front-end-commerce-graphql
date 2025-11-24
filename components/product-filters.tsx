"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
  categories: string[];
}

export function ProductFilters({
  onSearch,
  onCategoryFilter,
  onPriceFilter,
  categories,
}: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryFilter(value === "all" ? "" : value);
  };

  const handlePriceFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    onPriceFilter(min, max);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    onSearch("");
    onCategoryFilter("");
    onPriceFilter(null, null);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price</label>
                <Input
                  type="number"
                  placeholder="1000.00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handlePriceFilter} variant="outline" size="sm">
                Apply Price Filter
              </Button>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
