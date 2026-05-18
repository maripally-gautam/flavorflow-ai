import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { P as ProductCard } from "./ProductCard-DYpexY72.mjs";
import { q as useRequireRole, p as useProducts, g as useApp } from "./router-P_1GDnq5.mjs";
import "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { X, L as LayoutGrid, x as Utensils, l as Mountain, D as Dumbbell, E as Ellipsis, i as Menu, r as ShoppingCart, w as User, p as Settings } from "../_libs/lucide-react.mjs";
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
const categoryFilters = [{
  id: "all",
  label: "All",
  icon: LayoutGrid
}, {
  id: "food",
  label: "Food",
  icon: Utensils
}, {
  id: "trip-kit",
  label: "Trip Kit",
  icon: Mountain
}, {
  id: "gym-kit",
  label: "Gym Kit",
  icon: Dumbbell
}, {
  id: "other",
  label: "Others",
  icon: Ellipsis
}];
function Home() {
  useRequireRole(["customer"]);
  const {
    products,
    loading
  } = useProducts();
  const cart = useApp((state) => state.cart);
  const user = useApp((state) => state.user);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const filtered = reactExports.useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);
  const selectCategory = (cat) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, onClick: () => setSidebarOpen(false), className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.aside, { initial: {
        x: "-100%"
      }, animate: {
        x: 0
      }, exit: {
        x: "-100%"
      }, transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }, className: "fixed left-0 top-0 bottom-0 z-50 w-72 bg-background border-r border-border shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "safe-top flex items-center justify-between px-5 pt-4 pb-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(false), className: "grid h-9 w-9 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-4 space-y-1", children: categoryFilters.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => selectCategory(cat.id), className: `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-accent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.label }),
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "catdot", className: "ml-auto h-2 w-2 rounded-full bg-primary-foreground" })
          ] }, cat.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "FlavorFlow · Browse by category" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(true), className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card active:scale-95 transition", id: "menu-hamburger", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Welcome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate font-display text-xl font-extrabold", children: user?.name || "User" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5" }),
          cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground", children: cartCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[73px] z-20 bg-background/90 backdrop-blur px-5 py-2 border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md flex gap-2 overflow-x-auto scrollbar-hide", children: categoryFilters.map((cat) => {
      const isActive = activeCategory === cat.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveCategory(cat.id), className: `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border hover:border-primary/40"}`, children: cat.label }, cat.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: activeCategory === "all" ? "All posts" : categoryFilters.find((c) => c.id === activeCategory)?.label || "Posts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
        loading && Array.from({
          length: 4
        }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 rounded-2xl bg-card animate-pulse" }, index)),
        !loading && filtered.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product }, product.id))
      ] }),
      !loading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: activeCategory === "all" ? "No posts available yet." : `No ${categoryFilters.find((c) => c.id === activeCategory)?.label?.toLowerCase()} posts available.` })
    ] })
  ] });
}
export {
  Home as component
};
