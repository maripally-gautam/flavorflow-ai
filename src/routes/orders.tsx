import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Bike, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useCustomerOrders } from "@/hooks/use-live-data";

export const Route = createFileRoute("/orders")({ component: Orders });

const statusMap = {
  PLACED: { label: "Placed", color: "bg-turmeric/30 text-foreground", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "bg-turmeric/30 text-foreground", icon: Clock },
  PICKED_UP: { label: "Picked up", color: "bg-primary text-primary-foreground", icon: Bike },
  OUT_FOR_DELIVERY: { label: "Out for delivery", color: "bg-primary text-primary-foreground", icon: Bike },
  DELIVERED: { label: "Delivered", color: "bg-mint/20 text-mint", icon: CheckCircle2 },
} as const;

function Orders() {
  const { profile } = useAuth();
  const orders = useCustomerOrders(profile?.uid);
  const active = orders.filter(o => o.status !== "DELIVERED");
  const past = orders.filter(o => o.status === "DELIVERED");

  return (
    <AppShell>
      <PageHeader title="Your orders" subtitle={`${orders.length} total`} />
      <div className="p-5">
        {active.length > 0 && (
          <>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Active</h2>
            <div className="space-y-3 mb-6">
              {active.map((o) => {
                const s = statusMap[o.status];
                const Icon = s.icon;
                return (
                  <Link key={o.id} to="/track/$id" params={{ id: o.id }}
                    className="block p-4 rounded-2xl bg-card border border-border shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm">{o.vendor}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{o.id}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.color}`}>
                        <Icon className="w-3 h-3" />{s.label}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {o.items.map((i) => i.name).join(", ")}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Arriving in</div>
                        <div className="font-bold text-primary">{o.etaMinutes ? `${o.etaMinutes} min` : "Soon"}</div>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                        Track <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Past orders</h2>
        <div className="space-y-3">
          {past.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-sm">{o.vendor}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.id}</div>
                  <div className="text-sm text-muted-foreground mt-2">{o.items.map((i) => i.name).join(", ")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{o.total}</div>
                  <button className="mt-2 text-xs font-semibold text-primary">Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
