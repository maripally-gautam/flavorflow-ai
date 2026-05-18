import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Package, ShoppingCart, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { useNotifications } from "@/hooks/use-live-data";
import { markNotificationsRead } from "@/lib/services/notifications";
import { useEffect } from "react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function getNotifIcon(title: string) {
  if (title.includes("Payment") || title.includes("💰")) return ShoppingCart;
  if (title.includes("Delivered") || title.includes("🎉")) return Check;
  if (title.includes("Way") || title.includes("Reached") || title.includes("🚗") || title.includes("📍")) return Truck;
  return Package;
}

function Notifications() {
  useRequireRole(["customer"]);
  const { profile } = useAuth();
  const notifications = useNotifications(profile?.uid);

  const unread = notifications.filter((n) => n.unread);

  useEffect(() => {
    if (unread.length > 0 && profile?.uid) {
      const timer = setTimeout(() => {
        markNotificationsRead(profile.uid, unread);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [unread, profile?.uid]);

  return (
    <AppShell hideNav>
      <PageHeader title="Notifications" />
      <main className="mx-auto max-w-md space-y-2 p-5">
        {notifications.length === 0 && (
          <div className="grid place-items-center py-20 text-center">
            <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-accent">
              <Bell className="h-9 w-9 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold">No notifications yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">You'll see order updates here.</p>
          </div>
        )}
        {notifications.map((notif, index) => {
          const Icon = getNotifIcon(notif.title);
          return (
            <motion.article
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 rounded-2xl border p-4 transition-all ${notif.unread ? "border-primary/30 bg-primary/5 shadow-glow/10" : "border-border bg-card"}`}
            >
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${notif.unread ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold">{notif.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{notif.body}</p>
              </div>
              {notif.unread && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </motion.article>
          );
        })}
      </main>
    </AppShell>
  );
}
