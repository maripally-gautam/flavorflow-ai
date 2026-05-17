import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useProducts } from "@/hooks/use-live-data";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { createProduct } from "@/lib/services/products";
import type { ProductSubItem } from "@/lib/types";

export const Route = createFileRoute("/vendor")({ component: Vendor });

function Vendor() {
  useRequireRole(["vendor", "admin"]);
  const { profile } = useAuth();
  const vendorId = profile?.uid ?? "local-admin";
  const { products } = useProducts(vendorId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [subItems, setSubItems] = useState<ProductSubItem[]>([{ name: "", quantity: "" }]);
  const [posting, setPosting] = useState(false);

  const publish = async () => {
    const cleanItems = subItems.filter((item) => item.name.trim() && item.quantity.trim());
    if (!name.trim() || !image.trim() || !price.trim() || cleanItems.length === 0) {
      toast.error("Add name, image link, sub items, and amount");
      return;
    }
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setPosting(true);
    try {
      await createProduct({
        name: name.trim(),
        vendor: profile?.businessName || profile?.name || "Admin",
        vendorId,
        image: image.trim(),
        category: profile?.category ?? "other",
        price: amount,
        subItems: cleanItems,
        active: true,
      });
      setName("");
      setImage("");
      setPrice("");
      setSubItems([{ name: "", quantity: "" }]);
      setOpen(false);
      toast.success("Posted successfully");
    } catch (error) {
      toast.error("Post failed", { description: error instanceof Error ? error.message : "Check Firebase setup." });
    } finally {
      setPosting(false);
    }
  };

  return (
    <AppShell hideNav>
      <div className="safe-top sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold">Admin</h1>
            <p className="text-xs text-muted-foreground">{profile?.businessName || profile?.name || "Your posts"}</p>
          </div>
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-md space-y-3 p-5">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold">{product.name}</h2>
                <span className="font-display font-bold">Rs {product.price}</span>
              </div>
              <div className="mt-3 space-y-1">
                {product.subItems.map((item, index) => (
                  <p key={`${item.name}-${index}`} className="text-sm text-muted-foreground">{item.name}: {item.quantity}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
        {products.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No posts yet. Use add to publish your first item.</p>}
      </main>

      <Link to="/profile" className="fixed bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-card">
        <User className="h-5 w-5" />
      </Link>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-8">
          <div className="mx-auto max-h-full max-w-md overflow-auto rounded-2xl bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Add post</h2>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of curry, exercise kit, etc." className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
              <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image link" className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
              <div className="space-y-2">
                {subItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_110px_36px] gap-2">
                    <input value={item.name} onChange={(e) => setSubItems((items) => items.map((entry, i) => i === index ? { ...entry, name: e.target.value } : entry))} placeholder="Ingredient / dumbbell" className="rounded-xl border border-border bg-card px-3 py-3 outline-none focus:border-primary" />
                    <input value={item.quantity} onChange={(e) => setSubItems((items) => items.map((entry, i) => i === index ? { ...entry, quantity: e.target.value } : entry))} placeholder="Qty" className="rounded-xl border border-border bg-card px-3 py-3 outline-none focus:border-primary" />
                    <button onClick={() => setSubItems((items) => items.length === 1 ? items : items.filter((_, i) => i !== index))} className="rounded-xl border border-border">x</button>
                  </div>
                ))}
                <button onClick={() => setSubItems((items) => [...items, { name: "", quantity: "" }])} className="w-full rounded-xl border border-dashed border-border py-3 text-sm font-semibold">
                  + Add sub item
                </button>
              </div>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Amount" inputMode="decimal" className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
              <button onClick={publish} disabled={posting} className="w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow disabled:opacity-60">
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
