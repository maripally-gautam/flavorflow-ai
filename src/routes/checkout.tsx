import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp, cartTotal } from "@/lib/store";
import { Briefcase, CheckCircle2, Home, MapPin, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/services/orders";
import { payWithRazorpay } from "@/lib/services/payments";
import { useAuth } from "@/lib/AuthProvider";

export const Route = createFileRoute("/checkout")({ component: Checkout });

const addresses = [
  { id: "a1", label: "Home", icon: Home, line: "302, Indiranagar 6th Main, Bengaluru 560038" },
  { id: "a2", label: "Work", icon: Briefcase, line: "Embassy Tech Park, Bengaluru 560066" },
];

const payments = [
  { id: "razorpay", label: "Razorpay UPI / Card", desc: "Test mode · Pay securely", icon: "💳" },
  { id: "cod", label: "Cash on delivery", desc: "Pay when it arrives", icon: "💵" },
  { id: "wallet", label: "CurryFlow Wallet", desc: "₹240 available", icon: "🪙" },
];

function Checkout() {
  const { cart, clearCart } = useApp();
  const { profile } = useAuth();
  const nav = useNavigate();
  const [addr, setAddr] = useState("a1");
  const [pay, setPay] = useState("razorpay");
  const [placing, setPlacing] = useState(false);
  const subtotal = cartTotal(cart);
  const delivery = subtotal > 299 ? 0 : 29;
  const total = subtotal + delivery + Math.round(subtotal * 0.05);

  const placeOrder = async () => {
    if (!cart.length) return;
    setPlacing(true);
    try {
      let paymentStatus: "paid" | "cod" | "failed" | "pending" = pay === "cod" ? "cod" : "pending";
      let razorpayPaymentId: string | undefined;
      if (pay === "razorpay") {
        const payment = await payWithRazorpay({ amount: total, name: profile?.name ?? "CurryFlow User", email: profile?.email });
        if (!payment.ok) {
          toast.error("Payment failed", { description: payment.reason });
          return;
        }
        paymentStatus = "paid";
        razorpayPaymentId = payment.paymentId;
      }
      const order = await createOrder({
        customerId: profile?.uid ?? "demo-customer",
        customerName: profile?.name ?? "Demo Customer",
        cart,
        address: addresses.find((a) => a.id === addr)?.line ?? addresses[0].line,
        subtotal,
        deliveryFee: delivery,
        taxes: Math.round(subtotal * 0.05),
        total,
        paymentMethod: pay as "razorpay" | "cod" | "wallet",
        paymentStatus,
        razorpayPaymentId,
      });
      toast.success("Order placed!", { description: `OTP ${order.otp} generated for delivery verification.` });
      clearCart();
      nav({ to: "/track/$id", params: { id: order.id } });
    } catch (error) {
      toast.error("Order failed", { description: error instanceof Error ? error.message : "Try again." });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Checkout" />
      <div className="p-5 space-y-5">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery address</h3>
            <button className="text-xs font-semibold text-primary flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {addresses.map((a) => {
              const Icon = a.icon;
              const active = addr === a.id;
              return (
                <button key={a.id} onClick={() => setAddr(a.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center"><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-1.5">{a.label} {active && <CheckCircle2 className="w-4 h-4 text-primary" />}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{a.line}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Payment method</h3>
          <div className="space-y-2">
            {payments.map((p) => {
              const active = pay === p.id;
              return (
                <button key={p.id} onClick={() => setPay(p.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center text-lg">{p.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                    {active && <span className="block w-2 h-2 bg-background rounded-full m-auto mt-[5px]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="font-display font-bold mb-2">Order summary</h3>
          <div className="space-y-1 text-sm">
            {cart.map((c) => (
              <div key={c.product.id} className="flex justify-between">
                <span className="text-muted-foreground">{c.qty}× {c.product.name}</span>
                <span>₹{c.product.price * c.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span><span>₹{total}</span>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom px-4 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-md">
          <button onClick={placeOrder} disabled={placing || cart.length === 0} className="w-full bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60">
            <Wallet className="w-4 h-4" /> {placing ? "Placing order..." : `Place order · ₹${total}`}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
