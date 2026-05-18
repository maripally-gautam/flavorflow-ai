import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, f as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { E as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { g as getAuth, G as GoogleAuthProvider, s as setPersistence, o as onAuthStateChanged, c as signOut, a as signInWithPopup, b as browserLocalPersistence } from "../_libs/firebase__auth.mjs";
import { i as initializeApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { f as getFirestore, g as getDoc, e as doc, u as updateDoc, s as serverTimestamp, b as arrayUnion, w as where, o as onSnapshot, q as query, c as collection, a as addDoc, d as deleteDoc, l as limit, h as orderBy, i as setDoc } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import { a as getStorage } from "../_libs/firebase__storage.mjs";
import { a as getToken, i as isWindowSupported, g as getMessagingInWindow } from "../_libs/firebase__messaging.mjs";
import { c as create, p as persist } from "../_libs/zustand.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { s as Sparkles, c as Bot, X, w as User, o as Send } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const firebaseConfig = {
  apiKey: "AIzaSyDYEMwPt94AVf8ErEenPOCXJzr9mBVFYNw",
  authDomain: "cooknet-d6797.firebaseapp.com",
  projectId: "cooknet-d6797",
  storageBucket: "cooknet-d6797.firebasestorage.app",
  messagingSenderId: "616407586003",
  appId: "1:616407586003:web:6b32be8d8ca66c8ab0f026"
};
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.storageBucket && firebaseConfig.messagingSenderId && firebaseConfig.appId
);
let app = null;
let auth = null;
let db = null;
let storage = null;
if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}
const firebaseApp = app;
const firebaseAuth = auth;
const firestore = db;
const firebaseStorage = storage;
new GoogleAuthProvider();
async function getFirebaseMessaging() {
  if (!firebaseApp || typeof window === "undefined") return null;
  const supported = await isWindowSupported();
  return supported ? getMessagingInWindow(firebaseApp) : null;
}
function requireFirebase() {
  if (!firebaseAuth || !firestore || !firebaseStorage) {
    throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* environment variables.");
  }
  return { auth: firebaseAuth, db: firestore, storage: firebaseStorage };
}
const localProfiles = {};
function removeUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).filter(([, entry]) => entry !== void 0).map(([key, entry]) => [key, removeUndefined(entry)])
    );
  }
  return value;
}
function onAuthChanged(cb) {
  if (!firebaseAuth) {
    cb(null);
    return () => void 0;
  }
  setPersistence(firebaseAuth, browserLocalPersistence).catch(console.warn);
  return onAuthStateChanged(firebaseAuth, cb);
}
async function getUserProfile(uid) {
  if (!firestore) return localProfiles[uid] ?? null;
  const snap = await getDoc(doc(firestore, "users", uid));
  if (snap.exists()) return { uid, ...snap.data() };
  return localProfiles[uid] ?? null;
}
async function upsertUserProfile(uid, profile) {
  const cleanProfile = removeUndefined(profile);
  const nextLocal = {
    ...localProfiles[uid] ?? { uid, name: "", role: "customer" },
    ...cleanProfile,
    uid
  };
  localProfiles[uid] = nextLocal;
  if (!firestore) {
    return nextLocal;
  }
  const ref = doc(firestore, "users", uid);
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    removeUndefined({
      ...cleanProfile,
      uid,
      updatedAt: serverTimestamp(),
      ...existing.exists() ? {} : { createdAt: serverTimestamp() }
    }),
    { merge: true }
  );
  return getUserProfile(uid);
}
function normalize(value) {
  return value?.trim().toLowerCase() ?? "";
}
async function resolveGoogleUser() {
  const { auth: auth2 } = requireFirebase();
  if (auth2.currentUser) return auth2.currentUser;
  const result = await signInWithPopup();
  return result.user;
}
async function signInWithGoogle() {
  const user = await resolveGoogleUser();
  const existing = await getUserProfile(user.uid);
  return upsertUserProfile(user.uid, {
    email: user.email ?? existing?.email ?? "",
    name: existing?.name || user.displayName || "FlavorFlow user",
    ...user.photoURL ? { avatar: user.photoURL } : {},
    role: existing?.role ?? "customer"
  });
}
async function signUpWithGoogle(role, profileData = {}) {
  const user = await resolveGoogleUser();
  const existing = await getUserProfile(user.uid);
  const typedName = profileData.name?.trim() ?? "";
  const googleEmail = user.email ?? "";
  if (!typedName) {
    throw new Error("Enter your name before continuing.");
  }
  if (existing) {
    const storedName = existing.name?.trim() ?? "";
    if (storedName && normalize(storedName) !== normalize(typedName)) {
      throw new Error("Name does not match this Google account.");
    }
    if (existing.email && googleEmail && normalize(existing.email) !== normalize(googleEmail)) {
      throw new Error("Google account email does not match the saved account.");
    }
  }
  return upsertUserProfile(user.uid, {
    email: googleEmail || existing?.email || "",
    name: existing?.name || typedName || user.displayName || "FlavorFlow user",
    ...user.photoURL ? { avatar: user.photoURL } : {},
    ...profileData,
    role: existing?.role ?? role
  });
}
async function logout() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
function listenNotifications(userId, cb) {
  if (!firestore || !userId) {
    cb([]);
    return () => void 0;
  }
  return onSnapshot(
    query(collection(firestore, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
async function registerFcmToken(uid) {
  const vapidKey = "G-95B8Q3EYR2";
  if (!firestore || !vapidKey || typeof Notification === "undefined") return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      await updateDoc(doc(firestore, "users", uid), {
        fcmTokens: arrayUnion(token),
        updatedAt: serverTimestamp()
      });
    }
    return token;
  } catch (error) {
    console.warn("FCM token registration failed:", error);
    return null;
  }
}
async function markNotificationsRead(userId, items) {
  if (!firestore || !userId) return;
  await Promise.all(
    items.filter((item) => item.unread).map((item) => updateDoc(doc(firestore, "notifications", item.id), { unread: false, updatedAt: serverTimestamp() }))
  );
}
async function createNotification(userId, data) {
  if (!firestore) return;
  await addDoc(collection(firestore, "notifications"), {
    userId,
    type: data.type,
    title: data.title,
    body: data.body,
    orderId: data.orderId ?? null,
    unread: true,
    createdAt: serverTimestamp()
  });
}
const useApp = create()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.product.id === product.id);
        if (exists) {
          set({
            cart: cart.map(
              (item) => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
            )
          });
        } else {
          set({ cart: [...cart, { product, qty: 1 }] });
        }
        return { ok: true };
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((item) => item.product.id !== id) }),
      setQty: (id, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((item) => item.product.id !== id) });
          return;
        }
        set({
          cart: get().cart.map((item) => item.product.id === id ? { ...item, qty } : item)
        });
      },
      clearCart: () => set({ cart: [] }),
      user: null,
      setUser: (user) => set({ user }),
      location: "",
      setLocation: (location) => set({ location }),
      theme: "dark",
      setTheme: (theme) => set({ theme })
    }),
    { name: "flavorflow" }
  )
);
const cartTotal = (cart) => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
const AuthContext = reactExports.createContext(null);
function routeForRole(role) {
  if (role === "vendor" || role === "admin") return "/vendor";
  if (role === "delivery") return "/delivery";
  return "/home";
}
function AuthProvider({ children }) {
  const [loading, setLoading] = reactExports.useState(true);
  const [profile, setProfile] = reactExports.useState(null);
  const [fcmRequested, setFcmRequested] = reactExports.useState(false);
  const setUser = useApp((s) => s.setUser);
  const refreshProfile = async (uidOverride) => {
    const uid = uidOverride ?? profile?.uid;
    if (!uid) return;
    const fresh = await getUserProfile(uid);
    setProfile(fresh);
    setUser(fresh ? { name: fresh.name, role: fresh.role, avatar: fresh.avatar } : null);
  };
  reactExports.useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    return onAuthChanged(async (user) => {
      if (!user) {
        setProfile(null);
        setUser(null);
        setLoading(false);
        return;
      }
      const next = await getUserProfile(user.uid);
      setProfile(next);
      setUser(next ? { name: next.name, role: next.role, avatar: next.avatar } : null);
      setLoading(false);
    });
  }, [setUser]);
  reactExports.useEffect(() => {
    if (!profile || fcmRequested) return;
    if (profile.role === "customer") {
      setFcmRequested(true);
      registerFcmToken(profile.uid).catch(console.warn);
    }
  }, [profile, fcmRequested]);
  const value = reactExports.useMemo(
    () => ({ firebaseReady: isFirebaseConfigured, loading, profile, role: profile?.role ?? null, refreshProfile }),
    [loading, profile]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
function useRequireRole(roles) {
  const auth2 = useAuth();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (auth2.loading || !auth2.firebaseReady) return;
    if (!auth2.profile) nav({ to: "/login" });
    else if (roles?.length && !roles.includes(auth2.profile.role)) nav({ to: routeForRole(auth2.profile.role) });
  }, [auth2.loading, auth2.firebaseReady, auth2.profile, nav, roles]);
  return auth2;
}
function listenProducts(cb, vendorId) {
  if (!firestore) {
    cb([]);
    return () => void 0;
  }
  const constraints = vendorId ? [where("vendorId", "==", vendorId)] : [];
  return onSnapshot(query(collection(firestore, "products"), ...constraints), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
async function createProduct(product) {
  if (!firestore) return `local-${Date.now()}`;
  const ref = await addDoc(collection(firestore, "products"), {
    ...product,
    active: product.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}
async function updateProduct(id, product) {
  if (!firestore) return;
  await updateDoc(doc(firestore, "products", id), { ...product, updatedAt: serverTimestamp() });
}
async function deleteProduct(id) {
  if (!firestore) return;
  await deleteDoc(doc(firestore, "products", id));
}
const statusRank = {
  ORDERED: 0,
  ACCEPTED: 1,
  TAKEN: 2,
  ON_THE_WAY: 3,
  REACHED: 4,
  FINISHED: 5
};
const statusMessages = {
  ORDERED: { title: "🛒 Order Placed!", body: "Your order has been placed successfully." },
  ACCEPTED: { title: "✅ Order Accepted!", body: "A delivery partner has accepted your order." },
  TAKEN: { title: "📦 Order Picked Up", body: "Your order has been picked up and is being prepared." },
  ON_THE_WAY: { title: "🚗 On the Way!", body: "Your order is on its way to you." },
  REACHED: { title: "📍 Delivery Reached", body: "The delivery partner has reached your location." },
  FINISHED: { title: "🎉 Order Delivered!", body: "Your order has been delivered. Enjoy!" }
};
function orderStep(status) {
  return statusRank[status] ?? 0;
}
function listenCustomerOrders(customerId, cb) {
  if (!firestore || !customerId) {
    cb([]);
    return () => void 0;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("customerId", "==", customerId)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
function listenVendorOrders(vendorId, cb) {
  if (!firestore || !vendorId) {
    cb([]);
    return () => void 0;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("vendorId", "==", vendorId)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
function listenAvailableDeliveryOrders(cb) {
  if (!firestore) {
    cb([]);
    return () => void 0;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("status", "in", ["ORDERED", "ACCEPTED", "TAKEN", "ON_THE_WAY", "REACHED"]), limit(50)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
function listenOrder(id, cb) {
  if (!firestore) {
    cb(null);
    return () => void 0;
  }
  return onSnapshot(
    doc(firestore, "orders", id),
    (snap) => cb(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  );
}
async function createOrder(input) {
  if (!input.cart.length) throw new Error("Your cart is empty.");
  if (!input.timeSlot) throw new Error("Select a delivery time slot.");
  const vendorId = input.cart[0].product.vendorId;
  if (input.cart.some((item) => item.product.vendorId !== vendorId)) {
    throw new Error("Cart can contain items from only one admin at a time.");
  }
  const otp = Math.floor(1e3 + Math.random() * 9e3).toString();
  const order = {
    customerId: input.customerId,
    customerName: input.customerName,
    vendorId,
    vendor: input.cart[0].product.vendor,
    status: "ORDERED",
    items: input.cart.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      qty,
      price: product.price,
      image: product.image
    })),
    subtotal: input.subtotal,
    total: input.total,
    address: input.address,
    timeSlot: input.timeSlot,
    otp,
    paymentStatus: "completed",
    deliveryPartnerId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  if (!firestore) return { id: `ORD${Date.now()}`, ...order };
  const ref = await addDoc(collection(firestore, "orders"), order);
  const createdOrder = { id: ref.id, ...order };
  try {
    await createNotification(input.customerId, {
      title: "💰 Payment Successful!",
      body: `Payment of Rs ${input.total} completed successfully.`,
      type: "order",
      orderId: ref.id
    });
    await createNotification(input.customerId, {
      title: statusMessages.ORDERED.title,
      body: statusMessages.ORDERED.body,
      type: "order",
      orderId: ref.id
    });
  } catch (error) {
    console.warn("Notification creation failed:", error);
  }
  return createdOrder;
}
async function updateOrderStatus(id, status, extra = {}) {
  if (!firestore) return;
  await updateDoc(doc(firestore, "orders", id), { status, ...extra, updatedAt: serverTimestamp() });
  try {
    const snap = await getDoc(doc(firestore, "orders", id));
    if (snap.exists()) {
      const order = snap.data();
      const msg = statusMessages[status];
      if (msg && order.customerId) {
        await createNotification(order.customerId, {
          title: msg.title,
          body: msg.body,
          type: "order",
          orderId: id
        });
      }
    }
  } catch (error) {
    console.warn("Notification creation failed:", error);
  }
}
async function verifyDeliveryOtp(orderId, otp) {
  if (!firestore) return otp.length === 4;
  const snap = await getDoc(doc(firestore, "orders", orderId));
  const order = snap.exists() ? snap.data() : null;
  if (!order || order.otp !== otp) return false;
  await updateOrderStatus(orderId, "FINISHED");
  return true;
}
function useProducts(vendorId) {
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => listenProducts((items) => {
    setProducts(items);
    setLoading(false);
  }, vendorId), [vendorId]);
  return { products, loading };
}
function useCustomerOrders(customerId) {
  const [orders, setOrders] = reactExports.useState([]);
  reactExports.useEffect(() => listenCustomerOrders(customerId, setOrders), [customerId]);
  return orders;
}
function useVendorOrders(vendorId) {
  const [orders, setOrders] = reactExports.useState([]);
  reactExports.useEffect(() => listenVendorOrders(vendorId, setOrders), [vendorId]);
  return orders;
}
function useAvailableDeliveryOrders() {
  const [orders, setOrders] = reactExports.useState([]);
  reactExports.useEffect(() => listenAvailableDeliveryOrders(setOrders), []);
  return orders;
}
function useOrder(id) {
  const [order, setOrder] = reactExports.useState(null);
  reactExports.useEffect(() => listenOrder(id, setOrder), [id]);
  return order;
}
function useNotifications(userId) {
  const [notifications, setNotifications] = reactExports.useState([]);
  reactExports.useEffect(() => listenNotifications(userId, setNotifications), [userId]);
  return notifications;
}
const GEMINI_KEY = "AIzaSyCbjsCXV9aX4YKhagG1nJA_HLa5gImEfFs";
function buildSystemPrompt(role, profile, context) {
  const base = `You are FlowBot, the AI assistant for FlavorFlow app. You speak naturally and are helpful. Keep responses concise (2-3 sentences max unless asked for details). Use friendly casual language. You have FULL access to automate the app.

Current user: ${profile?.name || "Unknown"} (Role: ${role})
`;
  if (role === "vendor" || role === "admin") {
    return `${base}
You are helping a VENDOR/ADMIN manage their store.
Their category: ${profile?.category || "other"}${profile?.customCategory ? ` (${profile.customCategory})` : ""}
Their business: ${profile?.businessName || "Not set"}

CAPABILITIES (respond with JSON action when user wants to do these):
- ADD ITEM: When user wants to add/post/create a product, extract name, image URL, price, and sub-items. Respond with: {"action":"add_item","name":"...","image":"...","price":number,"subItems":[{"name":"...","quantity":"..."}]}
- DELETE ITEM: When user wants to delete/remove a product. Respond with: {"action":"delete_item","productId":"..."}
- MODIFY ITEM: When user wants to update/edit/change a product. Respond with: {"action":"update_item","productId":"...","updates":{...}}
- LIST ITEMS: When user wants to see their products, just describe them in text.

Current products (${context.products?.length || 0}):
${context.products?.map((p) => `- ${p.name} (Rs ${p.price}, ID: ${p.id})`).join("\n") || "None"}

Current orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ${o.items.map((i) => i.name).join(", ")} | Status: ${o.status} | Rs ${o.total}`).join("\n") || "None"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action on a new line wrapped in \`\`\`json code block.
For regular conversation, just respond normally without any JSON.`;
  }
  if (role === "delivery") {
    return `${base}
You are helping a DELIVERY PERSON manage their deliveries.

CAPABILITIES:
- ACCEPT ORDER: {"action":"accept_order","orderId":"..."}
- UPDATE STATUS: {"action":"update_status","orderId":"...","status":"TAKEN|ON_THE_WAY|REACHED"}
- VERIFY OTP: {"action":"verify_otp","orderId":"...","otp":"..."}
- LIST ORDERS: Just describe available orders in text.

Available orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ID: ${o.id.slice(0, 8)}... | ${o.items.map((i) => i.name).join(", ")} | ${o.address} | Status: ${o.status} | Rs ${o.total}`).join("\n") || "None"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action in a \`\`\`json code block.
For regular conversation, just respond normally.`;
  }
  return `${base}
You are helping a USER browse and order items.

CAPABILITIES:
- ADD TO CART: {"action":"add_to_cart","productId":"..."}
- VIEW CART: {"action":"view_cart"}
- PLACE ORDER: {"action":"place_order"}
- TRACK ORDER: {"action":"track_order","orderId":"..."}
- SEARCH ITEMS: Just list matching products in text.

Available products (${context.products?.length || 0}):
${context.products?.map((p) => `- ${p.name} by ${p.vendor} | Rs ${p.price} | Category: ${p.category} | ID: ${p.id}`).join("\n") || "None"}

User's orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ${o.items.map((i) => i.name).join(", ")} | Status: ${o.status} | Rs ${o.total} | ID: ${o.id.slice(0, 8)}...`).join("\n") || "None"}

Cart items (${context.cart?.length || 0}):
${context.cart?.map((c) => `- ${c.product.name} x${c.qty}`).join("\n") || "Empty"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action in a \`\`\`json code block.
For regular conversation, just respond normally.`;
}
function extractAction(text) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch {
    return null;
  }
}
function cleanBotResponse(text) {
  return text.replace(/```json[\s\S]*?```/g, "").trim();
}
async function sendChatMessage(message, history, role, profile, context) {
  const systemPrompt = buildSystemPrompt(role, profile, context);
  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm FlowBot, ready to help you with FlavorFlow. What can I do for you?" }] },
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    })),
    { role: "user", parts: [{ text: message }] }
  ];
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    }
  );
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't process that. Please try again.";
  const action = extractAction(text);
  return { text: cleanBotResponse(text), action };
}
function ChatBubble() {
  const { profile, role } = useAuth();
  useNavigate();
  useApp((s) => s.cart);
  useApp((s) => s.addToCart);
  if (!profile || !role) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ChatBubbleInner, { role });
}
function ChatBubbleInner({ role }) {
  const { profile } = useAuth();
  const nav = useNavigate();
  const cart = useApp((s) => s.cart);
  const addToCart = useApp((s) => s.addToCart);
  const vendorId = profile?.uid ?? "";
  const isVendor = role === "vendor" || role === "admin";
  const isDelivery = role === "delivery";
  const { products } = useProducts(isVendor ? vendorId : void 0);
  const vendorOrders = useVendorOrders(isVendor ? vendorId : void 0);
  const customerOrders = useCustomerOrders(!isVendor && !isDelivery ? profile?.uid : void 0);
  const deliveryOrders = useAvailableDeliveryOrders();
  const orders = isVendor ? vendorOrders : isDelivery ? deliveryOrders : customerOrders;
  const [open, setOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    {
      id: "welcome",
      role: "bot",
      text: `Hey ${profile?.name?.split(" ")[0] || "there"}! 👋 I'm FlowBot, your FlavorFlow assistant. How can I help you today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  reactExports.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  const executeAction = reactExports.useCallback(async (action) => {
    try {
      switch (action.action) {
        case "add_item":
          await createProduct({
            name: action.name,
            vendor: profile?.businessName || profile?.name || "Admin",
            vendorId: profile?.uid || "",
            image: action.image,
            category: profile?.category ?? "other",
            price: action.price,
            subItems: action.subItems || [],
            active: true
          });
          toast.success(`Added "${action.name}" to your posts`);
          break;
        case "delete_item":
          await deleteProduct(action.productId);
          toast.success("Product deleted");
          break;
        case "update_item":
          await updateProduct(action.productId, action.updates);
          toast.success("Product updated");
          break;
        case "accept_order":
          await updateOrderStatus(action.orderId, "ACCEPTED", { deliveryPartnerId: profile?.uid });
          toast.success("Order accepted!");
          break;
        case "update_status":
          await updateOrderStatus(action.orderId, action.status, { deliveryPartnerId: profile?.uid });
          toast.success(`Order marked as ${action.status.toLowerCase().replace(/_/g, " ")}`);
          break;
        case "verify_otp":
          const ok = await verifyDeliveryOtp(action.orderId, action.otp);
          if (ok) toast.success("OTP verified! Order complete.");
          else toast.error("Incorrect OTP");
          break;
        case "add_to_cart": {
          const product = products.find((p) => p.id === action.productId);
          if (product) {
            addToCart(product);
            toast.success(`Added ${product.name} to cart`);
          } else {
            toast.error("Product not found");
          }
          break;
        }
        case "view_cart":
          nav({ to: "/cart" });
          setOpen(false);
          break;
        case "place_order":
          nav({ to: "/checkout" });
          setOpen(false);
          break;
        case "track_order":
          nav({ to: "/track/$id", params: { id: action.orderId } });
          setOpen(false);
          break;
      }
    } catch (error) {
      toast.error("Action failed", { description: error instanceof Error ? error.message : "Try again." });
    }
  }, [profile, products, addToCart, nav]);
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.filter((m) => m.id !== "welcome").map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }));
      const context = { products, orders, cart };
      const result = await sendChatMessage(text, history, role, profile, context);
      const botMsg = { id: `b-${Date.now()}`, role: "bot", text: result.text, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      if (result.action) {
        await executeAction(result.action);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "bot", text: "Sorry, something went wrong. Please try again.", timestamp: Date.now() }
      ]);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: !open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        onClick: () => setOpen(true),
        className: "fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-ai text-white shadow-ai",
        style: { cursor: "grab" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 100, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 100, scale: 0.9 },
        transition: { type: "spring", damping: 25, stiffness: 300 },
        className: "fixed bottom-4 right-4 left-4 z-50 mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-2xl sm:left-auto sm:w-[380px]",
        style: { maxHeight: "75vh" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-gradient-ai px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-white", children: "FlowBot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70", children: "Your FlavorFlow AI assistant" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-hide", style: { maxHeight: "50vh" }, children: [
            messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-7 w-7 shrink-0 place-items-center rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-ai text-white"}`, children: msg.role === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`, children: msg.text })
            ] }, msg.id)),
            loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-ai text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "0ms" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "150ms" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground", style: { animationDelay: "300ms" } })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(),
                placeholder: "Ask FlowBot anything...",
                className: "flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary",
                disabled: loading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleSend,
                disabled: loading || !input.trim(),
                className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white shadow-ai disabled:opacity-40",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ]
      }
    ) })
  ] });
}
const appCss = "/assets/styles-BDcXxQSS.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", className: "mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Go home" })
  ] }) });
}
function ErrorComponent({ reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page did not load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Try again or go back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-input px-4 py-2 text-sm font-medium", children: "Go home" })
    ] })
  ] }) });
}
const Route$h = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FlavorFlow" },
      { name: "description", content: "Post items, order them, and track delivery." },
      { name: "author", content: "FlavorFlow" },
      { name: "theme-color", content: "#f97316" },
      { property: "og:title", content: "FlavorFlow" },
      { property: "og:description", content: "Admin posts, user orders, and delivery tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$h.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSync, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChatBubble, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true, closeButton: true })
    ] })
  ] });
}
function ThemeSync() {
  const theme = useApp((state) => state.theme ?? "dark");
  reactExports.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return null;
}
const $$splitComponentImporter$f = () => import("./welcome-DXRE0S_Y.mjs");
const Route$g = createFileRoute("/welcome")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./vendor-DLT2qtRV.mjs");
const Route$f = createFileRoute("/vendor")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./signup-BYIcaCRt.mjs");
const Route$e = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./settings-DOG6Eg2U.mjs");
const Route$d = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./search-BUMVbIvH.mjs");
const Route$c = createFileRoute("/search")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./profile-CSswt761.mjs");
const Route$b = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./orders-DAC2Zn8D.mjs");
const Route$a = createFileRoute("/orders")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./notifications-B3JyNhRO.mjs");
const Route$9 = createFileRoute("/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const Route$8 = createFileRoute("/meal-kit")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  }
});
const $$splitComponentImporter$7 = () => import("./login-Bg_g9W7x.mjs");
const Route$7 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./home-Bghlydk9.mjs");
const Route$6 = createFileRoute("/home")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./delivery-B-jZL0HY.mjs");
const Route$5 = createFileRoute("/delivery")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./checkout-Bwqz780a.mjs");
const Route$4 = createFileRoute("/checkout")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./cart-CtbmoxYW.mjs");
const Route$3 = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-Dx_SyYhG.mjs");
const Route$2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./track._id-D9w6TYbm.mjs");
const Route$1 = createFileRoute("/track/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./product._id-CNpj68oY.mjs");
const Route = createFileRoute("/product/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WelcomeRoute = Route$g.update({
  id: "/welcome",
  path: "/welcome",
  getParentRoute: () => Route$h
});
const VendorRoute = Route$f.update({
  id: "/vendor",
  path: "/vendor",
  getParentRoute: () => Route$h
});
const SignupRoute = Route$e.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$h
});
const SettingsRoute = Route$d.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$h
});
const SearchRoute = Route$c.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$h
});
const ProfileRoute = Route$b.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$h
});
const OrdersRoute = Route$a.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => Route$h
});
const NotificationsRoute = Route$9.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$h
});
const MealKitRoute = Route$8.update({
  id: "/meal-kit",
  path: "/meal-kit",
  getParentRoute: () => Route$h
});
const LoginRoute = Route$7.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$h
});
const HomeRoute = Route$6.update({
  id: "/home",
  path: "/home",
  getParentRoute: () => Route$h
});
const DeliveryRoute = Route$5.update({
  id: "/delivery",
  path: "/delivery",
  getParentRoute: () => Route$h
});
const CheckoutRoute = Route$4.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$h
});
const CartRoute = Route$3.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$h
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$h
});
const TrackIdRoute = Route$1.update({
  id: "/track/$id",
  path: "/track/$id",
  getParentRoute: () => Route$h
});
const ProductIdRoute = Route.update({
  id: "/product/$id",
  path: "/product/$id",
  getParentRoute: () => Route$h
});
const rootRouteChildren = {
  IndexRoute,
  CartRoute,
  CheckoutRoute,
  DeliveryRoute,
  HomeRoute,
  LoginRoute,
  MealKitRoute,
  NotificationsRoute,
  OrdersRoute,
  ProfileRoute,
  SearchRoute,
  SettingsRoute,
  SignupRoute,
  VendorRoute,
  WelcomeRoute,
  ProductIdRoute,
  TrackIdRoute
};
const routeTree = Route$h._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  createOrder as a,
  createProduct as b,
  cartTotal as c,
  deleteProduct as d,
  signUpWithGoogle as e,
  firebaseStorage as f,
  useApp as g,
  useAuth as h,
  useAvailableDeliveryOrders as i,
  useCustomerOrders as j,
  useNotifications as k,
  logout as l,
  markNotificationsRead as m,
  useOrder as n,
  orderStep as o,
  useProducts as p,
  useRequireRole as q,
  router as r,
  signInWithGoogle as s,
  useVendorOrders as t,
  updateOrderStatus as u,
  verifyDeliveryOtp as v
};
