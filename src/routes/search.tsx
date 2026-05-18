import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-live-data";
import { useRequireRole } from "@/lib/AuthProvider";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  useRequireRole(["customer"]);
  const { products, loading } = useProducts();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => 
      p.name.toLowerCase().includes(q) || 
      p.vendor.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <AppShell>
      <div className="safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Link to="/home" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input 
              autoFocus
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search food, gyms, kits..." 
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md p-5 pb-32">
        {query.trim() === "" ? (
          <div className="py-20 text-center text-muted-foreground">
            <SearchIcon className="mx-auto mb-4 h-10 w-10 opacity-20" />
            <p>Type above to start searching</p>
          </div>
        ) : loading ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 rounded-2xl bg-card animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p>No results found for "{query}"</p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
