import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthProvider";
import { useApp } from "@/lib/store";
import { useProducts, useCustomerOrders, useVendorOrders, useAvailableDeliveryOrders } from "@/hooks/use-live-data";
import { sendChatMessage, extractAction, cleanBotResponse, type ChatAction, type AppContext } from "@/lib/services/chat";
import { createProduct, deleteProduct, updateProduct } from "@/lib/services/products";
import { updateOrderStatus, verifyDeliveryOtp } from "@/lib/services/orders";
import { useNavigate } from "@tanstack/react-router";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: number;
};

export function ChatBubble() {
  const { profile, role } = useAuth();
  const nav = useNavigate();
  const cart = useApp((s) => s.cart);
  const addToCart = useApp((s) => s.addToCart);

  // Don't show if not logged in
  if (!profile || !role) return null;

  return <ChatBubbleInner role={role} />;
}

function ChatBubbleInner({ role }: { role: string }) {
  const { profile } = useAuth();
  const nav = useNavigate();
  const cart = useApp((s) => s.cart);
  const addToCart = useApp((s) => s.addToCart);

  const vendorId = profile?.uid ?? "";
  const isVendor = role === "vendor" || role === "admin";
  const isDelivery = role === "delivery";

  // Fetch context data based on role
  const { products } = useProducts(isVendor ? vendorId : undefined);
  const vendorOrders = useVendorOrders(isVendor ? vendorId : undefined);
  const customerOrders = useCustomerOrders(!isVendor && !isDelivery ? profile?.uid : undefined);
  const deliveryOrders = useAvailableDeliveryOrders();

  const orders = isVendor ? vendorOrders : isDelivery ? deliveryOrders : customerOrders;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: `Hey ${profile?.name?.split(" ")[0] || "there"}! 👋 I'm FlowBot, your FlavorFlow assistant. How can I help you today?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const executeAction = useCallback(async (action: ChatAction) => {
    try {
      switch (action.action) {
        case "add_item":
          await createProduct({
            name: action.name,
            vendor: profile?.businessName || profile?.name || "Admin",
            vendorId: profile?.uid || "",
            image: action.image,
            category: profile?.category ?? "other",
            price: action.price,
            subItems: action.subItems || [],
            active: true,
          });
          toast.success(`Added "${action.name}" to your posts`);
          break;

        case "delete_item":
          await deleteProduct(action.productId);
          toast.success("Product deleted");
          break;

        case "update_item":
          await updateProduct(action.productId, action.updates);
          toast.success("Product updated");
          break;

        case "accept_order":
          await updateOrderStatus(action.orderId, "ACCEPTED", { deliveryPartnerId: profile?.uid });
          toast.success("Order accepted!");
          break;

        case "update_status":
          await updateOrderStatus(action.orderId, action.status as any, { deliveryPartnerId: profile?.uid });
          toast.success(`Order marked as ${action.status.toLowerCase().replace(/_/g, " ")}`);
          break;

        case "verify_otp":
          const ok = await verifyDeliveryOtp(action.orderId, action.otp);
          if (ok) toast.success("OTP verified! Order complete.");
          else toast.error("Incorrect OTP");
          break;

        case "add_to_cart": {
          const product = products.find((p) => p.id === action.productId);
          if (product) {
            addToCart(product);
            toast.success(`Added ${product.name} to cart`);
          } else {
            toast.error("Product not found");
          }
          break;
        }

        case "view_cart":
          nav({ to: "/cart" });
          setOpen(false);
          break;

        case "place_order":
          nav({ to: "/checkout" });
          setOpen(false);
          break;

        case "track_order":
          nav({ to: "/track/$id", params: { id: action.orderId } });
          setOpen(false);
          break;
      }
    } catch (error) {
      toast.error("Action failed", { description: error instanceof Error ? error.message : "Try again." });
    }
  }, [profile, products, addToCart, nav]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role === "user" ? "user" as const : "model" as const, text: m.text }));

      const context: AppContext = { products, orders, cart };
      const result = await sendChatMessage(text, history, role as any, profile, context);

      const botMsg: Message = { id: `b-${Date.now()}`, role: "bot", text: result.text, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);

      if (result.action) {
        await executeAction(result.action);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "bot", text: "Sorry, something went wrong. Please try again.", timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-ai text-white shadow-ai"
            style={{ cursor: "grab" }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 left-4 z-50 mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-2xl sm:left-auto sm:w-[380px]"
            style={{ maxHeight: "75vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-ai px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold text-white">FlowBot</h3>
                <p className="text-[10px] text-white/70">Your FlavorFlow AI assistant</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-hide" style={{ maxHeight: "50vh" }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-ai text-white"}`}>
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-ai text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask FlowBot anything..."
                  className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white shadow-ai disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
