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
  if (!firestore) {
    localProfiles[uid] = { ...(localProfiles[uid] ?? { uid, name: "", role: "customer" }), ...profile, uid } as UserProfile;
    return localProfiles[uid];
  }
  const ref = doc(firestore, "users", uid);
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    {
      ...profile,
      uid,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
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
    avatar: result.user.photoURL ?? undefined,
    role,
    ...profileData,
  });
}

export async function logout() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
