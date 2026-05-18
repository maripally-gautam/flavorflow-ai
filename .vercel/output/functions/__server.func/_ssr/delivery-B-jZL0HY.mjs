import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { q as useRequireRole, h as useAuth, i as useAvailableDeliveryOrders, u as updateOrderStatus, v as verifyDeliveryOtp } from "./router-P_1GDnq5.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { w as User, p as Settings, S as Search, h as MapPin } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
function Delivery() {
  useRequireRole(["delivery"]);
  const {
    profile
  } = useAuth();
  const orders = useAvailableDeliveryOrders();
  const [query, setQuery] = reactExports.useState("");
  const [otpByOrder, setOtpByOrder] = reactExports.useState({});
  const visible = reactExports.useMemo(() => {
    const deliveryId = profile?.uid ?? "local-delivery";
    return orders.filter((order) => !order.deliveryPartnerId || order.deliveryPartnerId === deliveryId).filter((order) => `${order.address} ${order.vendor} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  }, [orders, profile?.uid, query]);
  const setStatus = async (order, status) => {
    await updateOrderStatus(order.id, status, {
      deliveryPartnerId: profile?.uid ?? "local-delivery"
    });
    toast.success(`Order ${status.toLowerCase().replaceAll("_", " ")}`);
  };
  const finish = async (order) => {
    const otp = otpByOrder[order.id] ?? "";
    const ok = await verifyDeliveryOtp(order.id, otp);
    if (!ok) {
      toast.error("Incorrect OTP");
      return;
    }
    toast.success("Finished");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-extrabold", children: "Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: profile?.name || "Delivery person" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-4 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search places", className: "flex-1 bg-transparent text-sm outline-none" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md space-y-3 p-5", children: [
      visible.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-card p-4 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: order.status.replaceAll("_", " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-bold", children: order.items.map((item) => `${item.qty}x ${item.name}`).join(", ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 flex items-center gap-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              order.address
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Slot: ",
              order.timeSlot
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "Rs ",
            order.total
          ] })
        ] }),
        order.status === "ORDERED" && /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { onClick: () => setStatus(order, "ACCEPTED"), children: "Accept" }),
        order.status === "ACCEPTED" && /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { onClick: () => setStatus(order, "TAKEN"), children: "Taken" }),
        order.status === "TAKEN" && /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { onClick: () => setStatus(order, "ON_THE_WAY"), children: "On the way" }),
        order.status === "ON_THE_WAY" && /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { onClick: () => setStatus(order, "REACHED"), children: "Reached" }),
        order.status === "REACHED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl bg-accent p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: otpByOrder[order.id] ?? "", onChange: (e) => setOtpByOrder((prev) => ({
            ...prev,
            [order.id]: e.target.value.replace(/\D/g, "").slice(0, 4)
          })), placeholder: "Enter 4 digit OTP", inputMode: "numeric", maxLength: 4, className: "w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-bold outline-none focus:border-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => finish(order), className: "mt-3 w-full rounded-xl bg-foreground py-3 font-bold text-background", children: "Order given" })
        ] })
      ] }, order.id)),
      visible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No paid orders waiting right now." })
    ] })
  ] });
}
function Action({
  children,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "mt-4 w-full rounded-xl bg-gradient-warm py-3 font-bold text-white shadow-glow", children });
}
export {
  Delivery as component
};
