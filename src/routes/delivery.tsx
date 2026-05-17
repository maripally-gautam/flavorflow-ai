import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search, Settings, User } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAvailableDeliveryOrders } from "@/hooks/use-live-data";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { updateOrderStatus, verifyDeliveryOtp } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/delivery")({ component: Delivery });

function Delivery() {
  useRequireRole(["delivery"]);
  const { profile } = useAuth();
  const orders = useAvailableDeliveryOrders();
  const [query, setQuery] = useState("");
  const [otpByOrder, setOtpByOrder] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    const deliveryId = profile?.uid ?? "local-delivery";
    return orders
      .filter((order) => !order.deliveryPartnerId || order.deliveryPartnerId === deliveryId)
      .filter((order) => `${order.address} ${order.vendor} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  }, [orders, profile?.uid, query]);

  const setStatus = async (order: Order, status: OrderStatus) => {
    await updateOrderStatus(order.id, status, { deliveryPartnerId: profile?.uid ?? "local-delivery" });
    toast.success(`Order ${status.toLowerCase().replaceAll("_", " ")}`);
  };

  const finish = async (order: Order) => {
    const otp = otpByOrder[order.id] ?? "";
    const ok = await verifyDeliveryOtp(order.id, otp);
    if (!ok) {
      toast.error("Incorrect OTP");
      return;
    }
    toast.success("Finished");
  };

  return (
    <AppShell hideNav>
      <div className="safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold">Delivery</h1>
            <p className="text-xs text-muted-foreground">{profile?.name || "Delivery person"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profile" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-4 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search places" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <main className="mx-auto max-w-md space-y-3 p-5">
        {visible.map((order) => (
          <article key={order.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{order.status.replaceAll("_", " ")}</p>
                <h2 className="mt-1 font-bold">{order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}</h2>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{order.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">Slot: {order.timeSlot}</p>
              </div>
              <strong>Rs {order.total}</strong>
            </div>

            {order.status === "ORDERED" && <Action onClick={() => setStatus(order, "ACCEPTED")}>Accept</Action>}
            {order.status === "ACCEPTED" && <Action onClick={() => setStatus(order, "TAKEN")}>Taken</Action>}
            {order.status === "TAKEN" && <Action onClick={() => setStatus(order, "ON_THE_WAY")}>On the way</Action>}
            {order.status === "ON_THE_WAY" && <Action onClick={() => setStatus(order, "REACHED")}>Reached</Action>}
            {order.status === "REACHED" && (
              <div className="mt-4 rounded-xl bg-accent p-3">
                <input value={otpByOrder[order.id] ?? ""} onChange={(e) => setOtpByOrder((prev) => ({ ...prev, [order.id]: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="Enter 4 digit OTP" inputMode="numeric" maxLength={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-bold outline-none focus:border-primary" />
                <button onClick={() => finish(order)} className="mt-3 w-full rounded-xl bg-foreground py-3 font-bold text-background">Order given</button>
              </div>
            )}
          </article>
        ))}
        {visible.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No paid orders waiting right now.</p>}
      </main>
    </AppShell>
  );
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-4 w-full rounded-xl bg-gradient-warm py-3 font-bold text-white shadow-glow">
      {children}
    </button>
  );
}
