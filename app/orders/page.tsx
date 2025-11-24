"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client/react";
import { GET_ORDERS } from "@/lib/graphql/queries";
import { formatDistanceToNow } from "date-fns";
import { Package, Calendar, DollarSign, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  interface GetOrdersResponse {
    getOrders?: Order[];
  }
  const { data, loading, error } = useQuery<GetOrdersResponse>(GET_ORDERS);
  // Type definitions for order and orderProducts
  type Product = {
    id: string;
    name: string;
    price: number;
    category?: string;
    stock?: number;
  };
  type OrderProduct = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  };
  type Order = {
    id: string;
    orderNumber: string;
    createdAt: string;
    orderStatus: string;
    totalAmount: number;
    orderProducts?: OrderProduct[];
    userId?: string;
    updatedAt?: string;
  };
  const orders: Order[] = Array.isArray(data?.getOrders) ? data.getOrders! : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders.</div>;
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
          <p className="text-muted-foreground">
            View and track all your orders in one place
          </p>
        </div>

        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4 text-lg font-medium">No orders yet</div>
          <div className="text-sm text-muted-foreground mt-2">
            When you place your first order, it will appear here
          </div>
          <Button asChild className="mt-4">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
        <p className="text-muted-foreground">
          View and track all your orders in one place
        </p>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {order.orderProducts?.length ?? 0}{" "}
                      {(order.orderProducts?.length ?? 0) === 1
                        ? "item"
                        : "items"}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <DollarSign className="h-4 w-4" />
                    IDR {order.totalAmount.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {(order.orderProducts ?? []).map((item, index) => (
                      <div key={`${item.product.id}-${index}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              IDR {item.product.price.toLocaleString("id-ID")} ×{" "}
                              {item.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Category: {item.product.category}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            IDR{" "}
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("id-ID")}
                          </div>
                        </div>
                        {index < (order.orderProducts?.length ?? 0) - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between font-medium">
                  <span>Total Amount</span>
                  <span>IDR {order.totalAmount.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                  {order.orderStatus === "delivered" && (
                    <Button variant="outline" size="sm">
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
