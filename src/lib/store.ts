import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LiveProduct, UserRole } from "./types";

type CartItem = { product: LiveProduct; qty: number };
type AppTheme = "light" | "dark";

type AppState = {
  cart: CartItem[];
  addToCart: (product: LiveProduct) => { ok: boolean };
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  user: { name: string; role: UserRole; avatar?: string } | null;
  setUser: (user: AppState["user"]) => void;

  location: string;
  setLocation: (location: string) => void;

  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.product.id === product.id);
        if (exists) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
            ),
          });
        } else {
          set({ cart: [...cart, { product, qty: 1 }] });
        }
        return { ok: true };
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((item) => item.product.id !== id) }),
      setQty: (id, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((item) => item.product.id !== id) });
          return;
        }
        set({
          cart: get().cart.map((item) => (item.product.id === id ? { ...item, qty } : item)),
        });
      },
      clearCart: () => set({ cart: [] }),
      user: null,
      setUser: (user) => set({ user }),
      location: "",
      setLocation: (location) => set({ location }),
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "flavorflow" },
  ),
);

export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
