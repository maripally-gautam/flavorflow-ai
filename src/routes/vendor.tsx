import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { BadgeCheck, ChevronRight, FileCheck, IndianRupee, Package, Plus, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useProducts, useVendorOrders } from "@/hooks/use-live-data";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { createProduct } from "@/lib/services/products";

export const Route = createFileRoute("/vendor")({ component: Vendor });

function Vendor() {
  useRequireRole(["vendor", "admin"]);
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const vendorId = profile?.uid ?? "v1";
  const { products } = useProducts(vendorId);
  const liveOrders = useVendorOrders(vendorId);
  const publish = async () => {
    await createProduct({
      name: title || "New curry",
      vendor: profile?.businessName ?? profile?.name ?? "Spice Route Kitchen",
      vendorId,
      price: Number(price || 199),
      rating: 4.7,
      reviews: 0,
      eta: "25-30 min",
      veg: true,
      spice: 2,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
      category: "curry",
      tags: ["New"],
      description: "Freshly added by the vendor.",
      active: true,
      stock: 10,
    });
    setShowForm(false);
    setTitle("");
    setPrice("");
    toast.success("Product added");
  };
  return (
    <AppShell>
      <PageHeader title="Admin Dashboard" subtitle={profile?.businessName ?? profile?.name ?? "Food manager"} />
      <div className="p-5 space-y-5">
        {/* Status */}
        <div className="p-4 rounded-2xl bg-gradient-ai text-white shadow-ai flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 grid place-items-center"><BadgeCheck className="w-5 h-5" /></div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-1.5">Food Admin <Sparkles className="w-3.5 h-3.5" /></div>
            <div className="text-xs opacity-90">FSSAI cert valid till Mar 2027 · Trust 98%</div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={IndianRupee} label="Today" value={`₹${liveOrders.reduce((sum, order) => sum + order.total, 0)}`} gradient="bg-gradient-warm" />
          <Stat icon={Package} label="Orders" value={String(liveOrders.length)} />
          <Stat icon={TrendingUp} label="Live" value={String(liveOrders.filter((o) => o.status !== "DELIVERED").length)} />
          <Stat icon={FileCheck} label="Inventory" value={`${products.length} items`} />
        </div>

        {/* Active orders */}
        <Section title="Active orders" right={<span className="text-xs text-muted-foreground">{liveOrders.filter((o) => o.status !== "DELIVERED").length} live</span>}>
          {liveOrders.filter((o) => o.status !== "DELIVERED").map((order) => (
            <div key={order.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold">#{order.id.slice(-2)}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{order.items.map((item) => `${item.qty}x ${item.name}`).join(" · ")}</div>
                <div className="text-xs text-muted-foreground">₹{order.total} · {order.status}</div>
              </div>
              <span className="px-3 py-1.5 text-xs font-bold bg-accent rounded-lg">{order.status}</span>
            </div>
          ))}
          {liveOrders.filter((o) => o.status !== "DELIVERED").length === 0 && (
            <div className="p-3 bg-card border border-border rounded-2xl text-sm text-muted-foreground">No active orders yet.</div>
          )}
        </Section>

        {/* Products */}
        <Section title="Your menu" right={
          <button onClick={() => setShowForm(!showForm)} className="text-xs font-semibold text-primary flex items-center gap-1">
            <Plus className="w-3 h-3" />Add
          </button>
        }>
          {showForm && (
            <div className="p-4 rounded-2xl bg-card border-2 border-primary mb-2 space-y-2">
              <div className="font-display font-bold">Add new product</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price ₹" className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none" />
                <input placeholder="Stock" className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none">
                  <option>Curry</option><option>Meal Kit</option><option>Ingredient</option>
                </select>
                <select className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none">
                  <option>Veg</option><option>Non-veg</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-4 grid place-items-center text-xs text-muted-foreground">
                Tap to upload images
              </div>
              <button onClick={publish}
                className="w-full bg-gradient-warm text-white font-semibold py-3 rounded-xl">Publish</button>
            </div>
          )}
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl">
              <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">₹{p.price} · In stock</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </Section>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, delta, sub, gradient }: any) {
  return (
    <div className={`p-3.5 rounded-2xl ${gradient ?? "bg-card border border-border"} ${gradient ? "text-white shadow-glow" : ""}`}>
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 opacity-80" />
        {delta && <span className={`text-[10px] font-bold ${gradient ? "bg-white/20" : "bg-mint/15 text-mint"} px-1.5 py-0.5 rounded-full`}>{delta}</span>}
      </div>
      <div className="font-display font-bold text-xl mt-2">{value}</div>
      <div className={`text-xs ${gradient ? "opacity-90" : "text-muted-foreground"}`}>{sub ?? label}</div>
    </div>
  );
}
function Section({ title, right, children }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold">{title}</h3>
        {right}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
