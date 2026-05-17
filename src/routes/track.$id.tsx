import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, Utensils } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useOrder } from "@/hooks/use-live-data";
import { orderStep } from "@/lib/services/orders";

export const Route = createFileRoute("/track/$id")({ component: Track });

const steps = [
  { label: "Ordered", icon: CheckCircle2 },
  { label: "Accepted", icon: CheckCircle2 },
  { label: "Taken", icon: Package },
  { label: "On the way", icon: Truck },
  { label: "Reached", icon: Truck },
  { label: "Finished", icon: Utensils },
];

function Track() {
  const { id } = useParams({ from: "/track/$id" });
  const order = useOrder(id);
  const activeStep = order ? orderStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-background bg-mesh pb-24">
      <PageHeader title="Order timeline" subtitle={id} />
      <main className="mx-auto max-w-md p-5">
        {order && (
          <section className="rounded-2xl bg-gradient-warm p-5 text-white shadow-glow">
            <p className="text-sm opacity-90">Payment completed</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold">{order.status.replaceAll("_", " ")}</h1>
            <p className="mt-2 text-sm opacity-90">{order.address} · {order.timeSlot}</p>
          </section>
        )}

        {order && order.status !== "FINISHED" && (
          <section className="mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Delivery OTP</p>
            <div className="mt-2 flex gap-2">
              {order.otp.split("").map((digit, index) => (
                <span key={index} className="grid h-12 w-10 place-items-center rounded-xl bg-accent font-display text-xl font-bold">{digit}</span>
              ))}
            </div>
          </section>
        )}

        <ol className="mt-5 rounded-2xl border border-border bg-card p-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= activeStep;
            return (
              <li key={step.label} className="flex gap-3 pb-5 last:pb-0">
                <span className={`grid h-10 w-10 place-items-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="pt-1">
                  <p className="font-bold">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{active ? "Updated" : "Waiting"}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <Link to="/home" className="mt-6 block text-center text-sm font-bold text-primary">Back home</Link>
      </main>
    </div>
  );
}
