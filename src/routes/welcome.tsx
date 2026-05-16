import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/welcome")({ component: Welcome });

const slides = [
  { title: "Curries crafted by\nlocal chefs", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80" },
  { title: "Meal kits, ready\nin 25 minutes", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80" },
  { title: "AI that knows\nwhat you crave", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80" },
];

function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative h-[60vh] grid grid-cols-3 gap-2 p-3 pt-12">
          {slides.map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: i % 2 === 0 ? 0 : 16, opacity: 1 }}
              transition={{ delay: i * 0.12, type: "spring" }}
              className="relative rounded-3xl overflow-hidden shadow-card"
            >
              <img src={s.img} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="px-6 pb-10 pt-6 bg-card rounded-t-[2rem] -mt-10 relative shadow-card safe-bottom">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          <Sparkles className="w-3 h-3 text-ai" /> Powered by AI
        </span>
        <h1 className="font-display font-extrabold text-3xl leading-tight mt-3">
          Real food. <span className="text-gradient-warm">Smart picks.</span><br />Delivered fast.
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Order curries, AI-generated meal kits, or just the spices. Your kitchen, supercharged.
        </p>
        <Link to="/signup" className="mt-6 flex items-center justify-center gap-2 bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition">
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/login" className="block text-center mt-3 text-sm font-medium text-muted-foreground">
          I already have an account
        </Link>
      </motion.div>
    </div>
  );
}
