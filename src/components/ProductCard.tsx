import { Link } from "@tanstack/react-router";
import { Star, Plus, Flame, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "row" }) {
  const addToCart = useApp((s) => s.addToCart);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const r = addToCart(product);
    if (!r.ok) {
      toast.error(`Cart has items from ${r.conflictVendor}`, {
        description: "Clear cart to add from a different vendor.",
        action: { label: "Replace", onClick: () => useApp.getState().forceAddToCart(product) },
      });
    } else toast.success(`${product.name} added`);
  };

  if (layout === "row") {
    return (
      <Link to="/product/$id" params={{ id: product.id }} className="flex gap-3 p-3 bg-card rounded-2xl shadow-card border border-border/50">
        <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 grid place-items-center border ${product.veg ? "border-mint" : "border-ember"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.veg ? "bg-mint" : "bg-ember"}`} />
            </span>
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground truncate">{product.vendor}</p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="flex items-center gap-0.5 text-mint font-medium"><Star className="w-3 h-3 fill-current" />{product.rating}</span>
            <span className="text-muted-foreground">· {product.eta}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold">₹{product.price}</span>
            <button onClick={handleAdd} className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-lg active:scale-95 transition">
              ADD
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="relative">
      <Link to="/product/$id" params={{ id: product.id }} className="block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-background/90 backdrop-blur rounded-full">{t}</span>
            ))}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {product.veg ? (
              <span className="w-5 h-5 grid place-items-center bg-background rounded-md"><Leaf className="w-3 h-3 text-mint" /></span>
            ) : null}
            {product.spice === 3 && <span className="w-5 h-5 grid place-items-center bg-background rounded-md"><Flame className="w-3 h-3 text-ember" /></span>}
          </div>
          <button onClick={handleAdd}
            className="absolute -bottom-3 right-3 w-9 h-9 grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow active:scale-90 transition">
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
        <div className="p-3 pt-4">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{product.vendor}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-sm">₹{product.price}</span>
            <span className="flex items-center gap-0.5 text-xs text-mint font-medium">
              <Star className="w-3 h-3 fill-current" />{product.rating}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
