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
import { createNotification } from "@/lib/services/notifications";
import type { LiveProduct, Order, OrderStatus } from "@/lib/types";

type CartItem = { product: LiveProduct; qty: number };

const statusRank: Record<OrderStatus, number> = {
  ORDERED: 0,
  ACCEPTED: 1,
  TAKEN: 2,
  ON_THE_WAY: 3,
  REACHED: 4,
  FINISHED: 5,
};

const statusMessages: Record<OrderStatus, { title: string; body: string }> = {
  ORDERED: { title: "🛒 Order Placed!", body: "Your order has been placed successfully." },
  ACCEPTED: { title: "✅ Order Accepted!", body: "A delivery partner has accepted your order." },
  TAKEN: { title: "📦 Order Picked Up", body: "Your order has been picked up and is being prepared." },
  ON_THE_WAY: { title: "🚗 On the Way!", body: "Your order is on its way to you." },
  REACHED: { title: "📍 Delivery Reached", body: "The delivery partner has reached your location." },
  FINISHED: { title: "🎉 Order Delivered!", body: "Your order has been delivered. Enjoy!" },
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
    query(collection(firestore, "orders"), where("status", "in", ["ORDERED", "ACCEPTED", "TAKEN", "ON_THE_WAY", "REACHED"]), limit(50)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order)),
  );
}

export function listenOrder(id: string, cb: (order: Order | null) => void) {
  if (!firestore) {
    cb(null);
    return () => undefined;
  }
  return onSnapshot(doc(firestore, "orders", id), (snap) =>
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null),
  );
}

export async function createOrder(input: {
  customerId: string;
  customerName?: string;
  cart: CartItem[];
  address: string;
  timeSlot: string;
  subtotal: number;
  total: number;
}) {
  if (!input.cart.length) throw new Error("Your cart is empty.");
  if (!input.timeSlot) throw new Error("Select a delivery time slot.");

  const vendorId = input.cart[0].product.vendorId;
  if (input.cart.some((item) => item.product.vendorId !== vendorId)) {
    throw new Error("Cart can contain items from only one admin at a time.");
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const order = {
    customerId: input.customerId,
    customerName: input.customerName,
    vendorId,
    vendor: input.cart[0].product.vendor,
    status: "ORDERED" as OrderStatus,
    items: input.cart.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      qty,
      price: product.price,
      image: product.image,
    })),
    subtotal: input.subtotal,
    total: input.total,
    address: input.address,
    timeSlot: input.timeSlot,
    otp,
    paymentStatus: "completed" as const,
    deliveryPartnerId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!firestore) return { id: `ORD${Date.now()}`, ...order } as Order;
  const ref = await addDoc(collection(firestore, "orders"), order);
  const createdOrder = { id: ref.id, ...order } as Order;

  // Send notifications to user
  try {
    await createNotification(input.customerId, {
      title: "💰 Payment Successful!",
      body: `Payment of Rs ${input.total} completed successfully.`,
      type: "order",
      orderId: ref.id,
    });
    await createNotification(input.customerId, {
      title: statusMessages.ORDERED.title,
      body: statusMessages.ORDERED.body,
      type: "order",
      orderId: ref.id,
    });
  } catch (error) {
    console.warn("Notification creation failed:", error);
  }

  return createdOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus, extra: Partial<Order> = {}) {
  if (!firestore) return;
  await updateDoc(doc(firestore, "orders", id), { status, ...extra, updatedAt: serverTimestamp() });

  // Send notification to customer for each status change
  try {
    const snap = await getDoc(doc(firestore, "orders", id));
    if (snap.exists()) {
      const order = snap.data() as Order;
      const msg = statusMessages[status];
      if (msg && order.customerId) {
        await createNotification(order.customerId, {
          title: msg.title,
          body: msg.body,
          type: "order",
          orderId: id,
        });
      }
    }
  } catch (error) {
    console.warn("Notification creation failed:", error);
  }
}

export async function verifyDeliveryOtp(orderId: string, otp: string) {
  if (!firestore) return otp.length === 4;
  const snap = await getDoc(doc(firestore, "orders", orderId));
  const order = snap.exists() ? (snap.data() as Order) : null;
  if (!order || order.otp !== otp) return false;
  await updateOrderStatus(orderId, "FINISHED");
  return true;
}
