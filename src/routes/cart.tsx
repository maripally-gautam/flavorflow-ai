import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp, cartTotal } from "@/lib/store";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const { cart, setQty, removeFromCart } = useApp();
  const subtotal = cartTotal(cart);
  const delivery = subtotal > 0 ? (subtotal > 299 ? 0 : 29) : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + taxes;

  if (cart.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Your cart" />
        <div className="grid place-items-center py-24 text-center px-8">
          <div className="w-20 h-20 rounded-3xl bg-accent grid place-items-center mb-4">
            <ShoppingBag className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mt-1">Discover dishes and add favourites to get rolling.</p>
          <Link to="/home" className="mt-6 px-6 py-3 bg-gradient-warm text-white font-semibold rounded-2xl shadow-glow">Browse menu</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <PageHeader title="Your cart" subtitle={`from ${cart[0].product.vendor}`} />
      <div className="p-5 space-y-3">
        {cart.map((c) => (
          <div key={c.product.id} className="flex gap-3 p-3 bg-card rounded-2xl border border-border shadow-card">
            <img src={c.product.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm line-clamp-1">{c.product.name}</div>
              <div className="text-xs text-muted-foreground">₹{c.product.price}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center bg-accent rounded-xl">
                  <button onClick={() => setQty(c.product.id, c.qty - 1)} className="w-8 h-8 grid place-items-center"><Minus className="w-3 h-3" /></button>
                  <span className="px-2 text-sm font-bold w-6 text-center">{c.qty}</span>
                  <button onClick={() => setQty(c.product.id, c.qty + 1)} className="w-8 h-8 grid place-items-center"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeFromCart(c.product.id)} className="w-8 h-8 grid place-items-center text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="text-sm font-bold">₹{c.product.price * c.qty}</div>
          </div>
        ))}

        <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border-2 border-dashed border-border">
          <Tag className="w-4 h-4 text-primary" />
          <input placeholder="Promo code" className="flex-1 bg-transparent outline-none text-sm" />
          <button className="text-xs font-semibold text-primary">APPLY</button>
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border space-y-2 text-sm">
          <Row label="Subtotal" value={`₹${subtotal}`} />
          <Row label="Delivery" value={delivery === 0 ? "FREE" : `₹${delivery}`} muted={delivery === 0} />
          <Row label="Taxes & fees" value={`₹${taxes}`} />
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="font-display font-bold text-lg">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom px-4 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Total · {cart.length} item{cart.length > 1 ? "s" : ""}</div>
            <div className="font-display font-bold text-xl">₹{total}</div>
          </div>
          <Link to="/checkout" className="flex-1 grid place-items-center bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow">
            Checkout
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-mint font-semibold" : "font-medium"}>{value}</span>
    </div>
  );
}
