import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { n as useOrder, o as orderStep } from "./router-P_1GDnq5.mjs";
import "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { f as CircleCheck, P as Package, v as Truck, x as Utensils } from "../_libs/lucide-react.mjs";
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
const steps = [{
  label: "Ordered",
  icon: CircleCheck
}, {
  label: "Accepted",
  icon: CircleCheck
}, {
  label: "Taken",
  icon: Package
}, {
  label: "On the way",
  icon: Truck
}, {
  label: "Reached",
  icon: Truck
}, {
  label: "Finished",
  icon: Utensils
}];
function Track() {
  const {
    id
  } = useParams({
    from: "/track/$id"
  });
  const order = useOrder(id);
  const activeStep = order ? orderStep(order.status) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-mesh pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Order timeline", subtitle: id }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md p-5", children: [
      order && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-gradient-warm p-5 text-white shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-90", children: "Payment completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-extrabold", children: order.status.replaceAll("_", " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm opacity-90", children: [
          order.address,
          " · ",
          order.timeSlot
        ] })
      ] }),
      order && order.status !== "FINISHED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Delivery OTP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-2", children: order.otp.split("").map((digit, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-10 place-items-center rounded-xl bg-accent font-display text-xl font-bold", children: digit }, index)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-5 rounded-2xl border border-border bg-card p-4", children: steps.map((step, index) => {
        const Icon = step.icon;
        const active = index <= activeStep;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 pb-5 last:pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-10 w-10 place-items-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: step.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: active ? "Updated" : "Waiting" })
          ] })
        ] }, step.label);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", className: "mt-6 block text-center text-sm font-bold text-primary", children: "Back home" })
    ] })
  ] });
}
export {
  Track as component
};
