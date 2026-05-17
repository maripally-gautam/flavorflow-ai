import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";
import { logout } from "@/lib/services/auth";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const user = useApp((state) => state.user);
  const setUser = useApp((state) => state.setUser);
  const nav = useNavigate();

  const signOut = async () => {
    await logout();
    setUser(null);
    nav({ to: "/" });
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Profile" />
      <main className="mx-auto max-w-md p-5">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h1 className="font-display text-2xl font-bold">{user?.name || "Profile"}</h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role || "guest"}</p>
        </section>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/home" className="rounded-2xl border border-border bg-card p-4 text-center font-bold">User page</Link>
          <Link to="/vendor" className="rounded-2xl border border-border bg-card p-4 text-center font-bold">Admin page</Link>
          <Link to="/delivery" className="rounded-2xl border border-border bg-card p-4 text-center font-bold">Delivery page</Link>
          <Link to="/orders" className="rounded-2xl border border-border bg-card p-4 text-center font-bold">Orders</Link>
        </div>
        <button onClick={signOut} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-4 font-bold text-destructive">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </main>
    </AppShell>
  );
}
