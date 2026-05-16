import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./mock-data";

type CartItem = { product: Product; qty: number };

type AppState = {
  cart: CartItem[];
  addToCart: (p: Product) => { ok: boolean; conflictVendor?: string };
  forceAddToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  user: { name: string; role: "customer" | "vendor" | "delivery"; avatar?: string } | null;
  setUser: (u: AppState["user"]) => void;

  location: string;
  setLocation: (l: string) => void;

  dark: boolean;
  toggleDark: () => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (p) => {
        const cart = get().cart;
        if (cart.length && cart[0].product.vendorId !== p.vendorId) {
          return { ok: false, conflictVendor: cart[0].product.vendor };
        }
        const exists = cart.find((c) => c.product.id === p.id);
        if (exists) set({ cart: cart.map((c) => c.product.id === p.id ? { ...c, qty: c.qty + 1 } : c) });
        else set({ cart: [...cart, { product: p, qty: 1 }] });
        return { ok: true };
      },
      forceAddToCart: (p) => set({ cart: [{ product: p, qty: 1 }] }),
      removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.product.id !== id) }),
      setQty: (id, qty) => {
        if (qty <= 0) return set({ cart: get().cart.filter((c) => c.product.id !== id) });
        set({ cart: get().cart.map((c) => c.product.id === id ? { ...c, qty } : c) });
      },
      clearCart: () => set({ cart: [] }),

      user: { name: "Aanya", role: "customer", avatar: "https://i.pravatar.cc/150?img=47" },
      setUser: (user) => set({ user }),

      location: "Indiranagar, Bengaluru",
      setLocation: (location) => set({ location }),

      dark: false,
      toggleDark: () => {
        const next = !get().dark;
        set({ dark: next });
        if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", next);
      },
    }),
    { name: "curryflow" }
  )
);

export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((s, c) => s + c.product.price * c.qty, 0);
