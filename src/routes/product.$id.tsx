import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { products as fallbackProducts } from "@/lib/mock-data";
import { Heart, Share2, Star, Clock, Flame, Minus, Plus, Sparkles, ChevronLeft, BadgeCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useProducts } from "@/hooks/use-live-data";

export const Route = createFileRoute("/product/$id")({ component: ProductDetail });

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const { products } = useProducts();
  const product = (products.length ? products : fallbackProducts).find((p) => p.id === id);
  const { addToCart, cart, setQty } = useApp();
  const router = useRouter();
  const [fav, setFav] = useState(false);
  const inCart = cart.find((c) => c.product.id === id);

  if (!product) return <div className="p-10 text-center">Not found</div>;

  const handleAdd = () => {
    const r = addToCart(product);
    if (!r.ok) toast.error(`Cart has items from ${r.conflictVendor}`, {
      action: { label: "Replace", onClick: () => useApp.getState().forceAddToCart(product) },
    });
    else toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md relative">
        <div className="relative h-[55vh]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
          <div className="safe-top absolute top-0 left-0 right-0 px-4 pt-3 flex items-center justify-between">
            <button onClick={() => router.history.back()} className="w-10 h-10 grid place-items-center rounded-full bg-background/90 backdrop-blur">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 grid place-items-center rounded-full bg-background/90 backdrop-blur">
                <Share2 className="w-4 h-4" />
              </button>
              <button onClick={() => setFav(!fav)} className="w-10 h-10 grid place-items-center rounded-full bg-background/90 backdrop-blur">
                <Heart className={`w-4 h-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="-mt-8 relative rounded-t-[2rem] bg-background px-5 pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            {product.tags.map((t) => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t}</span>
            ))}
            <span className={`w-4 h-4 grid place-items-center border-2 ${product.veg ? "border-mint" : "border-ember"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.veg ? "bg-mint" : "bg-ember"}`} />
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl mt-2">{product.name}</h1>
          <Link to="/home" className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            by <span className="font-semibold text-foreground">{product.vendor}</span> <BadgeCheck className="w-4 h-4 text-ai" />
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star className="w-4 h-4 fill-turmeric text-turmeric" />{product.rating}
              <span className="text-muted-foreground text-xs ml-1">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4 text-muted-foreground" />{product.eta}</div>
            <div className="flex items-center gap-0.5">
              {[1,2,3].map(i => (
                <Flame key={i} className={`w-4 h-4 ${i <= product.spice ? "text-ember fill-ember" : "text-border"}`} />
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {product.ingredients && (
            <Section title={product.category === "kit" ? "Ingredient checklist" : "Ingredients"}>
              <ul className="space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary" /> {ing}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {(product.calories || product.protein) && (
            <Section title="Nutrition">
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Calories" value={`${product.calories ?? "—"}`} unit="kcal" />
                <Stat label="Protein" value={`${product.protein ?? "—"}`} unit="g" />
                <Stat label="Cook" value={product.cookTime ?? "—"} unit="" />
              </div>
            </Section>
          )}

          {product.category === "kit" && (
            <Section title="Cooking steps">
              <ol className="space-y-2 text-sm">
                {["Heat oil and toast spices for 30 sec", "Sear marinated protein on high flame", "Add gravy mix and simmer 8 min", "Finish with cream and fresh herbs"].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <div className="mt-6 p-4 rounded-2xl bg-gradient-ai text-white shadow-ai">
            <div className="flex items-center gap-2 font-semibold text-sm"><Sparkles className="w-4 h-4" /> AI Cooking Tip</div>
            <p className="text-xs mt-1.5 text-white/90 leading-relaxed">
              Add a teaspoon of kasuri methi at the end and rest covered for 3 min — it amplifies the aroma 40% per our flavor model.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom px-4 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-md flex items-center gap-3">
          {inCart ? (
            <div className="flex-1 flex items-center justify-between p-2 rounded-2xl bg-card border border-border">
              <button onClick={() => setQty(product.id, inCart.qty - 1)} className="w-10 h-10 grid place-items-center rounded-xl bg-accent"><Minus className="w-4 h-4" /></button>
              <span className="font-bold">{inCart.qty}</span>
              <button onClick={() => setQty(product.id, inCart.qty + 1)} className="w-10 h-10 grid place-items-center rounded-xl bg-accent"><Plus className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="font-display font-bold text-xl">₹{product.price}</div>
            </div>
          )}
          {inCart ? (
            <Link to="/cart" className="flex-1 grid place-items-center bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow">
              Go to cart
            </Link>
          ) : (
            <button onClick={handleAdd} className="flex-1 bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition">
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-display font-bold text-base mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="p-3 rounded-xl bg-card border border-border text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-bold text-base mt-0.5">{value}<span className="text-xs font-medium text-muted-foreground ml-0.5">{unit}</span></div>
    </div>
  );
}
