import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as useApp } from "./router-P_1GDnq5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as Plus } from "../_libs/lucide-react.mjs";
function ProductCard({ product }) {
  const addToCart = useApp((state) => state.addToCart);
  const add = (event) => {
    event.preventDefault();
    addToCart(product);
    toast.success("Added to cart");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$id", params: { id: product.id }, className: "block overflow-hidden rounded-2xl border border-border bg-card shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "h-36 w-full object-cover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: product.vendor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 line-clamp-1 text-sm font-bold", children: product.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-bold", children: [
          "Rs ",
          product.price
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: add, className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
      ] })
    ] })
  ] });
}
export {
  ProductCard as P
};
