import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as useApp, h as useAuth, e as signUpWithGoogle } from "./router-P_1GDnq5.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/firebase__messaging.mjs";
import { e as ChevronLeft, t as Store, w as User, b as Bike, F as FileCheck, f as CircleCheck } from "../_libs/lucide-react.mjs";
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
async function verifyFssaiCertificate(file) {
  if (!file) return { status: "invalid", trustScore: 0 };
  const key = "AIzaSyCbjsCXV9aX4YKhagG1nJA_HLa5gImEfFs";
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Verify whether this is an FSSAI-approved food license. Return only JSON with keys status(valid|invalid|needs_review), trustScore, reason."
              },
              { inlineData: { mimeType: file.type || "image/jpeg", data: base64 } }
            ]
          }
        ],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"status":"needs_review","trustScore":50}');
}
const roleOptions = [{
  id: "admin",
  label: "Admin",
  detail: "Post food, trip kits, gym kits, and more.",
  icon: Store
}, {
  id: "customer",
  label: "User",
  detail: "Order posted items and track delivery.",
  icon: User
}, {
  id: "delivery",
  label: "Delivery Person",
  detail: "Accept paid orders and update delivery.",
  icon: Bike
}];
const categories = [{
  id: "food",
  label: "Food"
}, {
  id: "trip-kit",
  label: "Trip kit"
}, {
  id: "gym-kit",
  label: "Gym kit"
}, {
  id: "other",
  label: "Other"
}];
function Signup() {
  const nav = useNavigate();
  const setUser = useApp((state) => state.setUser);
  const setLocation = useApp((state) => state.setLocation);
  const {
    profile,
    loading: authLoading,
    refreshProfile
  } = useAuth();
  const [role, setRole] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [location, setLocationValue] = reactExports.useState("");
  const [businessName, setBusinessName] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("food");
  const [customCategory, setCustomCategory] = reactExports.useState("");
  const [license, setLicense] = reactExports.useState(null);
  const [licenseVerified, setLicenseVerified] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const isAdminRole = role === "admin" || role === "vendor";
  const needsLicense = isAdminRole && category === "food";
  const detailsComplete = reactExports.useMemo(() => {
    const base = name.trim() && phone.trim() && location.trim();
    if (isAdminRole) {
      const catOk = category !== "other" || customCategory.trim().length > 0;
      return Boolean(base && businessName.trim() && category && catOk);
    }
    return Boolean(base);
  }, [businessName, category, customCategory, isAdminRole, location, name, phone]);
  const routeForRole = (value) => value === "vendor" || value === "admin" ? "/vendor" : value === "delivery" ? "/delivery" : "/home";
  reactExports.useEffect(() => {
    if (authLoading || !profile) return;
    nav({
      to: routeForRole(profile.role)
    });
  }, [authLoading, nav, profile]);
  const completeSignup = async () => {
    if (!role) return;
    if (!detailsComplete) {
      toast.error("Complete all required details");
      return;
    }
    if (needsLicense && !licenseVerified) {
      toast.error("Verify the FSSAI license first");
      return;
    }
    setBusy(true);
    try {
      const profile2 = await signUpWithGoogle(role, {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        businessName: businessName.trim() || void 0,
        category: isAdminRole ? category : void 0,
        customCategory: isAdminRole && category === "other" ? customCategory.trim() : void 0,
        fssaiVerified: needsLicense ? licenseVerified : void 0
      });
      const resolvedRole = profile2?.role ?? role;
      setUser({
        name: profile2?.name || name,
        role: resolvedRole,
        avatar: profile2?.avatar
      });
      setLocation(profile2?.location || location.trim());
      if (profile2) await refreshProfile(profile2.uid);
      nav({
        to: routeForRole(resolvedRole)
      });
    } catch (error) {
      toast.error("Google sign in failed", {
        description: error instanceof Error ? error.message : "Check Firebase auth setup."
      });
    } finally {
      setBusy(false);
    }
  };
  const verifyLicense = async () => {
    if (!license) {
      toast.error("Upload the FSSAI license first");
      return;
    }
    setBusy(true);
    try {
      const result = await verifyFssaiCertificate(license);
      if (result.status === "invalid" || Number(result.trustScore ?? 0) < 50) {
        toast.error("License could not be verified", {
          description: result.reason ?? "Upload a clear FSSAI-approved license."
        });
        return;
      }
      setLicenseVerified(true);
      toast.success("FSSAI license verified by AI");
    } catch (error) {
      toast.error("AI verification failed", {
        description: error instanceof Error ? error.message : "Try another file."
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background bg-mesh", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "safe-top mx-auto max-w-md px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => role ? setRole(null) : nav({
      to: "/welcome"
    }), className: "grid h-10 w-10 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-md px-6 pb-24 pt-8", children: !role ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold", children: "Create your account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Choose one role to continue." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-3", children: roleOptions.map((option) => {
        const Icon = option.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRole(option.id), className: "flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-all hover:border-primary/40 hover:shadow-glow/20 active:scale-[0.98]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-bold", children: option.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: option.detail })
          ] })
        ] }, option.id);
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold", children: isAdminRole ? "Admin sign up" : role === "delivery" ? "Delivery sign up" : "User sign up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Name", className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "Phone number", inputMode: "tel", className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: location, onChange: (e) => setLocationValue(e.target.value), placeholder: "Location", className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
        isAdminRole && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: businessName, onChange: (e) => setBusinessName(e.target.value), placeholder: "Business name", className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: category, onChange: (e) => {
            setCategory(e.target.value);
            setLicenseVerified(false);
          }, className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary", children: categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.label }, item.id)) }),
          category === "other" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: customCategory, onChange: (e) => setCustomCategory(e.target.value), placeholder: "Enter your custom category name", className: "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" })
        ] })
      ] }),
      needsLicense && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5 rounded-2xl border border-dashed border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold", children: "FSSAI-approved food license" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Food vendors must verify the license with AI." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*,application/pdf", onChange: (e) => {
          setLicense(e.target.files?.[0] ?? null);
          setLicenseVerified(false);
        }, className: "mt-4 block w-full text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: verifyLicense, disabled: busy || licenseVerified, className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-semibold text-background disabled:opacity-60", children: [
          licenseVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          licenseVerified ? "Verified" : busy ? "Verifying..." : "Verify with AI"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: completeSignup, disabled: busy || !detailsComplete || needsLicense && !licenseVerified, className: "mt-6 w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-50", children: busy ? "Please wait..." : isAdminRole ? "Sign in admin with Google" : "Sign in with Google" })
    ] }) })
  ] });
}
export {
  Signup as component
};
