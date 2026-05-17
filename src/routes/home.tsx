import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Settings, ShoppingCart, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-live-data";
import { useRequireRole } from "@/lib/AuthProvider";
import { useApp } from "@/lib/store";
import { logout } from "@/lib/services/auth";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  useRequireRole(["customer"]);
  const { products, loading } = useProducts();
  const cart = useApp((state) => state.cart);
  const user = useApp((state) => state.user);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppShell hideNav>
      <div className="safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Welcome</p>
            <h1 className="truncate font-display text-xl font-extrabold">{user?.name || "User"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <Settings className="h-5 w-5" />
            </Link>
            <button onClick={logout} className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md p-5">
        <h2 className="font-display text-lg font-bold">Available posts</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {loading && Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-56 rounded-2xl bg-card animate-pulse" />)}
          {!loading && products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {!loading && products.length === 0 && (
          <p className="mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No admin posts are available yet.
          </p>
        )}
      </main>
    </AppShell>
  );
}
