import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/mock-data";
import { Search as SearchIcon, X, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({ component: Search });

const trending = ["Butter chicken", "Paneer tikka", "Biryani kit", "Dal makhani", "Saffron", "Chettinad"];
const aiSuggestions = [
  "Spicy curries under ₹300",
  "High-protein dinner for 1",
  "Quick veg meals in 20 min",
];

function Search() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = q ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.vendor.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <AppShell>
      <div className="safe-top px-4 pt-3 pb-3 sticky top-0 z-30 glass border-b border-border/50">
        <div className="flex items-center gap-2">
          <button onClick={() => router.history.back()} className="text-sm font-medium px-1">Cancel</button>
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-card rounded-2xl border border-border">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Try 'spicy paneer under 300'"
              className="flex-1 bg-transparent outline-none text-sm" />
            {q && <button onClick={() => setQ("")}><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
        </div>
      </div>

      <div className="p-5">
        {!q && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ai" /> AI suggestions
            </h3>
            <div className="mt-2 space-y-2">
              {aiSuggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border text-left">
                  <div className="w-8 h-8 rounded-lg bg-ai/10 grid place-items-center"><Sparkles className="w-4 h-4 text-ai" /></div>
                  <span className="text-sm flex-1">{s}</span>
                  <span className="text-muted-foreground">↗</span>
                </button>
              ))}
            </div>

            <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trending searches
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.map((t) => (
                <button key={t} onClick={() => setQ(t)} className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-medium">{t}</button>
              ))}
            </div>
          </>
        )}

        {q && (
          <>
            <p className="text-xs text-muted-foreground mb-3">{results.length} result{results.length !== 1 && "s"} for "{q}"</p>
            <div className="space-y-3">
              {results.map((p) => <ProductCard key={p.id} product={p} layout="row" />)}
              {results.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No matches. Try asking the AI assistant →
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
