import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cartTotal, useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const { cart, setQty, removeFromCart } = useApp();
  const total = cartTotal(cart);

  if (cart.length === 0) {
    return (
      <AppShell hideNav>
        <PageHeader title="Cart" />
        <div className="grid place-items-center px-8 py-24 text-center">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-accent">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold">Your cart is empty</h1>
          <Link to="/home" className="mt-6 rounded-2xl bg-gradient-warm px-6 py-3 font-bold text-white shadow-glow">Browse posts</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <PageHeader title="Cart" />
      <main className="mx-auto max-w-md space-y-3 p-5 pb-32">
        {cart.map((item) => (
          <article key={item.product.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
            <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-1 text-sm font-bold">{item.product.name}</h2>
              <p className="text-xs text-muted-foreground">Rs {item.product.price}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded-xl bg-accent">
                  <button onClick={() => setQty(item.product.id, item.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button>
                  <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                  <button onClick={() => setQty(item.product.id, item.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3 w-3" /></button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="grid h-8 w-8 place-items-center text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <strong>Rs {item.product.price * item.qty}</strong>
          </article>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display text-xl font-bold">Rs {total}</p>
          </div>
          <Link to="/checkout" className="flex-1 rounded-2xl bg-gradient-warm py-4 text-center font-bold text-white shadow-glow">
            Order
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
