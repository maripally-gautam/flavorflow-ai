import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Send, Mic, ChevronLeft, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products as fallbackProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { getAiIntent, runProductSearch } from "@/lib/services/ai";
import { getLatestOrder } from "@/lib/services/orders";
import { useProducts } from "@/hooks/use-live-data";
import { useAuth } from "@/lib/AuthProvider";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({ component: Assistant });

type Msg = { id: string; role: "user" | "ai"; text?: string; products?: typeof fallbackProducts };

const suggestions = [
  "Suggest dinner for 2 under ₹500",
  "Spicy paneer curries",
  "Generate a meal kit under ₹250",
  "Track my latest order",
];

function Assistant() {
  const router = useRouter();
  const { profile } = useAuth();
  const { products } = useProducts();
  const addToCart = useApp((s) => s.addToCart);
  const liveProducts = products.length ? products : fallbackProducts;
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", role: "ai", text: "Hi! I'm your CurryFlow AI. What are you craving tonight?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setTyping(true);
    try {
      const intent = await getAiIntent(text);
      if (intent.intent === "TRACK_ORDER") {
        const order = await getLatestOrder(profile?.uid);
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: order ? `Your latest order ${order.id} is ${order.status}. OTP: ${order.otp}.` : "I couldn't find an active order yet." }]);
        return;
      }
      if (intent.intent === "ADD_TO_CART") {
        const match = runProductSearch(intent, liveProducts)[0];
        if (match) {
          const added = addToCart(match);
          if (added.ok) toast.success(`${match.name} added to cart`);
          setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: added.ok ? `Added ${match.name} to your cart.` : `Your cart has items from ${added.conflictVendor}. Replace it to add ${match.name}.`, products: [match] }]);
          return;
        }
      }
      const matches = intent.intent === "GENERATE_MEAL_KIT"
        ? liveProducts.filter((p) => p.category === "kit").slice(0, 4)
        : runProductSearch(intent, liveProducts);
      setMessages((m) => [...m, {
        id: crypto.randomUUID(),
        role: "ai",
        text: matches.length ? "I found live matches from nearby kitchens." : "I can help you discover dishes, build meal kits, or track orders. Try a more specific craving.",
        products: matches,
      }]);
    } catch {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: "AI is warming up. Try searching products or tracking an order again." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <AppShell hideNav>
      <div className="safe-top sticky top-0 z-30 glass border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.history.back()} className="w-9 h-9 grid place-items-center rounded-xl bg-card border border-border">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-gradient-ai grid place-items-center text-white shadow-ai">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold">CurryFlow AI</h1>
          <p className="text-xs text-mint flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" /> Online · Gemini intents
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="px-4 pt-4 pb-40 space-y-4 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${m.role === "user"
                ? "bg-gradient-warm text-white rounded-2xl rounded-tr-md px-4 py-2.5"
                : "bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-card"}`}>
                {m.text && <p className="text-sm leading-snug">{m.text}</p>}
                {m.products && (
                  <div className="mt-3 -mx-1 grid grid-cols-2 gap-2">
                    {m.products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex items-center gap-2 ml-1">
            <div className="bg-card border border-border rounded-2xl px-3 py-2.5 flex gap-1">
              {[0,1,2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom px-4 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-md">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 p-2 bg-card border border-border rounded-2xl shadow-card">
            <button type="button" className="w-9 h-9 grid place-items-center rounded-xl text-muted-foreground"><Plus className="w-5 h-5" /></button>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-sm py-2" />
            {input ? (
              <button type="submit" className="w-9 h-9 grid place-items-center rounded-xl bg-gradient-ai text-white"><Send className="w-4 h-4" /></button>
            ) : (
              <button type="button" className="w-9 h-9 grid place-items-center rounded-xl bg-gradient-ai text-white"><Mic className="w-4 h-4" /></button>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
