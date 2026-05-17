import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cartTotal, useApp } from "@/lib/store";
import { createOrder } from "@/lib/services/orders";
import { useAuth } from "@/lib/AuthProvider";

export const Route = createFileRoute("/checkout")({ component: Checkout });

const slots = ["7am to 8am", "8am to 9am", "12pm to 1pm", "6pm to 7pm", "7pm to 8pm"];

function Checkout() {
  const { cart, clearCart, location } = useApp();
  const { profile } = useAuth();
  const nav = useNavigate();
  const [address, setAddress] = useState(profile?.location || location || "");
  const [slot, setSlot] = useState(slots[0]);
  const [paying, setPaying] = useState(false);
  const total = cartTotal(cart);

  const pay = async () => {
    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }
    if (!address.trim()) {
      toast.error("Enter delivery location");
      return;
    }

    setPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Payment completed");
      const order = await createOrder({
        customerId: profile?.uid ?? "local-user",
        customerName: profile?.name ?? "User",
        cart,
        address: address.trim(),
        timeSlot: slot,
        subtotal: total,
        total,
      });
      clearCart();
      nav({ to: "/track/$id", params: { id: order.id } });
    } catch (error) {
      toast.error("Order failed", { description: error instanceof Error ? error.message : "Try again." });
    } finally {
      setPaying(false);
    }
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Payment" />
      <main className="mx-auto max-w-md space-y-5 p-5 pb-32">
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold">Delivery location</h2>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your location" className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold">Time slot</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {slots.map((item) => (
              <button key={item} onClick={() => setSlot(item)} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${slot === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold">Total payment</h2>
          <div className="mt-3 space-y-2 text-sm">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{item.qty}x {item.product.name}</span>
                <span>Rs {item.product.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 font-bold flex justify-between">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4">
        <div className="mx-auto max-w-md">
          <button onClick={pay} disabled={paying || !cart.length} className="w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-60">
            {paying ? "Processing..." : `Pay Rs ${total}`}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
