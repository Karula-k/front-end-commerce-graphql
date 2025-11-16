import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderStatus: string;
  totalAmount: number;
  items: CartItem[];
  createdAt: string;
}

interface CartStore {
  items: CartItem[];
  orders: Order[];
  isCartOpen: boolean;

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setCartOpen: (open: boolean) => void;

  // Order actions
  createOrder: () => Order;
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      isCartOpen: false,

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            return {
              items: [...state.items, { product, quantity }],
            };
          }
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      setCartOpen: (open: boolean) => {
        set({ isCartOpen: open });
      },

      createOrder: () => {
        const state = get();
        const order: Order = {
          id: `order_${Date.now()}`,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          orderStatus: "pending",
          totalAmount: state.getTotalPrice(),
          items: [...state.items],
          createdAt: new Date().toISOString(),
        };

        state.addOrder(order);
        state.clearCart();
        return order;
      },

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
