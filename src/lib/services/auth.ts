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

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

async function resolveGoogleUser() {
  const { auth } = requireFirebase();
  if (auth.currentUser) return auth.currentUser;
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithGoogle() {
  const user = await resolveGoogleUser();
  const existing = await getUserProfile(user.uid);

  return upsertUserProfile(user.uid, {
    email: user.email ?? existing?.email ?? "",
    name: existing?.name || user.displayName || "FlavorFlow user",
    ...(user.photoURL ? { avatar: user.photoURL } : {}),
    role: existing?.role ?? "customer",
  });
}

export async function signUpWithGoogle(role: UserRole, profileData: Partial<UserProfile> = {}) {
  const user = await resolveGoogleUser();
  const existing = await getUserProfile(user.uid);
  const typedName = profileData.name?.trim() ?? "";
  const googleEmail = user.email ?? "";

  if (!typedName) {
    throw new Error("Enter your name before continuing.");
  }

  if (existing) {
    const storedName = existing.name?.trim() ?? "";
    if (storedName && normalize(storedName) !== normalize(typedName)) {
      throw new Error("Name does not match this Google account.");
    }

    if (existing.email && googleEmail && normalize(existing.email) !== normalize(googleEmail)) {
      throw new Error("Google account email does not match the saved account.");
    }
  }

  return upsertUserProfile(user.uid, {
    email: googleEmail || existing?.email || "",
    name: existing?.name || typedName || user.displayName || "FlavorFlow user",
    ...(user.photoURL ? { avatar: user.photoURL } : {}),
    ...profileData,
    role: existing?.role ?? role,
  });
}

export async function logout() {
  if (firebaseAuth) await signOut(firebaseAuth);
}
