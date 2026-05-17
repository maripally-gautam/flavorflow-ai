import type { Product } from "./mock-data";

export type UserRole = "customer" | "vendor" | "admin" | "delivery";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  fcmTokens?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type LiveProduct = Product & {
  stock?: number;
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PICKED_UP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type PaymentMethod = "cod";
export type PaymentStatus = "cod";

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName?: string;
  vendorId: string;
  vendor: string;
  deliveryPartnerId?: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  address: string;
  otp: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  etaMinutes?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AppNotification = {
  id: string;
  userId: string;
  type: "order" | "ai" | "offer" | "system";
  title: string;
  body: string;
  unread: boolean;
  orderId?: string;
  createdAt?: unknown;
};

export type VendorProfile = {
  id: string;
  ownerId: string;
  name: string;
  verified?: boolean;
  fssaiNumber?: string;
  fssaiExpiry?: string;
  fssaiStatus?: "valid" | "invalid" | "needs_review";
  certificatePath?: string;
  trustScore?: number;
};

export type DeliveryPartnerProfile = {
  id: string;
  userId: string;
  name: string;
  online: boolean;
  activeOrderId?: string | null;
  rating?: number;
  vehicle?: string;
};

export type AiIntent =
  | { intent: "SEARCH_PRODUCTS"; query: string; filters?: { category?: Product["category"]; maxPrice?: number; veg?: boolean; spicy?: boolean } }
  | { intent: "RECOMMEND_PRODUCTS"; query: string; budget?: number }
  | { intent: "TRACK_ORDER"; orderId?: string }
  | { intent: "ADD_TO_CART"; productName: string }
  | { intent: "GENERATE_MEAL_KIT"; cuisine?: string; budget?: number; serves?: number; spice?: number }
  | { intent: "GENERAL_HELP"; message: string };
