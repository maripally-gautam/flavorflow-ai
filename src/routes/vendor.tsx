import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { BadgeCheck, ChevronRight, FileCheck, IndianRupee, Package, Plus, Sparkles, TrendingUp } from "lucide-react";
import { products } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor")({ component: Vendor });

function Vendor() {
  const [showForm, setShowForm] = useState(false);
  return (
    <AppShell>
      <PageHeader title="Vendor Dashboard" subtitle="Spice Route Kitchen" />
      <div className="p-5 space-y-5">
        {/* Status */}
        <div className="p-4 rounded-2xl bg-gradient-ai text-white shadow-ai flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 grid place-items-center"><BadgeCheck className="w-5 h-5" /></div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-1.5">AI Verified Vendor <Sparkles className="w-3.5 h-3.5" /></div>
            <div className="text-xs opacity-90">FSSAI cert valid till Mar 2027 · Trust 98%</div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={IndianRupee} label="Today" value="₹12,480" delta="+18%" gradient="bg-gradient-warm" />
          <Stat icon={Package} label="Orders" value="47" delta="+6" />
          <Stat icon={TrendingUp} label="This week" value="₹86k" delta="+24%" />
          <Stat icon={FileCheck} label="Inventory" value="48 items" sub="3 low stock" />
        </div>

        {/* Active orders */}
        <Section title="Active orders" right={<span className="text-xs text-muted-foreground">3 new</span>}>
          {[1,2,3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold">#{84 + i}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">2× Butter Paneer · 1× Naan</div>
                <div className="text-xs text-muted-foreground">₹{349 + i*40} · Indiranagar</div>
              </div>
              <button className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg">Accept</button>
            </div>
          ))}
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
              <input placeholder="Product title" className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Price ₹" className="px-3 py-2.5 rounded-xl bg-background border border-border text-sm outline-none" />
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
              <button onClick={() => { setShowForm(false); toast.success("Product added"); }}
                className="w-full bg-gradient-warm text-white font-semibold py-3 rounded-xl">Publish</button>
            </div>
          )}
          {products.filter(p => p.vendorId === "v1").map((p) => (
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
