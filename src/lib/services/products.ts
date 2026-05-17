import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { LiveProduct, VendorProfile } from "@/lib/types";

export function listenProducts(cb: (products: LiveProduct[]) => void, vendorId?: string) {
  if (!firestore) {
    cb([]);
    return () => undefined;
  }
  const constraints = vendorId
    ? [where("vendorId", "==", vendorId)]
    : [];
  return onSnapshot(query(collection(firestore, "products"), ...constraints), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LiveProduct));
  });
}

export function listenVendors(cb: (vendors: VendorProfile[]) => void) {
  if (!firestore) {
    cb([]);
    return () => undefined;
  }
  return onSnapshot(collection(firestore, "vendors"), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as VendorProfile));
  });
}

export async function createProduct(product: Omit<LiveProduct, "id">) {
  if (!firestore) return `demo-${Date.now()}`;
  const ref = await addDoc(collection(firestore, "products"), {
    ...product,
    active: product.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, product: Partial<LiveProduct>) {
  if (!firestore) return;
  await updateDoc(doc(firestore, "products", id), { ...product, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  if (!firestore) return;
  await deleteDoc(doc(firestore, "products", id));
}
