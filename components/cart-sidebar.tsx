"use client";

import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/lib/graphql/queries";
import { REGISTER_USER } from "@/lib/graphql/queries";
import { GET_ALL_USERS } from "@/lib/graphql/queries";
import { CREATE_ORDER_PRODUCT } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client/react";
// TypeScript types for GraphQL responses
interface User {
  id: string;
  name: string;
}

interface AllUsersResponse {
  allUsers: User[];
}

interface RegisterUserResponse {
  registerUser: User;
}

interface CreateOrderResponse {
  createOrder: { id: string };
}

export function CartSidebar() {
  const { data: usersData } = useQuery<AllUsersResponse>(GET_ALL_USERS);
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCartStore();
  const [createOrderMutation] = useMutation(CREATE_ORDER);
  const [registerUserMutation] = useMutation(REGISTER_USER);
  const [createOrderProductMutation] = useMutation(CREATE_ORDER_PRODUCT);
  const router = useRouter();

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Find or create Guest user
    let userId = "";
    const guestUser = usersData?.allUsers?.find((u) => u.name === "Guest");
    if (guestUser) {
      userId = guestUser.id;
    } else {
      try {
        const userRes = await registerUserMutation({
          variables: {
            data: { name: "Guest" },
          },
        });
        if (
          userRes.data &&
          typeof userRes.data === "object" &&
          "registerUser" in userRes.data
        ) {
          userId = (userRes.data as RegisterUserResponse).registerUser.id;
        } else {
          userId = "";
        }
      } catch (error) {
        console.error("User registration failed", error);
        return;
      }
    }

    let orderId = "";
    try {
      // Generate order number right before mutation (impure function inside async)
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      // First, create the order to get its ID
      const orderRes = await createOrderMutation({
        variables: {
          data: {
            userId,
            orderNumber,
            orderStatus: "pending",
            totalAmount: totalPrice,
            orderProducts: [], // initially empty, will add after
          },
        },
      });
      if (
        orderRes.data &&
        typeof orderRes.data === "object" &&
        "createOrder" in orderRes.data
      ) {
        orderId = (orderRes.data as CreateOrderResponse).createOrder.id;
      }
      // Now, create orderProducts with orderId
      if (orderId) {
        await Promise.all(
          items.map((item) =>
            createOrderProductMutation({
              variables: {
                data: {
                  orderId,
                  productId: item.product.id,
                  quantity: item.quantity,
                  price: item.product.price,
                },
              },
            })
          )
        );
      }
      clearCart();
      setCartOpen(false);
      if (orderId) {
        router.push(`/orders/${orderId}`);
      }
    } catch (error) {
      // Optionally show error toast
      console.error("Order creation failed", error);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="mr-3 h-6 w-6 text-gray-700" />
              <span className="text-xl font-semibold text-gray-900">
                Shopping Cart
              </span>
            </div>
            {items.length > 0 && (
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {items.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 px-6">
            <div className="bg-gray-100 p-6 rounded-full">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Your cart is empty
              </h3>
              <p className="text-gray-500">
                Discover amazing products and add them to your cart
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/svg/placeholder.svg"
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Category: {item.product.category}
                            </p>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              IDR {item.product.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-white rounded-lg border border-gray-300">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-2 rounded-l-lg hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 text-center font-medium min-w-12 border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="px-3 py-2 rounded-r-lg hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              IDR{" "}
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t bg-white px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  IDR {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
