"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client/react";
import { GET_ORDER } from "@/lib/graphql/queries";
import type { GetOrderResponse } from "@/lib/graphql/queries";
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function OrderDetailPage() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
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
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data, loading, error } = useQuery<GetOrderResponse>(GET_ORDER, {
    variables: { id: orderId },
  });
  const order = data?.getOrder;

  if (loading) return <div>Loading order...</div>;
  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order Not Found
            </h1>
            <p className="text-muted-foreground">
              The order you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Status steps for timeline
  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Package },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: MapPin },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];
  const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
  const currentStatus = order.orderStatus || "pending";
  const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
  const steps = statusSteps.map((step, idx) => ({
    ...step,
    completed: idx <= currentIndex,
    current: idx === currentIndex,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Order {order.orderNumber}
          </h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Placed on {format(new Date(order.createdAt), "PPP")}</span>
            </div>
            <Badge className={getStatusColor(order.orderStatus)}>
              {order.orderStatus.charAt(0).toUpperCase() +
                order.orderStatus.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            IDR {order.totalAmount.toLocaleString("id-ID")}
          </div>
          <div className="text-sm text-muted-foreground">Total Amount</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center space-x-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.completed
                          ? "bg-primary border-primary text-primary-foreground"
                          : step.current
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          step.completed || step.current
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </div>
                      {step.current && (
                        <div className="text-sm text-muted-foreground">
                          Current status
                        </div>
                      )}
                    </div>
                    {step.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({(order.items ?? []).length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order.items ?? []).map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Category: {item.product.category}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          IDR {item.product.price.toLocaleString("id-ID")} ×{" "}
                          {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          IDR{" "}
                          {(item.product.price * item.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    {index < (order.items?.length ?? 0) - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>IDR {order.totalAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>IDR 0</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>IDR {order.totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Order ID</div>
                <div className="text-sm text-muted-foreground">{order.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Order Number</div>
                <div className="text-sm text-muted-foreground">
                  {order.orderNumber}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Order Date</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "PPP")}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Payment Method</div>
                <div className="text-sm text-muted-foreground">Credit Card</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
