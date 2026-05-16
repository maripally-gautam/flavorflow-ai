import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Sparkles, Receipt, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/assistant", label: "AI", icon: Sparkles, ai: true },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom pt-2 px-3 pointer-events-none">
      <div className="mx-auto max-w-md glass border border-border/60 rounded-3xl px-2 py-2 shadow-card pointer-events-auto">
        <ul className="flex items-center justify-between">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <li key={t.to} className="flex-1">
                <Link to={t.to} className="relative flex flex-col items-center gap-0.5 py-1.5">
                  {t.ai ? (
                    <div className={`grid place-items-center w-11 h-11 -mt-5 rounded-2xl bg-gradient-ai shadow-ai text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {t.label}
                  </span>
                  {active && !t.ai && (
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
