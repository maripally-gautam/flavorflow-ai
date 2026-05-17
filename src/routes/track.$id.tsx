import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { motion } from "framer-motion";
import { CheckCircle2, Bike, Package, Utensils, MapPin, ChefHat } from "lucide-react";
import { useOrder } from "@/hooks/use-live-data";
import { orderStep } from "@/lib/services/orders";

export const Route = createFileRoute("/track/$id")({ component: Track });

const stages = [
  { id: 0, label: "Order placed", icon: CheckCircle2 },
  { id: 1, label: "Delivery accepted", icon: ChefHat },
  { id: 2, label: "Picked up", icon: Package },
  { id: 3, label: "Out for delivery", icon: Bike },
  { id: 4, label: "Delivered", icon: Utensils },
];

function Track() {
  const { id } = useParams({ from: "/track/$id" });
  const order = useOrder(id);
  const step = order ? orderStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-background bg-mesh pb-24">
      <PageHeader title={`Order ${id}`} subtitle="Live tracking" />

      <div className="p-5">
        <div className="p-5 rounded-3xl bg-gradient-warm text-white shadow-glow relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-xs font-medium opacity-90">Status</div>
            <div className="font-display font-extrabold text-4xl mt-1">{order ? order.status.replaceAll("_", " ") : "Loading"}</div>
            <div className="text-sm opacity-90 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />{order?.address ?? "Waiting for order"}
            </div>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-bold mb-4">Order status</h3>
          <ol className="relative">
            {stages.map((s, i) => {
              const active = order ? i <= step : false;
              const current = order ? i === step : false;
              const Icon = s.icon;
              return (
                <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < stages.length - 1 && (
                    <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${active ? "bg-primary" : "bg-border"}`} />
                  )}
                  <motion.div
                    initial={false}
                    animate={current ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1.5, repeat: current ? Infinity : 0 }}
                    className={`relative w-10 h-10 rounded-full grid place-items-center flex-shrink-0 ${active ? "bg-gradient-warm text-white shadow-glow" : "bg-accent text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                    {current && <span className="absolute inset-0 rounded-full pulse-ring" />}
                  </motion.div>
                  <div className="flex-1 pt-1.5">
                    <div className={`font-semibold text-sm ${active ? "" : "text-muted-foreground"}`}>{s.label}</div>
                    <div className="text-xs text-muted-foreground">{active ? "Updated live" : "Pending"}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {order && step >= 1 && step < 4 && (
          <div className="mt-4 p-4 rounded-2xl bg-card border border-border shadow-card">
            <div className="font-semibold text-sm">Delivery partner is handling your order</div>
            <div className="mt-4 p-3 rounded-xl bg-gradient-ai text-white">
              <div className="text-xs opacity-90">Share OTP only when food is handed to you</div>
              <div className="flex gap-2 mt-1.5">
                {order.otp.split("").map((d, i) => (
                  <div key={i} className="w-10 h-12 rounded-lg bg-white/20 backdrop-blur grid place-items-center font-bold text-lg">{d}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Link to="/orders" className="block mt-6 text-center text-sm font-semibold text-muted-foreground">Back to orders</Link>
      </div>
    </div>
  );
}
