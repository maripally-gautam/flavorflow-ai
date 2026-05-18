import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { h as useAuth, k as useNotifications } from "./router-P_1GDnq5.mjs";
import { H as House, S as Search, B as Bell, R as Receipt, w as User } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
const tabs = [
  { to: "/home", label: "Home", icon: House },
  { to: "/search", label: "Search", icon: Search },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User }
];
function BottomNav() {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const notifications = useNotifications(profile?.uid);
  const unreadCount = notifications.filter((n) => n.unread).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-40 safe-bottom pt-2 px-3 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md glass border border-border/60 rounded-3xl px-2 py-2 shadow-card pointer-events-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex items-center justify-between", children: tabs.map((t) => {
    const active = pathname.startsWith(t.to);
    const Icon = t.icon;
    const isAlerts = t.label === "Alerts";
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: "relative flex flex-col items-center gap-0.5 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}` }),
        isAlerts && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 grid h-3 min-w-[12px] place-items-center rounded-full bg-primary px-0.5 text-[8px] font-bold text-primary-foreground", children: unreadCount > 9 ? "9+" : unreadCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`, children: t.label }),
      active && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "navdot", className: "absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" })
    ] }) }, t.to);
  }) }) }) });
}
function AppShell({ children, hideNav }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-mesh", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md min-h-screen relative pb-28", children }),
    !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  AppShell as A
};
