import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { g as useApp, h as useAuth, l as logout } from "./router-P_1GDnq5.mjs";
import "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { M as Mail, m as Phone, h as MapPin, P as Package, p as Settings, g as LogOut } from "../_libs/lucide-react.mjs";
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
const categoryLabels = {
  food: "🍽️ Food",
  "trip-kit": "🏕️ Trip Kit",
  "gym-kit": "💪 Gym Kit",
  other: "📦 Other"
};
const sampleAvatarUrl = "/sample-boy.svg";
function Profile() {
  const user = useApp((state) => state.user);
  const setUser = useApp((state) => state.setUser);
  const {
    profile
  } = useAuth();
  const nav = useNavigate();
  const signOut = async () => {
    await logout();
    setUser(null);
    nav({
      to: "/"
    });
  };
  const isVendor = user?.role === "vendor" || user?.role === "admin";
  const categoryDisplay = profile?.category === "other" && profile?.customCategory ? `📦 ${profile.customCategory}` : categoryLabels[profile?.category ?? "other"] ?? "📦 Other";
  const roleLinks = isVendor ? [{
    to: "/vendor",
    label: "Admin posts"
  }] : user?.role === "delivery" ? [{
    to: "/delivery",
    label: "Delivery orders"
  }] : [{
    to: "/home",
    label: "Order items"
  }, {
    to: "/orders",
    label: "My orders"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          profile?.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar, alt: profile.name, className: "h-16 w-16 rounded-2xl object-cover border-2 border-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sampleAvatarUrl, alt: "Sample profile avatar", className: "h-16 w-16 rounded-2xl object-cover border-2 border-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: user?.name || "Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm capitalize text-muted-foreground", children: user?.role || "guest" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          profile?.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            " ",
            profile.email
          ] }),
          profile?.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
            " ",
            profile.phone
          ] }),
          profile?.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            " ",
            profile.location
          ] })
        ] }),
        isVendor && profile?.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 rounded-xl bg-accent px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: categoryDisplay })
          ] }),
          profile?.businessName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: profile.businessName })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
        roleLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.to, className: "rounded-2xl border border-border bg-card p-4 text-center font-bold transition-all hover:border-primary/40 hover:shadow-glow/20 active:scale-[0.98]", children: item.label }, item.to)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/settings", className: "flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center font-bold transition-all hover:border-primary/40 active:scale-[0.98]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
          " Settings"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-4 font-bold text-destructive transition-all hover:bg-destructive/10 active:scale-[0.98]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Logout"
      ] })
    ] })
  ] });
}
export {
  Profile as component
};
