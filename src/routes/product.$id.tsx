import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/use-live-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({ component: ProductDetail });

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const router = useRouter();
  const { products, loading } = useProducts();
  const product = products.find((item) => item.id === id);
  const { cart, addToCart, setQty } = useApp();
  const inCart = cart.find((item) => item.product.id === id);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Item not found.</div>;

  const add = () => {
    addToCart(product);
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-[44vh]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/20" />
        <button onClick={() => router.history.back()} className="safe-top absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <main className="mx-auto max-w-md px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.vendor}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">{product.name}</h1>
        <p className="mt-2 font-display text-2xl font-bold">Rs {product.price}</p>
        {product.description && <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>}

        <section className="mt-6 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold">Sub items</h2>
          <div className="mt-3 space-y-2">
            {product.subItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex justify-between gap-3 text-sm">
                <span>{item.name}</span>
                <span className="font-semibold text-muted-foreground">{item.quantity}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom bg-gradient-to-t from-background via-background to-transparent px-4 pt-4">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {inCart ? (
            <>
              <div className="flex flex-1 items-center justify-between rounded-2xl border border-border bg-card p-2">
                <button onClick={() => setQty(product.id, inCart.qty - 1)} className="grid h-10 w-10 place-items-center rounded-xl bg-accent"><Minus className="h-4 w-4" /></button>
                <span className="font-bold">{inCart.qty}</span>
                <button onClick={() => setQty(product.id, inCart.qty + 1)} className="grid h-10 w-10 place-items-center rounded-xl bg-accent"><Plus className="h-4 w-4" /></button>
              </div>
              <Link to="/cart" className="flex-1 rounded-2xl bg-gradient-warm py-4 text-center font-bold text-white shadow-glow">Go to cart</Link>
            </>
          ) : (
            <button onClick={add} className="w-full rounded-2xl bg-gradient-warm py-4 font-bold text-white shadow-glow">
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
