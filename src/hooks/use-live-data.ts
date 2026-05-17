import { useEffect, useState } from "react";
import { listenProducts, listenVendors } from "@/lib/services/products";
import { listenCustomerOrders, listenOrder, listenVendorOrders, listenAvailableDeliveryOrders } from "@/lib/services/orders";
import { listenNotifications } from "@/lib/services/notifications";
import type { AppNotification, LiveProduct, Order, VendorProfile } from "@/lib/types";

export function useProducts(vendorId?: string) {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => listenProducts((items) => { setProducts(items); setLoading(false); }, vendorId), [vendorId]);
  return { products, loading };
}

export function useVendors() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  useEffect(() => listenVendors(setVendors), []);
  return vendors;
}

export function useCustomerOrders(customerId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => listenCustomerOrders(customerId, setOrders), [customerId]);
  return orders;
}

export function useVendorOrders(vendorId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => listenVendorOrders(vendorId, setOrders), [vendorId]);
  return orders;
}

export function useAvailableDeliveryOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => listenAvailableDeliveryOrders(setOrders), []);
  return orders;
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => listenOrder(id, setOrder), [id]);
  return order;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  useEffect(() => listenNotifications(userId, setNotifications), [userId]);
  return notifications;
}
