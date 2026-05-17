import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/AuthProvider";
import { useCustomerOrders } from "@/hooks/use-live-data";

export const Route = createFileRoute("/orders")({ component: Orders });

function Orders() {
  const { profile } = useAuth();
  const orders = useCustomerOrders(profile?.uid);

  return (
    <AppShell hideNav>
      <PageHeader title="Orders" />
      <main className="mx-auto max-w-md space-y-3 p-5">
        {orders.map((order) => (
          <Link key={order.id} to="/track/$id" params={{ id: order.id }} className="block rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{order.status.replaceAll("_", " ")} · {order.timeSlot}</p>
              </div>
              <strong>Rs {order.total}</strong>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No orders yet.</p>}
      </main>
    </AppShell>
  );
}
