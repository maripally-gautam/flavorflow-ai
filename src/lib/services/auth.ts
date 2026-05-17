import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firebaseAuth, firestore, googleProvider, isFirebaseConfigured, requireFirebase } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/lib/types";

const demoProfiles: Record<string, UserProfile> = {};

export function onAuthChanged(cb: (user: User | null) => void) {
  if (!firebaseAuth) {
    cb(null);
    return () => undefined;
  }
  setPersistence(firebaseAuth, browserLocalPersistence).catch(console.warn);
  return onAuthStateChanged(firebaseAuth, cb);
}

export async function getUserProfile(uid: string) {
  if (!firestore) return demoProfiles[uid] ?? null;
  const snap = await getDoc(doc(firestore, "users", uid));
  return snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null;
}

export async function upsertUserProfile(uid: string, profile: Partial<UserProfile>) {
  if (!firestore) {
    demoProfiles[uid] = { ...(demoProfiles[uid] ?? {}), uid, ...(profile as UserProfile) };
    return demoProfiles[uid];
  }
  const ref = doc(firestore, "users", uid);
  const existing = await getDoc(ref);
  const data = {
    ...profile,
    uid,
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
  };
  await setDoc(ref, data, { merge: true });
  return getUserProfile(uid);
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  city?: string;
  businessName?: string;
}) {
  if (!isFirebaseConfigured) {
    const uid = `demo-${Date.now()}`;
    return upsertUserProfile(uid, { uid, email: input.email, name: input.name, role: input.role });
  }
  const { auth } = requireFirebase();
  const result = await createUserWithEmailAndPassword(auth, input.email, input.password);
  return upsertUserProfile(result.user.uid, {
    email: input.email,
    name: input.name,
    role: input.role,
    phone: input.phone,
    city: input.city,
    businessName: input.businessName,
    avatar: result.user.photoURL ?? undefined,
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { auth } = requireFirebase();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(result.user.uid);
}

export async function signInWithGoogle(role: UserRole = "customer") {
  const { auth } = requireFirebase();
  const result = await signInWithPopup(auth, googleProvider);
  const profile = await getUserProfile(result.user.uid);
  if (profile) return profile;
  return upsertUserProfile(result.user.uid, {
    email: result.user.email ?? "",
    name: result.user.displayName ?? "CurryFlow User",
    role,
    avatar: result.user.photoURL ?? undefined,
  });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  if (!firestore) return upsertUserProfile(uid, data);
  await updateDoc(doc(firestore, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

export async function logout() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
