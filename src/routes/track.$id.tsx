import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { motion } from "framer-motion";
import { CheckCircle2, Phone, MessageCircle, Bike, Package, Utensils, MapPin, ChefHat } from "lucide-react";
import { useOrder } from "@/hooks/use-live-data";
import { orderStep } from "@/lib/services/orders";

export const Route = createFileRoute("/track/$id")({ component: Track });

const stages = [
  { id: 0, label: "Order placed", time: "12:42", icon: CheckCircle2 },
  { id: 1, label: "Accepted by chef", time: "12:43", icon: ChefHat },
  { id: 2, label: "Picked up", time: "12:58", icon: Package },
  { id: 3, label: "Out for delivery", time: "1:02", icon: Bike },
  { id: 4, label: "Delivered", time: "—", icon: Utensils },
];

function Track() {
  const { id } = useParams({ from: "/track/$id" });
  const order = useOrder(id);
  const step = order ? orderStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-background bg-mesh pb-24">
      <PageHeader title={`Order ${id}`} subtitle="Live tracking" />

      <div className="p-5">
        {/* ETA Hero */}
        <div className="p-5 rounded-3xl bg-gradient-warm text-white shadow-glow relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-xs font-medium opacity-90">Arriving in</div>
            <div className="font-display font-extrabold text-5xl mt-1">{step >= 4 ? "Done" : `${Math.max(8 - step * 2, 2)} min`}</div>
            <div className="text-sm opacity-90 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{order?.address ?? "302, Indiranagar 6th Main"}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 p-5 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display font-bold mb-4">Order status</h3>
          <ol className="relative">
            {stages.map((s, i) => {
              const active = i <= step;
              const current = i === step;
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
                    <div className="text-xs text-muted-foreground">{active ? s.time : "Pending"}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Delivery partner */}
        {step >= 2 && step < 4 && (
          <div className="mt-4 p-4 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=12" className="w-12 h-12 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Rahul S.</div>
                <div className="text-xs text-muted-foreground">⭐ 4.9 · DL 8C 4231</div>
              </div>
              <button className="w-10 h-10 grid place-items-center rounded-xl bg-mint/15 text-mint"><Phone className="w-4 h-4" /></button>
              <button className="w-10 h-10 grid place-items-center rounded-xl bg-accent"><MessageCircle className="w-4 h-4" /></button>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-gradient-ai text-white">
              <div className="text-xs opacity-90">Share OTP with delivery partner</div>
              <div className="flex gap-2 mt-1.5">
                {(order?.otp ?? "4827").split("").map((d, i) => (
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
