import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore, googleProvider, requireFirebase } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/lib/types";

const localProfiles: Record<string, UserProfile> = {};

function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(removeUndefined) as T;
  }
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, removeUndefined(entry)]),
    ) as T;
  }
  return value;
}

export function onAuthChanged(cb: (user: User | null) => void) {
  if (!firebaseAuth) {
    cb(null);
    return () => undefined;
  }
  setPersistence(firebaseAuth, browserLocalPersistence).catch(console.warn);
  return onAuthStateChanged(firebaseAuth, cb);
}

export async function getUserProfile(uid: string) {
  if (!firestore) return localProfiles[uid] ?? null;
  const snap = await getDoc(doc(firestore, "users", uid));
  return snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null;
}

export async function upsertUserProfile(uid: string, profile: Partial<UserProfile>) {
  const cleanProfile = removeUndefined(profile);
  if (!firestore) {
    localProfiles[uid] = { ...(localProfiles[uid] ?? { uid, name: "", role: "customer" }), ...cleanProfile, uid } as UserProfile;
    return localProfiles[uid];
  }
  const ref = doc(firestore, "users", uid);
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    removeUndefined({
      ...cleanProfile,
      uid,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    }),
    { merge: true },
  );
  return getUserProfile(uid);
}

export async function signInWithGoogle(role: UserRole = "customer", profileData: Partial<UserProfile> = {}) {
  const { auth } = requireFirebase();
  const result = await signInWithPopup(auth, googleProvider);
  return upsertUserProfile(result.user.uid, {
    email: result.user.email ?? "",
    name: profileData.name || result.user.displayName || "FlavorFlow user",
    ...(result.user.photoURL ? { avatar: result.user.photoURL } : {}),
    role,
    ...profileData,
  });
}

export async function logout() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
