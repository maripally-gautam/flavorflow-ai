import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Bike, CheckCircle2, MapPin, Package, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { useAvailableDeliveryOrders } from "@/hooks/use-live-data";
import { updateOrderStatus, verifyDeliveryOtp } from "@/lib/services/orders";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/delivery")({ component: Delivery });

function Delivery() {
  useRequireRole(["delivery"]);
  const { profile } = useAuth();
  const [online, setOnline] = useState(true);
  const [active, setActive] = useState<Order | null>(null);
  const [otp, setOtp] = useState("");
  const orders = useAvailableDeliveryOrders();
  const available = orders.filter((o) => !o.deliveryPartnerId || o.deliveryPartnerId === profile?.uid);

  const accept = async (order: Order) => {
    await updateOrderStatus(order.id, "ACCEPTED", { deliveryPartnerId: profile?.uid ?? "demo-delivery" });
    setActive({ ...order, status: "ACCEPTED", deliveryPartnerId: profile?.uid ?? "demo-delivery" });
    toast.success("Order accepted");
  };

  const markPickedUp = async () => {
    if (!active) return;
    await updateOrderStatus(active.id, "PICKED_UP", { deliveryPartnerId: profile?.uid ?? "demo-delivery" });
    setActive({ ...active, status: "PICKED_UP" });
  };

  const markOutForDelivery = async () => {
    if (!active) return;
    await updateOrderStatus(active.id, "OUT_FOR_DELIVERY", { deliveryPartnerId: profile?.uid ?? "demo-delivery" });
    setActive({ ...active, status: "OUT_FOR_DELIVERY" });
  };

  const complete = async () => {
    if (!active) return;
    const ok = await verifyDeliveryOtp(active.id, otp);
    if (!ok) {
      toast.error("Wrong OTP", { description: "Ask the customer for the OTP shown on tracking screen." });
      return;
    }
    toast.success("Order delivered");
    setActive(null);
    setOtp("");
  };

  return (
    <AppShell>
      <PageHeader title="Delivery Hub" subtitle={profile?.name ?? "Delivery Partner"} right={
        <button onClick={() => setOnline(!online)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${online ? "bg-mint/15 text-mint" : "bg-muted text-muted-foreground"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-mint" : "bg-muted-foreground"}`} />
          {online ? "Online" : "Offline"}
        </button>
      } />

      <div className="p-5 space-y-5">
        {active && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card border-2 border-primary shadow-glow">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">Active delivery · {active.id}</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center flex-shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pickup from</div>
                  <div className="font-semibold text-sm">{active.vendor}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Deliver to</div>
                  <div className="font-semibold text-sm">{active.address}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {active.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}
            </div>

            {active.status === "ACCEPTED" && (
              <button onClick={markPickedUp} className="mt-4 w-full bg-gradient-warm text-white font-semibold py-3 rounded-xl">
                Order picked up
              </button>
            )}

            {active.status === "PICKED_UP" && (
              <button onClick={markOutForDelivery} className="mt-4 w-full bg-gradient-warm text-white font-semibold py-3 rounded-xl">
                Out for delivery
              </button>
            )}

            {active.status === "OUT_FOR_DELIVERY" && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-ai text-white">
                <div className="text-xs opacity-90">Enter customer OTP to give order</div>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric" maxLength={4}
                  className="mt-2 w-full h-12 rounded-lg bg-white/20 backdrop-blur font-bold text-lg text-center text-white outline-none placeholder:text-white/60"
                  placeholder="4 digit OTP" />
                <button onClick={complete} className="mt-3 w-full bg-white text-foreground font-semibold py-2.5 rounded-xl">
                  Verify OTP & complete
                </button>
              </div>
            )}
          </motion.div>
        )}

        {!active && online && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Available orders · {available.length}</h3>
            <div className="space-y-2">
              {available.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{o.vendor}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{o.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{o.total}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end"><Clock className="w-3 h-3" />{o.status}</div>
                    </div>
                  </div>
                  <button onClick={() => accept(o)} className="mt-3 w-full bg-gradient-warm text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                    <Bike className="w-4 h-4" /> Accept order
                  </button>
                </div>
              ))}
              {available.length === 0 && <div className="text-center py-10 text-muted-foreground text-sm">No orders yet. Place one as a user and it will appear here live.</div>}
            </div>
          </div>
        )}

        {!online && (
          <div className="text-center py-12 text-muted-foreground text-sm">You're offline. Go online to receive orders.</div>
        )}
      </div>
    </AppShell>
  );
}
