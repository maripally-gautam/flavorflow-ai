import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { signInWithGoogle } from "@/lib/services/auth";
import { useAuth } from "@/lib/AuthProvider";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const setUser = useApp((s) => s.setUser);
  const { profile, loading: authLoading, refreshProfile } = useAuth();

  const routeForRole = (role?: string) => role === "vendor" || role === "admin" ? "/vendor" : role === "delivery" ? "/delivery" : "/home";

  useEffect(() => {
    if (authLoading || !profile) return;
    nav({ to: routeForRole(profile.role) });
  }, [authLoading, nav, profile]);

  const google = async () => {
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        setUser({ name: profile.name, role: profile.role, avatar: profile.avatar });
        await refreshProfile(profile.uid);
      }
      nav({ to: routeForRole(profile?.role) });
    } catch (error) {
      toast.error("Google sign-in failed", { description: error instanceof Error ? error.message : "Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <PageHeader title="Welcome back" sticky={false} />
      <div className="px-6 pt-4">
        <h2 className="font-display font-extrabold text-3xl">Sign in to <span className="text-gradient-warm">FlavorFlow</span></h2>
        <p className="text-muted-foreground text-sm mt-1">Continue with Google to open your role-based dashboard.</p>

        <button onClick={google} disabled={loading} className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-card border border-border rounded-2xl font-medium text-sm active:scale-[0.98] transition disabled:opacity-60">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" /><path fill="#fbbc04" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" /><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
          {loading ? "Opening Google..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New here? <Link to="/signup" className="text-primary font-semibold">Choose your role</Link>
        </p>
      </div>
    </div>
  );
}
