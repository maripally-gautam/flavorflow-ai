import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Menu, Settings, ShoppingCart, User, X, Utensils, Mountain, Dumbbell, MoreHorizontal, LayoutGrid } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-live-data";
import { useRequireRole } from "@/lib/AuthProvider";
import { useApp } from "@/lib/store";
import { logout } from "@/lib/services/auth";
import type { SignupCategory } from "@/lib/types";

export const Route = createFileRoute("/home")({ component: Home });

type FilterCategory = "all" | SignupCategory;

const categoryFilters: { id: FilterCategory; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "food", label: "Food", icon: Utensils },
  { id: "trip-kit", label: "Trip Kit", icon: Mountain },
  { id: "gym-kit", label: "Gym Kit", icon: Dumbbell },
  { id: "other", label: "Others", icon: MoreHorizontal },
];

function Home() {
  useRequireRole(["customer"]);
  const { products, loading } = useProducts();
  const cart = useApp((state) => state.cart);
  const user = useApp((state) => state.user);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const selectCategory = (cat: FilterCategory) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
  };

  return (
    <AppShell hideNav>
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background border-r border-border shadow-2xl"
            >
              <div className="safe-top flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
                <h2 className="font-display text-lg font-bold">Categories</h2>
                <button onClick={() => setSidebarOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {categoryFilters.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-glow" : "hover:bg-accent"}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{cat.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="catdot"
                          className="ml-auto h-2 w-2 rounded-full bg-primary-foreground"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  FlavorFlow &middot; Browse by category
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card active:scale-95 transition"
              id="menu-hamburger"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Welcome</p>
              <h1 className="truncate font-display text-xl font-extrabold">{user?.name || "User"}</h1>
            </div>
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
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="sticky top-[73px] z-20 bg-background/90 backdrop-blur px-5 py-2 border-b border-border/50">
        <div className="mx-auto max-w-md flex gap-2 overflow-x-auto scrollbar-hide">
          {categoryFilters.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border hover:border-primary/40"}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-md p-5">
        <h2 className="font-display text-lg font-bold">
          {activeCategory === "all" ? "All posts" : categoryFilters.find((c) => c.id === activeCategory)?.label || "Posts"}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {loading && Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-56 rounded-2xl bg-card animate-pulse" />)}
          {!loading && filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {!loading && filtered.length === 0 && (
          <p className="mt-4 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            {activeCategory === "all" ? "No posts available yet." : `No ${categoryFilters.find((c) => c.id === activeCategory)?.label?.toLowerCase()} posts available.`}
          </p>
        )}
      </main>
    </AppShell>
  );
}
