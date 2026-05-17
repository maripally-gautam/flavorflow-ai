import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { LiveProduct } from "@/lib/types";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: LiveProduct }) {
  const addToCart = useApp((state) => state.addToCart);

  const add = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart(product);
    toast.success("Added to cart");
  };

  return (
    <Link to="/product/$id" params={{ id: product.id }} className="block overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <img src={product.image} alt={product.name} className="h-36 w-full object-cover" />
      <div className="p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{product.vendor}</p>
        <h3 className="mt-1 line-clamp-1 text-sm font-bold">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold">Rs {product.price}</span>
          <button onClick={add} className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
