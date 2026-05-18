import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouter } from "../_libs/tanstack__react-router.mjs";
import { e as ChevronLeft } from "../_libs/lucide-react.mjs";
function PageHeader({ title, subtitle, right, sticky = true }) {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${sticky ? "sticky top-0 z-30" : ""} glass safe-top px-4 pb-3 pt-3 border-b border-border/50`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => router.history.back(), className: "w-9 h-9 grid place-items-center rounded-xl bg-card border border-border active:scale-90 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-lg leading-tight truncate", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: subtitle })
    ] }),
    right
  ] }) });
}
export {
  PageHeader as P
};
