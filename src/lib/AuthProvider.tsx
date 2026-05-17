import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { onAuthChanged, getUserProfile } from "@/lib/services/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useApp } from "@/lib/store";
import type { UserProfile, UserRole } from "@/lib/types";

type AuthContextValue = {
  firebaseReady: boolean;
  loading: boolean;
  profile: UserProfile | null;
  role: UserRole | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const setUser = useApp((s) => s.setUser);

  const refreshProfile = async () => {
    const uid = profile?.uid;
    if (!uid) return;
    const fresh = await getUserProfile(uid);
    setProfile(fresh);
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    return onAuthChanged(async (user) => {
      if (!user) {
        setProfile(null);
        setUser(null);
        setLoading(false);
        return;
      }
      const next = await getUserProfile(user.uid);
      setProfile(next);
      setUser(next ? { name: next.name, role: next.role, avatar: next.avatar } : null);
      setLoading(false);
    });
  }, [setUser]);

  const value = useMemo(
    () => ({ firebaseReady: isFirebaseConfigured, loading, profile, role: profile?.role ?? null, refreshProfile }),
    [loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useRequireRole(roles?: UserRole[]) {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (auth.loading || !auth.firebaseReady) return;
    if (!auth.profile) nav({ to: "/login" });
    else if (roles?.length && !roles.includes(auth.profile.role)) nav({ to: "/home" });
  }, [auth.loading, auth.firebaseReady, auth.profile, nav, roles]);

  return auth;
}
