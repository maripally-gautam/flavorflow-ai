import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { q as useRequireRole, g as useApp, h as useAuth, c as cartTotal, a as createOrder } from "./router-P_1GDnq5.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
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
import "../_libs/lucide-react.mjs";
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
const slots = ["7am to 8am", "8am to 9am", "12pm to 1pm", "6pm to 7pm", "7pm to 8pm"];
function Checkout() {
  useRequireRole(["customer"]);
  const {
    cart,
    clearCart,
    location
  } = useApp();
  const {
    profile
  } = useAuth();
  const nav = useNavigate();
  const [address, setAddress] = reactExports.useState(profile?.location || location || "");
  const [slot, setSlot] = reactExports.useState(slots[0]);
  const [paying, setPaying] = reactExports.useState(false);
  const total = cartTotal(cart);
  const pay = async () => {
    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }
    if (!address.trim()) {
      toast.error("Enter delivery location");
      return;
    }
    setPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Payment completed");
      const order = await createOrder({
        customerId: profile?.uid ?? "local-user",
        customerName: profile?.name ?? "User",
        cart,
        address: address.trim(),
        timeSlot: slot,
        subtotal: total,
        total
      });
      clearCart();
      nav({
        to: "/track/$id",
        params: {
          id: order.id
        }
      });
    } catch (error) {
      toast.error("Order failed", {
        description: error instanceof Error ? error.message : "Try again."
      });
    } finally {
      setPaying(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Payment" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md space-y-5 p-5 pb-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "Delivery location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Enter your location", className: "mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "Time slot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: slots.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSlot(item), className: `rounded-xl border px-3 py-3 text-sm font-semibold ${slot === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`, children: item }, item)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "Total payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
          cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              item.qty,
              "x ",
              item.product.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Rs ",
              item.product.price * item.qty
            ] })
          ] }, item.product.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 font-bold flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Rs ",
              total
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: pay, disabled: paying || !cart.length, className: "w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-60", children: paying ? "Processing..." : `Pay Rs ${total}` }) }) })
  ] });
}
export {
  Checkout as component
};
