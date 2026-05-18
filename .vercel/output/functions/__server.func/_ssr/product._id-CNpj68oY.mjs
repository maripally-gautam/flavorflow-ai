import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams, f as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as useProducts, g as useApp } from "./router-P_1GDnq5.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { e as ChevronLeft, j as Minus, n as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
function ProductDetail() {
  const {
    id
  } = useParams({
    from: "/product/$id"
  });
  const router = useRouter();
  const {
    products,
    loading
  } = useProducts();
  const product = products.find((item) => item.id === id);
  const {
    cart,
    addToCart,
    setQty
  } = useApp();
  const inCart = cart.find((item) => item.product.id === id);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: "Loading..." });
  if (!product) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: "Item not found." });
  const add = () => {
    addToCart(product);
    toast.success("Added to cart");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[44vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background to-black/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.history.back(), className: "safe-top absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: product.vendor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-extrabold", children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-display text-2xl font-bold", children: [
        "Rs ",
        product.price
      ] }),
      product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: product.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "Sub items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: product.subItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground", children: item.quantity })
        ] }, `${item.name}-${index}`)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-md items-center gap-3", children: inCart ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center justify-between rounded-2xl border border-border bg-card p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(product.id, inCart.qty - 1), className: "grid h-10 w-10 place-items-center rounded-xl bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: inCart.qty }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(product.id, inCart.qty + 1), className: "grid h-10 w-10 place-items-center rounded-xl bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "flex-1 rounded-2xl bg-gradient-warm py-4 text-center font-bold text-white shadow-glow", children: "Go to cart" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: add, className: "w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow", children: "Add to cart" }) }) })
  ] });
}
export {
  ProductDetail as component
};
