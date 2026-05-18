import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageHeader } from "./PageHeader-Dn_8nWXm.mjs";
import { g as useApp, h as useAuth, s as signInWithGoogle } from "./router-P_1GDnq5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
function Login() {
  const [loading, setLoading] = reactExports.useState(false);
  const nav = useNavigate();
  const setUser = useApp((s) => s.setUser);
  const {
    profile,
    loading: authLoading,
    refreshProfile
  } = useAuth();
  const routeForRole = (role) => role === "vendor" || role === "admin" ? "/vendor" : role === "delivery" ? "/delivery" : "/home";
  reactExports.useEffect(() => {
    if (authLoading || !profile) return;
    nav({
      to: routeForRole(profile.role)
    });
  }, [authLoading, nav, profile]);
  const google = async () => {
    setLoading(true);
    try {
      const profile2 = await signInWithGoogle();
      if (profile2) {
        setUser({
          name: profile2.name,
          role: profile2.role,
          avatar: profile2.avatar
        });
        await refreshProfile(profile2.uid);
      }
      nav({
        to: routeForRole(profile2?.role)
      });
    } catch (error) {
      toast.error("Google sign-in failed", {
        description: error instanceof Error ? error.message : "Try again."
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-mesh", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Welcome back", sticky: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-extrabold text-3xl", children: [
        "Sign in to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm", children: "FlavorFlow" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Continue with Google to open your role-based dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: google, disabled: loading, className: "mt-8 w-full flex items-center justify-center gap-3 py-4 bg-card border border-border rounded-2xl font-medium text-sm active:scale-[0.98] transition disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285f4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34a853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#fbbc04", d: "M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#ea4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" })
        ] }),
        loading ? "Opening Google..." : "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: [
        "New here? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-primary font-semibold", children: "Choose your role" })
      ] })
    ] })
  ] });
}
export {
  Login as component
};
