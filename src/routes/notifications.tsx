import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { notifications } from "@/lib/mock-data";
import { Bike, CheckCircle2, Sparkles, Tag } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

const iconMap = { order: Bike, ai: Sparkles, offer: Tag } as const;
const colorMap = { order: "bg-primary/10 text-primary", ai: "bg-ai/10 text-ai", offer: "bg-mint/15 text-mint" } as const;

function Notifications() {
  return (
    <AppShell>
      <PageHeader title="Notifications" subtitle="2 new" right={
        <button className="text-xs font-semibold text-primary">Mark read</button>
      } />
      <div className="p-5 space-y-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type as keyof typeof iconMap] ?? CheckCircle2;
          const color = colorMap[n.type as keyof typeof colorMap] ?? "bg-accent text-foreground";
          return (
            <div key={n.id} className={`flex gap-3 p-3 rounded-2xl border ${n.unread ? "bg-card border-primary/30 shadow-card" : "bg-card border-border"}`}>
              <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground">{n.time}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-primary self-center" />}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
