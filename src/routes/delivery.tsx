import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Bike, CheckCircle2, IndianRupee, MapPin, Package, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/delivery")({ component: Delivery });

type Order = { id: string; vendor: string; pickup: string; drop: string; amount: number; distance: string };
const incoming: Order[] = [
  { id: "ORD8501", vendor: "Spice Route", pickup: "Indiranagar", drop: "HSR Layout", amount: 78, distance: "3.2 km" },
  { id: "ORD8502", vendor: "Madras Mess", pickup: "Koramangala", drop: "BTM", amount: 64, distance: "2.1 km" },
];

function Delivery() {
  const [online, setOnline] = useState(true);
  const [active, setActive] = useState<Order | null>(null);
  const [step, setStep] = useState(0); // 0 pickup, 1 deliver, 2 otp

  return (
    <AppShell>
      <PageHeader title="Delivery Hub" subtitle="Rahul S." right={
        <button onClick={() => setOnline(!online)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${online ? "bg-mint/15 text-mint" : "bg-muted text-muted-foreground"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${online ? "bg-mint" : "bg-muted-foreground"}`} />
          {online ? "Online" : "Offline"}
        </button>
      } />

      <div className="p-5 space-y-5">
        {/* Earnings */}
        <div className="p-5 rounded-2xl bg-gradient-warm text-white shadow-glow relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-xs opacity-90 flex items-center gap-1"><IndianRupee className="w-3 h-3" />Today's earnings</div>
            <div className="font-display font-extrabold text-4xl mt-1">₹1,248</div>
            <div className="flex gap-4 mt-3 text-xs">
              <div><div className="opacity-80">Deliveries</div><div className="font-bold text-base">14</div></div>
              <div><div className="opacity-80">Online</div><div className="font-bold text-base">5h 12m</div></div>
              <div><div className="opacity-80">Rating</div><div className="font-bold text-base">⭐ 4.9</div></div>
            </div>
          </div>
        </div>

        {/* Active delivery */}
        {active && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card border-2 border-primary shadow-glow">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">Active delivery · {active.id}</div>
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${step >= 0 ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                  {step > 0 ? <CheckCircle2 className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pickup from</div>
                  <div className="font-semibold text-sm">{active.vendor} · {active.pickup}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                  {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Deliver to</div>
                  <div className="font-semibold text-sm">302, {active.drop}</div>
                </div>
              </div>
            </div>

            {step === 2 ? (
              <div className="mt-4 p-3 rounded-xl bg-gradient-ai text-white">
                <div className="text-xs opacity-90">Enter customer OTP</div>
                <div className="flex gap-2 mt-2">
                  {[0,1,2,3].map((i) => (
                    <input key={i} maxLength={1} className="w-10 h-12 rounded-lg bg-white/20 backdrop-blur grid place-items-center font-bold text-lg text-center text-white outline-none" />
                  ))}
                </div>
                <button onClick={() => { toast.success("Delivered! ₹78 added."); setActive(null); setStep(0); }}
                  className="mt-3 w-full bg-white text-foreground font-semibold py-2.5 rounded-xl">Verify & complete</button>
              </div>
            ) : (
              <button onClick={() => setStep(step + 1)}
                className="mt-4 w-full bg-gradient-warm text-white font-semibold py-3 rounded-xl">
                {step === 0 ? "Mark picked up" : "Arrived at customer"}
              </button>
            )}
          </motion.div>
        )}

        {/* Available */}
        {!active && online && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Available orders · {incoming.length}</h3>
            <div className="space-y-2">
              {incoming.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{o.vendor}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{o.pickup} → {o.drop} · {o.distance}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{o.amount}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end"><Clock className="w-3 h-3" />20 min</div>
                    </div>
                  </div>
                  <button onClick={() => setActive(o)} className="mt-3 w-full bg-gradient-warm text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                    <Bike className="w-4 h-4" /> Accept order
                  </button>
                </div>
              ))}
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
