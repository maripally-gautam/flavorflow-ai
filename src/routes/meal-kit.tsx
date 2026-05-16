import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Sparkles, Wand2, ChefHat, ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { products } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/meal-kit")({ component: MealKit });

const cuisines = ["North Indian", "South Indian", "Bengali", "Chinese", "Continental"];

function MealKit() {
  const [budget, setBudget] = useState(350);
  const [spice, setSpice] = useState(2);
  const [serves, setServes] = useState(2);
  const [cuisine, setCuisine] = useState("North Indian");
  const [generated, setGenerated] = useState<null | typeof products[number]>(null);
  const [loading, setLoading] = useState(false);
  const forceAdd = useApp((s) => s.forceAddToCart);

  const generate = () => {
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerated(products.find((p) => p.category === "kit") ?? products[2]);
      setLoading(false);
    }, 1800);
  };

  return (
    <AppShell hideNav>
      <PageHeader title="AI Meal Kit Generator" subtitle="Built with our flavor model" />
      <div className="p-5 space-y-5">
        <div className="p-4 rounded-2xl bg-gradient-ai text-white shadow-ai relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <Wand2 className="w-6 h-6" />
            <div>
              <div className="font-semibold">Tell us your vibe</div>
              <div className="text-xs opacity-90">AI builds a complete kit in seconds</div>
            </div>
          </div>
        </div>

        <Field label={`Budget · ₹${budget}`}>
          <input type="range" min="150" max="800" step="50" value={budget} onChange={(e) => setBudget(+e.target.value)}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹150</span><span>₹800</span>
          </div>
        </Field>

        <Field label="Spice level">
          <div className="grid grid-cols-3 gap-2">
            {["Mild 🌶️","Medium 🌶️🌶️","Fiery 🌶️🌶️🌶️"].map((s, i) => (
              <button key={s} onClick={() => setSpice(i+1)}
                className={`py-2.5 rounded-xl text-xs font-semibold border-2 ${spice === i+1 ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Serves">
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((n) => (
              <button key={n} onClick={() => setServes(n)}
                className={`py-2.5 rounded-xl text-sm font-bold border-2 ${serves === n ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                {n}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Cuisine">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {cuisines.map((c) => (
              <button key={c} onClick={() => setCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${cuisine === c ? "bg-foreground text-background border-foreground" : "bg-card border-border"}`}>
                {c}
              </button>
            ))}
          </div>
        </Field>

        <button onClick={generate} disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-ai text-white font-semibold py-4 rounded-2xl shadow-ai active:scale-[0.98] transition disabled:opacity-70">
          {loading ? <><Sparkles className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate my kit</>}
        </button>

        <AnimatePresence>
          {generated && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card border-2 border-primary shadow-glow">
              <div className="flex items-center gap-2 text-xs font-bold text-ai uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Generated · {cuisine}
              </div>
              <h3 className="font-display font-extrabold text-xl mt-1">{generated.name}</h3>
              <img src={generated.image} className="w-full h-44 object-cover rounded-2xl mt-3" alt="" />

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-accent">
                  <div className="text-[10px] text-muted-foreground uppercase">Cost</div>
                  <div className="font-bold text-sm">₹{Math.min(generated.price, budget)}</div>
                </div>
                <div className="p-2 rounded-xl bg-accent">
                  <div className="text-[10px] text-muted-foreground uppercase">Cook</div>
                  <div className="font-bold text-sm flex items-center justify-center gap-1"><ChefHat className="w-3 h-3" />{generated.cookTime ?? "25 min"}</div>
                </div>
                <div className="p-2 rounded-xl bg-accent">
                  <div className="text-[10px] text-muted-foreground uppercase">Serves</div>
                  <div className="font-bold text-sm">{serves}</div>
                </div>
              </div>

              <h4 className="font-semibold mt-4 mb-2 text-sm">Ingredients you'll get</h4>
              <div className="space-y-1.5">
                {(generated.ingredients ?? ["Marinated protein", "Spice mix", "Fresh herbs", "Cooking aids"]).map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />{i}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-1.5 flex-wrap">
                <Badge>High-protein</Badge><Badge>Beginner</Badge><Badge>Gluten-free</Badge>
              </div>

              <button onClick={() => { forceAdd(generated); toast.success("Kit added to cart"); }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-warm text-white font-semibold py-3.5 rounded-2xl shadow-glow">
                <Plus className="w-4 h-4" /> Add all to cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{label}</label>
      {children}
    </div>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2.5 py-1 rounded-full bg-mint/15 text-mint text-[11px] font-semibold">{children}</span>;
}
