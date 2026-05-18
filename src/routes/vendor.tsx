import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Settings, User, X, Trash2, Edit3, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useProducts, useVendorOrders } from "@/hooks/use-live-data";
import { useAuth, useRequireRole } from "@/lib/AuthProvider";
import { createProduct, deleteProduct } from "@/lib/services/products";
import type { ProductSubItem } from "@/lib/types";

export const Route = createFileRoute("/vendor")({ component: Vendor });

const categoryLabels: Record<string, string> = {
  food: "🍽️ Food",
  "trip-kit": "🏕️ Trip Kit",
  "gym-kit": "💪 Gym Kit",
  other: "📦 Other",
};

function Vendor() {
  useRequireRole(["vendor", "admin"]);
  const { profile } = useAuth();
  const vendorId = profile?.uid ?? "local-admin";
  const { products } = useProducts(vendorId);
  const orders = useVendorOrders(vendorId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [subItems, setSubItems] = useState<ProductSubItem[]>([{ name: "", quantity: "" }]);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryDisplay = profile?.category === "other" && profile?.customCategory
    ? `📦 ${profile.customCategory}`
    : categoryLabels[profile?.category ?? "other"] ?? "📦 Other";

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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
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
          <div className="flex items-center gap-2">
            <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
              <Settings className="h-5 w-5" />
            </Link>
            <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-md space-y-6 p-5">
        {/* Category Badge */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-warm text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Category</p>
              <p className="font-display text-lg font-bold">{categoryDisplay}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">All your posts are automatically listed under this category for users to browse.</p>
        </section>

        {/* Posts */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Your posts</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold">{products.length}</span>
          </div>
          {products.map((product) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
            >
              <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">{product.name}</h3>
                  <span className="font-display font-bold">Rs {product.price}</span>
                </div>
                <div className="mt-3 space-y-1">
                  {product.subItems.map((item, index) => (
                    <p key={`${item.name}-${index}`} className="text-sm text-muted-foreground">{item.name}: {item.quantity}</p>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
          {products.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No posts yet. Use add to publish your first item.</p>}
        </section>

        {/* Orders */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Paid orders</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold">{orders.length}</span>
          </div>
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{order.status.replaceAll("_", " ")}</p>
                  <h3 className="mt-1 font-bold">{order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{order.customerName || "Customer"} - {order.timeSlot}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{order.address}</p>
                </div>
                <strong>Rs {order.total}</strong>
              </div>
            </article>
          ))}
          {orders.length === 0 && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">No paid orders yet.</p>}
        </section>
      </main>

      <Link to="/profile" className="fixed bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-card">
        <User className="h-5 w-5" />
      </Link>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-8">
          <div className="mx-auto max-h-full max-w-md overflow-auto rounded-2xl bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Add post</h2>
                <p className="text-xs text-muted-foreground">Category: {categoryDisplay}</p>
              </div>
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
