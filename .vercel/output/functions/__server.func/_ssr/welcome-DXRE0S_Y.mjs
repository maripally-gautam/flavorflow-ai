import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { s as Sparkles, a as ArrowRight } from "../_libs/lucide-react.mjs";
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
const slides = [{
  title: "Curries crafted by\nlocal chefs",
  img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80"
}, {
  title: "Meal kits, ready\nin 25 minutes",
  img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80"
}, {
  title: "AI that knows\nwhat you crave",
  img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80"
}];
function Welcome() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-[60vh] grid grid-cols-3 gap-2 p-3 pt-12", children: slides.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        y: 40,
        opacity: 0
      }, animate: {
        y: i % 2 === 0 ? 0 : 16,
        opacity: 1
      }, transition: {
        delay: i * 0.12,
        type: "spring"
      }, className: "relative rounded-3xl overflow-hidden shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.img, className: "w-full h-full object-cover", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      y: 50,
      opacity: 0
    }, animate: {
      y: 0,
      opacity: 1
    }, transition: {
      delay: 0.3
    }, className: "px-6 pb-10 pt-6 bg-card rounded-t-[2rem] -mt-10 relative shadow-card safe-bottom", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 bg-border rounded-full mx-auto mb-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-ai" }),
        " Powered by AI"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-extrabold text-3xl leading-tight mt-3", children: [
        "Real food. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm", children: "Smart picks." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Delivered fast."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-2", children: "Order curries, AI-generated meal kits, or just the spices. Your kitchen, supercharged." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "mt-6 flex items-center justify-center gap-2 bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition", children: [
        "Get Started ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "block text-center mt-3 text-sm font-medium text-muted-foreground", children: "I already have an account" })
    ] })
  ] });
}
export {
  Welcome as component
};
