import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { q as useRequireRole, h as useAuth, k as useNotifications, m as markNotificationsRead } from "./router-P_1GDnq5.mjs";
import "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { B as Bell, r as ShoppingCart, C as Check, v as Truck, P as Package } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zustand.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/@protobufjs/inquire.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/long.mjs";
import "../_libs/firebase__installations.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function getNotifIcon(title) {
  if (title.includes("Payment") || title.includes("💰")) return ShoppingCart;
  if (title.includes("Delivered") || title.includes("🎉")) return Check;
  if (title.includes("Way") || title.includes("Reached") || title.includes("🚗") || title.includes("📍")) return Truck;
  return Package;
}
function Notifications() {
  useRequireRole(["customer"]);
  const {
    profile
  } = useAuth();
  const notifications = useNotifications(profile?.uid);
  const unread = notifications.filter((n) => n.unread);
  reactExports.useEffect(() => {
    if (unread.length > 0 && profile?.uid) {
      const timer = setTimeout(() => {
        markNotificationsRead(profile.uid, unread);
      }, 2e3);
      return () => clearTimeout(timer);
    }
  }, [unread, profile?.uid]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Notifications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md space-y-2 p-5", children: [
      notifications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-9 w-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "No notifications yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "You'll see order updates here." })
      ] }),
      notifications.map((notif, index) => {
        const Icon = getNotifIcon(notif.title);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: index * 0.05
        }, className: `flex gap-3 rounded-2xl border p-4 transition-all ${notif.unread ? "border-primary/30 bg-primary/5 shadow-glow/10" : "border-border bg-card"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl ${notif.unread ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: notif.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: notif.body })
          ] }),
          notif.unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" })
        ] }, notif.id);
      })
    ] })
  ] });
}
export {
  Notifications as component
};
