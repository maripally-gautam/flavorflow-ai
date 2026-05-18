export type UserRole = "customer" | "vendor" | "admin" | "delivery";

export type SignupCategory = "food" | "trip-kit" | "gym-kit" | "other";

export type UserProfile = {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  category?: SignupCategory;
  customCategory?: string;
  fssaiVerified?: boolean;
  fcmTokens?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProductSubItem = {
  name: string;
  quantity: string;
};

export type LiveProduct = {
  id: string;
  name: string;
  vendor: string;
  vendorId: string;
  image: string;
  category: SignupCategory;
  price: number;
  description?: string;
  subItems: ProductSubItem[];
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type OrderStatus =
  | "ORDERED"
  | "ACCEPTED"
  | "TAKEN"
  | "ON_THE_WAY"
  | "REACHED"
  | "FINISHED";

export type PaymentStatus = "completed";

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
  total: number;
  address: string;
  timeSlot: string;
  otp: string;
  paymentStatus: PaymentStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type AppNotification = {
  id: string;
  userId: string;
  type: "order" | "system";
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
  category: SignupCategory;
  customCategory?: string;
  verified?: boolean;
  fssaiVerified?: boolean;
};

export type DeliveryPartnerProfile = {
  id: string;
  userId: string;
  name: string;
  online: boolean;
  activeOrderId?: string | null;
};
