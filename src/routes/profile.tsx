import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, Package, MapPin, Phone, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";
import { useAuth } from "@/lib/AuthProvider";
import { logout } from "@/lib/services/auth";

export const Route = createFileRoute("/profile")({ component: Profile });

const categoryLabels: Record<string, string> = {
  food: "🍽️ Food",
  "trip-kit": "🏕️ Trip Kit",
  "gym-kit": "💪 Gym Kit",
  other: "📦 Other",
};

const sampleAvatarUrl = "/sample-boy.svg";

function Profile() {
  const user = useApp((state) => state.user);
  const setUser = useApp((state) => state.setUser);
  const { profile } = useAuth();
  const nav = useNavigate();

  const signOut = async () => {
    await logout();
    setUser(null);
    nav({ to: "/" });
  };

  const isVendor = user?.role === "vendor" || user?.role === "admin";

  const categoryDisplay = profile?.category === "other" && profile?.customCategory
    ? `📦 ${profile.customCategory}`
    : categoryLabels[profile?.category ?? "other"] ?? "📦 Other";

  const roleLinks =
    isVendor
      ? [{ to: "/vendor" as const, label: "Admin posts" }]
      : user?.role === "delivery"
        ? [{ to: "/delivery" as const, label: "Delivery orders" }]
        : [
          { to: "/home" as const, label: "Order items" },
          { to: "/orders" as const, label: "My orders" },
        ];

  return (
    <AppShell hideNav>
      <PageHeader title="Profile" />
      <main className="mx-auto max-w-md p-5">
        {/* Profile Card */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-primary" />
            ) : (
              <img
                src={sampleAvatarUrl}
                alt="Sample profile avatar"
                className="h-16 w-16 rounded-2xl object-cover border-2 border-primary"
              />
            )}
            <div>
              <h1 className="font-display text-2xl font-bold">{user?.name || "Profile"}</h1>
              <p className="mt-0.5 text-sm capitalize text-muted-foreground">{user?.role || "guest"}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            {profile?.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {profile.email}
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> {profile.phone}
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {profile.location}
              </div>
            )}
          </div>

          {/* Vendor Category Badge */}
          {isVendor && profile?.category && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-4 py-3">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Category</p>
                <p className="font-bold">{categoryDisplay}</p>
              </div>
              {profile?.businessName && (
                <span className="ml-auto text-xs text-muted-foreground">{profile.businessName}</span>
              )}
            </div>
          )}
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {roleLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-2xl border border-border bg-card p-4 text-center font-bold transition-all hover:border-primary/40 hover:shadow-glow/20 active:scale-[0.98]">{item.label}</Link>
          ))}
          <Link to="/settings" className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center font-bold transition-all hover:border-primary/40 active:scale-[0.98]">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
        <button onClick={signOut} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-4 font-bold text-destructive transition-all hover:bg-destructive/10 active:scale-[0.98]">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </main>
    </AppShell>
  );
}
