import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
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

export function orderStep(status: OrderStatus) {
  return statusRank[status] ?? 0;
}

export function listenCustomerOrders(customerId: string | undefined, cb: (orders: Order[]) => void) {
  if (!firestore || !customerId) {
    cb([]);
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("customerId", "==", customerId)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenVendorOrders(vendorId: string | undefined, cb: (orders: Order[]) => void) {
  if (!firestore || !vendorId) {
    cb([]);
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("vendorId", "==", vendorId)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenAvailableDeliveryOrders(cb: (orders: Order[]) => void) {
  if (!firestore) {
    cb([]);
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "orders"), where("status", "in", ["PLACED", "ACCEPTED", "PICKED_UP", "OUT_FOR_DELIVERY"]), limit(30)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenOrder(id: string, cb: (order: Order | null) => void) {
  if (!firestore) {
    cb(null);
    return () => undefined;
  }
  return onSnapshot(doc(firestore, "orders", id), (snap) => cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null));
}

export async function getLatestOrder(customerId: string | undefined) {
  if (!firestore || !customerId) return null;
  return new Promise<Order | null>((resolve) => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "orders"), where("customerId", "==", customerId), limit(1)),
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
    paymentStatus: "cod" as PaymentStatus,
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
  return updateOrderStatus(orderId, "ACCEPTED", { deliveryPartnerId });
}

export async function verifyDeliveryOtp(orderId: string, otp: string) {
  if (!firestore) return true;
  const snap = await getDoc(doc(firestore, "orders", orderId));
  const order = snap.exists() ? (snap.data() as Order) : null;
  if (!order || order.otp !== otp) return false;
  await updateOrderStatus(orderId, "DELIVERED");
  return true;
}
