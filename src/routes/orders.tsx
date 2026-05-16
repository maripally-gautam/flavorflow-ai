import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { mockOrders } from "@/lib/mock-data";
import { Bike, CheckCircle2, ChevronRight, Clock } from "lucide-react";

export const Route = createFileRoute("/orders")({ component: Orders });

const statusMap = {
  out_for_delivery: { label: "Out for delivery", color: "bg-primary text-primary-foreground", icon: Bike },
  delivered: { label: "Delivered", color: "bg-mint/20 text-mint", icon: CheckCircle2 },
  preparing: { label: "Preparing", color: "bg-turmeric/30 text-foreground", icon: Clock },
} as const;

function Orders() {
  const active = mockOrders.filter(o => o.status !== "delivered");
  const past = mockOrders.filter(o => o.status === "delivered");

  return (
    <AppShell>
      <PageHeader title="Your orders" subtitle={`${mockOrders.length} total`} />
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
                        <div className="text-xs text-muted-foreground mt-0.5">{o.id} · {o.placedAt}</div>
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
                        <div className="font-bold text-primary">{"eta" in o ? `${o.eta} min` : "Soon"}</div>
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
                  <div className="text-xs text-muted-foreground mt-0.5">{o.placedAt}</div>
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
