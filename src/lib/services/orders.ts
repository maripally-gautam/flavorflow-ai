import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { mockOrders } from "@/lib/mock-data";
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/types";
import type { Product } from "@/lib/mock-data";

type CartItem = { product: Product; qty: number };

const statusRank: Record<OrderStatus, number> = {
  PLACED: 0,
  ACCEPTED: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

function demoOrder(o: (typeof mockOrders)[number]): Order {
  const status: OrderStatus = o.status === "delivered" ? "DELIVERED" : "OUT_FOR_DELIVERY";
  return {
    id: o.id,
    customerId: "demo-customer",
    vendorId: o.vendor === "Spice Route Kitchen" ? "v1" : "v2",
    vendor: o.vendor,
    status,
    items: o.items.map((i) => ({ productId: i.name, name: i.name, qty: i.qty, price: i.price })),
    subtotal: o.total,
    deliveryFee: 0,
    taxes: 0,
    total: o.total,
    address: "302, Indiranagar 6th Main, Bengaluru",
    otp: "otp" in o ? o.otp : "1234",
    paymentMethod: "cod",
    paymentStatus: "cod",
    etaMinutes: "eta" in o ? o.eta : 0,
  };
}

export function orderStep(status: OrderStatus) {
  return statusRank[status] ?? 0;
}

export function listenCustomerOrders(customerId: string | undefined, cb: (orders: Order[]) => void) {
  if (!firestore || !customerId) {
    cb(mockOrders.map(demoOrder));
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("customerId", "==", customerId), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenVendorOrders(vendorId: string | undefined, cb: (orders: Order[]) => void) {
  if (!firestore || !vendorId) {
    cb(mockOrders.map(demoOrder).filter((o) => o.vendorId === "v1"));
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("vendorId", "==", vendorId), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenAvailableDeliveryOrders(cb: (orders: Order[]) => void) {
  if (!firestore) {
    cb(mockOrders.map(demoOrder).filter((o) => o.status === "ACCEPTED" || o.status === "PLACED"));
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("status", "in", ["ACCEPTED", "PLACED"]), limit(20)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenOrder(id: string, cb: (order: Order | null) => void) {
  if (!firestore) {
    cb(mockOrders.map(demoOrder).find((o) => o.id === id) ?? null);
    return () => undefined;
  }
  return onSnapshot(doc(firestore, "orders", id), (snap) => cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null));
}

export async function getLatestOrder(customerId: string | undefined) {
  if (!firestore || !customerId) return demoOrder(mockOrders[0]);
  return new Promise<Order | null>((resolve) => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "orders"), where("customerId", "==", customerId), orderBy("createdAt", "desc"), limit(1)),
      (snap) => {
        unsubscribe();
        resolve(snap.docs[0] ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Order) : null);
      },
    );
  });
}

export async function createOrder(input: {
  customerId: string;
  customerName?: string;
  cart: CartItem[];
  address: string;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  razorpayPaymentId?: string;
}) {
  if (!input.cart.length) throw new Error("Your cart is empty.");
  const vendorId = input.cart[0].product.vendorId;
  if (input.cart.some((item) => item.product.vendorId !== vendorId)) {
    throw new Error("Only one vendor is allowed per order.");
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const order = {
    customerId: input.customerId,
    customerName: input.customerName,
    vendorId,
    vendor: input.cart[0].product.vendor,
    status: "PLACED" as OrderStatus,
    items: input.cart.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      qty,
      price: product.price,
      image: product.image,
    })),
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    taxes: input.taxes,
    total: input.total,
    address: input.address,
    otp,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus ?? (input.paymentMethod === "cod" ? "cod" : "pending"),
    razorpayPaymentId: input.razorpayPaymentId,
    etaMinutes: 30,
    deliveryPartnerId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (!firestore) return { id: `ORD${Math.floor(Math.random() * 9000) + 1000}`, ...order } as Order;
  const ref = await addDoc(collection(firestore, "orders"), order);
  await addDoc(collection(firestore, "notifications"), {
    userId: input.customerId,
    type: "order",
    title: "Order placed",
    body: `${order.vendor} received your order.`,
    unread: true,
    orderId: ref.id,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...order } as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus, extra: Partial<Order> = {}) {
  if (!firestore) return;
  await updateDoc(doc(firestore, "orders", id), { status, ...extra, updatedAt: serverTimestamp() });
}

export async function acceptDeliveryOrder(orderId: string, deliveryPartnerId: string) {
  return updateOrderStatus(orderId, "PICKED_UP", { deliveryPartnerId });
}

export async function verifyDeliveryOtp(orderId: string, otp: string) {
  if (!firestore) return true;
  const snap = await getDoc(doc(firestore, "orders", orderId));
  const order = snap.exists() ? (snap.data() as Order) : null;
  if (!order || order.otp !== otp) return false;
  await updateOrderStatus(orderId, "DELIVERED");
  return true;
}
