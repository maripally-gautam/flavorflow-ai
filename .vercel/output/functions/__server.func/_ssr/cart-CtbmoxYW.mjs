import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { g as useApp, c as cartTotal } from "./router-P_1GDnq5.mjs";
import "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { q as ShoppingBag, j as Minus, n as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function Cart() {
  const {
    cart,
    setQty,
    removeFromCart
  } = useApp();
  const total = cartTotal(cart);
  if (cart.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Cart" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center px-8 py-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-9 w-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Your cart is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", className: "mt-6 rounded-2xl bg-gradient-warm px-6 py-3 font-bold text-white shadow-glow", children: "Browse posts" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Cart" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-md space-y-3 p-5 pb-32", children: cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.product.image, alt: item.product.name, className: "h-20 w-20 rounded-xl object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "line-clamp-1 text-sm font-bold", children: item.product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Rs ",
          item.product.price
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center rounded-xl bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(item.product.id, item.qty - 1), className: "grid h-8 w-8 place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 text-center text-sm font-bold", children: item.qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(item.product.id, item.qty + 1), className: "grid h-8 w-8 place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeFromCart(item.product.id), className: "grid h-8 w-8 place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
        "Rs ",
        item.product.price * item.qty
      ] })
    ] }, item.product.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold", children: [
          "Rs ",
          total
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", className: "flex-1 rounded-2xl bg-gradient-warm py-4 text-center font-bold text-white shadow-glow", children: "Order" })
    ] }) })
  ] });
}
export {
  Cart as component
};
