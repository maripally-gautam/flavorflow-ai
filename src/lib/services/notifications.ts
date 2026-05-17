import { getToken } from "firebase/messaging";
import { arrayUnion, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { firestore, getFirebaseMessaging } from "@/lib/firebase";
import { notifications as mockNotifications } from "@/lib/mock-data";
import type { AppNotification } from "@/lib/types";

export function listenNotifications(userId: string | undefined, cb: (notifications: AppNotification[]) => void) {
  if (!firestore || !userId) {
    cb(mockNotifications.map((n) => ({ ...n, userId: "demo" } as AppNotification)));
    return () => undefined;
  }
  return onSnapshot(
    query(collection(firestore, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc")),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppNotification)),
  );
}

export async function registerFcmToken(uid: string) {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!firestore || !vapidKey || typeof Notification === "undefined") return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;
  const token = await getToken(messaging, { vapidKey });
  if (token) {
    await updateDoc(doc(firestore, "users", uid), {
      fcmTokens: arrayUnion(token),
      updatedAt: serverTimestamp(),
    });
  }
  return token;
}

export async function markNotificationsRead(userId: string, items: AppNotification[]) {
  if (!firestore) return;
  await Promise.all(
    items
      .filter((item) => item.unread)
      .map((item) => updateDoc(doc(firestore!, "notifications", item.id), { unread: false, updatedAt: serverTimestamp() })),
  );
}
