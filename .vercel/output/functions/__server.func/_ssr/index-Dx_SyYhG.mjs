import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { d as ChefHat, s as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function Splash() {
  const nav = useNavigate();
  reactExports.useEffect(() => {
    const t = setTimeout(() => nav({
      to: "/welcome"
    }), 1800);
    return () => clearTimeout(t);
  }, [nav]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden bg-gradient-sunset grid place-items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh opacity-60" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0_0_0/0.3),transparent_60%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      scale: 0.6,
      opacity: 0
    }, animate: {
      scale: 1,
      opacity: 1
    }, transition: {
      type: "spring",
      duration: 0.9
    }, className: "relative text-center text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { animate: {
        y: [0, -8, 0]
      }, transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }, className: "relative mx-auto w-24 h-24 rounded-3xl glass-dark border border-white/30 grid place-items-center mb-6 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "w-12 h-12", strokeWidth: 2.2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
          scale: 0
        }, animate: {
          scale: 1
        }, transition: {
          delay: 0.5,
          type: "spring"
        }, className: "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-ember" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-extrabold text-5xl tracking-tight", children: "FlavorFlow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/85 text-sm font-medium tracking-wide", children: "POST. ORDER. DELIVER." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, transition: {
      delay: 1.2
    }, className: "absolute bottom-12 text-white/70 text-xs", children: "Simple ordering for local posts" })
  ] });
}
export {
  Splash as component
};
