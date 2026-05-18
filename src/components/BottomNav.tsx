import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Bell, Receipt, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/use-live-data";
import { useAuth } from "@/lib/AuthProvider";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const notifications = useNotifications(profile?.uid);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom pt-2 px-3 pointer-events-none">
      <div className="mx-auto max-w-md glass border border-border/60 rounded-3xl px-2 py-2 shadow-card pointer-events-auto">
        <ul className="flex items-center justify-between">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            const Icon = t.icon;
            const isAlerts = t.label === "Alerts";
            
            return (
              <li key={t.to} className="flex-1">
                <Link to={t.to} className="relative flex flex-col items-center gap-0.5 py-1.5">
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                    {isAlerts && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 grid h-3 min-w-[12px] place-items-center rounded-full bg-primary px-0.5 text-[8px] font-bold text-primary-foreground">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                  {active && (
                    <motion.div layoutId="navdot" className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
