"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  REMOVE_PRODUCT,
} from "@/lib/graphql/queries";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/stores/cart-store";

interface ProductManagementProps {
  product?: Product;
  mode: "create" | "edit" | "delete";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ProductManagement({
  product,
  mode,
  trigger,
  onSuccess,
}: ProductManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: product?.category || "",
  });

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [removeProduct] = useMutation(REMOVE_PRODUCT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createProduct({
          variables: {
            input: {
              name: formData.name,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              category: formData.category,
            },
          },
        });
        toast.success("Product created successfully!");
      } else if (mode === "edit" && product) {
        await updateProduct({
          variables: {
            id: product.id,
            input: {
              name: formData.name,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              category: formData.category,
            },
          },
        });
        toast.success("Product updated successfully!");
      }

      setIsOpen(false);
      if (mode === "create") {
        setFormData({ name: "", price: "", stock: "", category: "" });
      }
      onSuccess?.();
    } catch (err) {
      toast.error(`Failed to ${mode} product`);
      console.error(`Error ${mode}ing product:`, err);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (
      window.confirm(
        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await removeProduct({
          variables: { id: product.id.toString() },
        });
        toast.success("Product deleted successfully!");
        setIsOpen(false);
        onSuccess?.();
      } catch (err) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", err);
      }
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Product";
      case "edit":
        return "Edit Product";
      case "delete":
        return "Delete Product";
      default:
        return "Product Management";
    }
  };

  const getDefaultTrigger = () => {
    switch (mode) {
      case "create":
        return (
          <Button className="bg-gray-600 hover:bg-gray-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        );
      case "edit":
        return (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        );
      case "delete":
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      default:
        return <Button>Open</Button>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || getDefaultTrigger()}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {mode === "delete" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {`Are you sure you want to delete "${product?.name}"? This action
              cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Product
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Computers">Computers</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gray-600 hover:bg-gray-700">
                {mode === "create" ? "Create Product" : "Update Product"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
