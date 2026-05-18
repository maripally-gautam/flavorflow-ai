import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-KjELqb_D.mjs";
import { q as useRequireRole, h as useAuth, p as useProducts, t as useVendorOrders, d as deleteProduct, b as createProduct, f as firebaseStorage } from "./router-P_1GDnq5.mjs";
import { r as ref, u as uploadBytesResumable, g as getDownloadURL } from "../_libs/firebase__storage.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__messaging.mjs";
import { p as Settings, n as Plus, P as Package, T as Trash2, w as User, X, U as Upload } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
function uploadFile(path, file, onProgress) {
  if (!firebaseStorage) {
    onProgress?.(100);
    return Promise.resolve({ path, url: URL.createObjectURL(file) });
  }
  return new Promise((resolve, reject) => {
    const storageRef = ref(firebaseStorage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snapshot) => onProgress?.(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)),
      reject,
      async () => resolve({ path, url: await getDownloadURL(task.snapshot.ref) })
    );
  });
}
const categoryLabels = {
  food: "🍽️ Food",
  "trip-kit": "🏕️ Trip Kit",
  "gym-kit": "💪 Gym Kit",
  other: "📦 Other"
};
function Vendor() {
  useRequireRole(["vendor", "admin"]);
  const {
    profile
  } = useAuth();
  const vendorId = profile?.uid ?? "local-admin";
  const {
    products
  } = useProducts(vendorId);
  const orders = useVendorOrders(vendorId);
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [image, setImage] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  const [subItems, setSubItems] = reactExports.useState([{
    name: "",
    quantity: ""
  }]);
  const [posting, setPosting] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(null);
  const categoryDisplay = profile?.category === "other" && profile?.customCategory ? `📦 ${profile.customCategory}` : categoryLabels[profile?.category ?? "other"] ?? "📦 Other";
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    try {
      const path = `products/${Date.now()}_${file.name}`;
      const res = await uploadFile(path, file, (progress) => {
        setUploadProgress(progress);
      });
      setImage(res.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed", {
        description: error instanceof Error ? error.message : "Try again."
      });
    } finally {
      setUploadProgress(null);
    }
  };
  const publish = async () => {
    const cleanItems = subItems.filter((item) => item.name.trim() && item.quantity.trim());
    if (!name.trim() || !image.trim() || !price.trim() || cleanItems.length === 0) {
      toast.error("Add name, image, sub items, and amount");
      return;
    }
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setPosting(true);
    try {
      await createProduct({
        name: name.trim(),
        vendor: profile?.businessName || profile?.name || "Admin",
        vendorId,
        image: image.trim(),
        category: profile?.category ?? "other",
        price: amount,
        subItems: cleanItems,
        active: true
      });
      setName("");
      setImage("");
      setPrice("");
      setSubItems([{
        name: "",
        quantity: ""
      }]);
      setOpen(false);
      toast.success("Posted successfully");
    } catch (error) {
      toast.error("Post failed", {
        description: error instanceof Error ? error.message : "Check Firebase setup."
      });
    } finally {
      setPosting(false);
    }
  };
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { hideNav: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-extrabold", children: "Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: profile?.businessName || profile?.name || "Your posts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "grid h-11 w-11 place-items-center rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-md space-y-6 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-warm text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Your Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: categoryDisplay })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "All your posts are automatically listed under this category for users to browse." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Your posts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-accent px-3 py-1 text-xs font-bold", children: products.length })
        ] }),
        products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "h-44 w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold", children: [
                "Rs ",
                product.price
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1", children: product.subItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              item.name,
              ": ",
              item.quantity
            ] }, `${item.name}-${index}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleDelete(product.id), disabled: deletingId === product.id, className: "flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive disabled:opacity-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              deletingId === product.id ? "Deleting..." : "Delete"
            ] }) })
          ] })
        ] }, product.id)),
        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No posts yet. Use add to publish your first item." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Paid orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-accent px-3 py-1 text-xs font-bold", children: orders.length })
        ] }),
        orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "rounded-2xl border border-border bg-card p-4 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: order.status.replaceAll("_", " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 font-bold", children: order.items.map((item) => `${item.qty}x ${item.name}`).join(", ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              order.customerName || "Customer",
              " - ",
              order.timeSlot
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: order.address })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "Rs ",
            order.total
          ] })
        ] }) }, order.id)),
        orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground", children: "No paid orders yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "fixed bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/45 px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-h-full max-w-md overflow-auto rounded-2xl bg-background p-5 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Add post" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Category: ",
            categoryDisplay
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "grid h-9 w-9 place-items-center rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Name of curry, exercise kit, etc.", className: "w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-xl border border-border bg-accent/30 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-muted-foreground uppercase tracking-wider", children: "Product Image" }),
          image ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 w-full rounded-lg overflow-hidden border border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: "Preview", className: "h-full w-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setImage(""), className: "absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-4 bg-card hover:bg-accent/20 transition-all relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full", disabled: uploadProgress !== null }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted-foreground mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Upload from device" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground mt-0.5", children: "PNG, JPG, JPEG up to 5MB" })
          ] }),
          uploadProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-accent rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-1.5 rounded-full transition-all duration-300", style: {
              width: `${uploadProgress}%`
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              "Uploading: ",
              uploadProgress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-border/50 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: "Or paste URL:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: image, onChange: (e) => setImage(e.target.value), placeholder: "https://example.com/image.jpg", className: "flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          subItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_110px_36px] gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item.name, onChange: (e) => setSubItems((items) => items.map((entry, i) => i === index ? {
              ...entry,
              name: e.target.value
            } : entry)), placeholder: "Ingredient / dumbbell", className: "rounded-xl border border-border bg-card px-3 py-3 outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item.quantity, onChange: (e) => setSubItems((items) => items.map((entry, i) => i === index ? {
              ...entry,
              quantity: e.target.value
            } : entry)), placeholder: "Qty", className: "rounded-xl border border-border bg-card px-3 py-3 outline-none focus:border-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubItems((items) => items.length === 1 ? items : items.filter((_, i) => i !== index)), className: "rounded-xl border border-border", children: "x" })
          ] }, index)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSubItems((items) => [...items, {
            name: "",
            quantity: ""
          }]), className: "w-full rounded-xl border border-dashed border-border py-3 text-sm font-semibold", children: "+ Add sub item" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: price, onChange: (e) => setPrice(e.target.value), placeholder: "Amount", inputMode: "decimal", className: "w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: publish, disabled: posting, className: "w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-60", children: posting ? "Posting..." : "Post" })
      ] })
    ] }) })
  ] });
}
export {
  Vendor as component
};
