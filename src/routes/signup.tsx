import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bike, CheckCircle2, ChevronLeft, FileCheck, Store, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { signUpWithGoogle } from "@/lib/services/auth";
import { useAuth } from "@/lib/AuthProvider";
import { verifyFssaiCertificate } from "@/lib/services/ai";
import type { SignupCategory, UserRole } from "@/lib/types";

export const Route = createFileRoute("/signup")({ component: Signup });

const roleOptions = [
  { id: "admin", label: "Admin", detail: "Post food, trip kits, gym kits, and more.", icon: Store },
  { id: "customer", label: "User", detail: "Order posted items and track delivery.", icon: User },
  { id: "delivery", label: "Delivery Person", detail: "Accept paid orders and update delivery.", icon: Bike },
] as const;

const categories: { id: SignupCategory; label: string }[] = [
  { id: "food", label: "Food" },
  { id: "trip-kit", label: "Trip kit" },
  { id: "gym-kit", label: "Gym kit" },
  { id: "other", label: "Other" },
];

function Signup() {
  const nav = useNavigate();
  const setUser = useApp((state) => state.setUser);
  const setLocation = useApp((state) => state.setLocation);
  const { profile, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocationValue] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<SignupCategory>("food");
  const [license, setLicense] = useState<File | null>(null);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAdminRole = role === "admin" || role === "vendor";
  const needsLicense = isAdminRole && category === "food";
  const detailsComplete = useMemo(() => {
    const base = name.trim() && phone.trim() && location.trim();
    if (isAdminRole) return Boolean(base && businessName.trim() && category);
    return Boolean(base);
  }, [businessName, category, isAdminRole, location, name, phone]);

  const routeForRole = (value?: UserRole | null) =>
    value === "vendor" || value === "admin" ? "/vendor" : value === "delivery" ? "/delivery" : "/home";

  useEffect(() => {
    if (authLoading || !profile) return;
    nav({ to: routeForRole(profile.role) });
  }, [authLoading, nav, profile]);

  const completeSignup = async () => {
    if (!role) return;
    if (!detailsComplete) {
      toast.error("Complete all required details");
      return;
    }
    if (needsLicense && !licenseVerified) {
      toast.error("Verify the FSSAI license first");
      return;
    }

    setBusy(true);
    try {
      const profile = await signUpWithGoogle(role, {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        businessName: businessName.trim() || undefined,
        category: isAdminRole ? category : undefined,
        fssaiVerified: needsLicense ? licenseVerified : undefined,
      });
      const resolvedRole = profile?.role ?? role;
      setUser({ name: profile?.name || name, role: resolvedRole, avatar: profile?.avatar });
      setLocation(profile?.location || location.trim());
      nav({ to: routeForRole(resolvedRole) });
    } catch (error) {
      toast.error("Google sign in failed", { description: error instanceof Error ? error.message : "Check Firebase auth setup." });
    } finally {
      setBusy(false);
    }
  };

  const verifyLicense = async () => {
    if (!license) {
      toast.error("Upload the FSSAI license first");
      return;
    }
    setBusy(true);
    try {
      const result = await verifyFssaiCertificate(license);
      if (result.status === "invalid" || Number(result.trustScore ?? 0) < 50) {
        toast.error("License could not be verified", { description: result.reason ?? "Upload a clear FSSAI-approved license." });
        return;
      }
      setLicenseVerified(true);
      toast.success("FSSAI license verified by AI");
    } catch (error) {
      toast.error("AI verification failed", { description: error instanceof Error ? error.message : "Try another file." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="safe-top mx-auto max-w-md px-5 pt-4">
        <button onClick={() => (role ? setRole(null) : nav({ to: "/welcome" }))} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <main className="mx-auto max-w-md px-6 pb-24 pt-8">
        {!role ? (
          <>
            <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Choose one role to continue.</p>
            <div className="mt-8 space-y-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button key={option.id} onClick={() => setRole(option.id)} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.detail}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-extrabold">
              {isAdminRole ? "Admin sign up" : role === "delivery" ? "Delivery sign up" : "User sign up"}
            </h1>
            <div className="mt-6 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" inputMode="tel" className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
              <input value={location} onChange={(e) => setLocationValue(e.target.value)} placeholder="Location" className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />

              {isAdminRole && (
                <>
                  <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
                  <select value={category} onChange={(e) => { setCategory(e.target.value as SignupCategory); setLicenseVerified(false); }} className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-primary">
                    {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </>
              )}
            </div>

            {needsLicense && (
              <section className="mt-5 rounded-2xl border border-dashed border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="font-bold">FSSAI-approved food license</h2>
                    <p className="text-xs text-muted-foreground">Food vendors must verify the license with AI.</p>
                  </div>
                </div>
                <input type="file" accept="image/*,application/pdf" onChange={(e) => { setLicense(e.target.files?.[0] ?? null); setLicenseVerified(false); }} className="mt-4 block w-full text-sm" />
                <button onClick={verifyLicense} disabled={busy || licenseVerified} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-semibold text-background disabled:opacity-60">
                  {licenseVerified && <CheckCircle2 className="h-4 w-4" />}
                  {licenseVerified ? "Verified" : busy ? "Verifying..." : "Verify with AI"}
                </button>
              </section>
            )}

            <button onClick={completeSignup} disabled={busy || !detailsComplete || (needsLicense && !licenseVerified)} className="mt-6 w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-50">
              {busy ? "Please wait..." : isAdminRole ? "Sign in admin with Google" : "Sign in with Google"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
