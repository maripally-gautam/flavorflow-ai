import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { categories, offers } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { Bell, ChevronDown, MapPin, Search, ShoppingBag, Sparkles, Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useProducts } from "@/hooks/use-live-data";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { user, location, cart } = useApp();
  const [cat, setCat] = useState("all");
  const { products, loading } = useProducts();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const kitchens = Array.from(new Map(products.map((p) => [p.vendorId, { id: p.vendorId, name: p.vendor, rating: p.rating, image: p.image }])).values())
    .map((kitchen) => ({ ...kitchen, items: products.filter((p) => p.vendorId === kitchen.id).length }));

  const filtered = cat === "all" ? products : products.filter((p) =>
    cat === "veg" ? p.veg :
    cat === "spicy" ? p.spice === 3 :
    cat === "quick" ? parseInt(p.eta) <= 25 :
    cat === "protein" ? (p.protein ?? 0) >= 30 :
    p.category === cat
  );

  return (
    <AppShell>
      {/* Header */}
      <div className="safe-top px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Deliver to</p>
            <button className="flex items-center gap-1 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[180px]">{location}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative w-10 h-10 grid place-items-center rounded-xl bg-card border border-border">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ember" />
            </Link>
            <Link to="/cart" className="relative w-10 h-10 grid place-items-center rounded-xl bg-card border border-border">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 grid place-items-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full">{cartCount}</span>}
            </Link>
          </div>
        </div>
        <h1 className="font-display font-extrabold text-2xl mt-3">
          Hey {user?.name ?? "friend"}, <span className="text-gradient-warm">hungry?</span>
        </h1>
      </div>

      {/* Search */}
      <Link to="/search" className="mx-5 mt-3 flex items-center gap-3 px-4 py-3.5 bg-card rounded-2xl border border-border shadow-card">
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1">Search "Paneer", "Biryani"…</span>
        <Sparkles className="w-4 h-4 text-ai" />
      </Link>

      {/* AI Assistant CTA */}
      <Link to="/assistant" className="mx-5 mt-3 block">
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-ai text-white shadow-ai">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 grid place-items-center backdrop-blur">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Ask the CurryFlow AI</div>
              <div className="text-xs text-white/85">"Suggest a spicy dinner for 2 under ₹500"</div>
            </div>
          </div>
        </div>
      </Link>

      {/* Categories */}
      <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide px-5 pb-1">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${cat === c.id ? "bg-foreground text-background" : "bg-card border border-border text-foreground"}`}>
            <span>{c.icon}</span>{c.label}
          </button>
        ))}
      </div>

      {/* Offers carousel */}
      <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1">
        {offers.map((o) => (
          <div key={o.id} className={`${o.gradient} min-w-[78%] p-4 rounded-2xl text-white shadow-card relative overflow-hidden`}>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/15" />
            <div className="text-xs font-medium opacity-90">Limited time</div>
            <div className="font-display font-bold text-xl mt-1 leading-tight">{o.title}</div>
            <div className="text-xs opacity-90 mt-1">{o.subtitle}</div>
          </div>
        ))}
      </div>

      {/* AI Meal Kit */}
      <Link to="/meal-kit" className="mx-5 mt-5 block">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-warm grid place-items-center text-white">📦</div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-1.5">AI Meal Kit Generator <Sparkles className="w-3.5 h-3.5 text-ai" /></div>
            <div className="text-xs text-muted-foreground">Tell us your budget, get a kit in seconds</div>
          </div>
          <span className="text-primary font-bold">→</span>
        </div>
      </Link>

      {/* Trending */}
      <Section title="Trending now" subtitle="Picked by our AI from 12k+ orders this week">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2">
          {filtered.slice(0, 5).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="min-w-[62%]">
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Vendors */}
      <Section title="Popular kitchens" subtitle="AI-verified neighborhood chefs">
        <div className="px-5 space-y-3">
          {kitchens.map((v) => (
            <div key={v.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-card">
              <img src={v.image} alt={v.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{v.name}</span>
                  <BadgeCheck className="w-4 h-4 text-ai" />
                </div>
                <div className="text-xs text-muted-foreground">{v.items} items · 25-30 min</div>
              </div>
              <div className="flex items-center gap-1 text-mint text-sm font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />{v.rating}
              </div>
            </div>
          ))}
          {kitchens.length === 0 && <div className="text-sm text-muted-foreground">No admin food added yet.</div>}
        </div>
      </Section>

      {/* Recommended grid */}
      <Section title="Recommended for you" subtitle="Based on your spice profile 🌶️🌶️">
        <div className="px-5 grid grid-cols-2 gap-3">
          {loading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-card animate-pulse" />)}
          {!loading && filtered.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      <div className="h-4" />
    </AppShell>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="px-5 mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-display font-bold text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <button className="text-xs font-semibold text-primary">See all</button>
      </div>
      {children}
    </div>
  );
}
