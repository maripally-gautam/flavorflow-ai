import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ChefHat, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/welcome" }), 1800);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-sunset grid place-items-center">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0_0_0/0.3),transparent_60%)]" />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.9 }}
        className="relative text-center text-white"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto w-24 h-24 rounded-3xl glass-dark border border-white/30 grid place-items-center mb-6 shadow-2xl"
        >
          <ChefHat className="w-12 h-12" strokeWidth={2.2} />
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white grid place-items-center"
          >
            <Sparkles className="w-4 h-4 text-ember" />
          </motion.span>
        </motion.div>
        <h1 className="font-display font-extrabold text-5xl tracking-tight">CurryFlow</h1>
        <p className="mt-2 text-white/85 text-sm font-medium tracking-wide">AI-POWERED FOOD COMMERCE</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-12 text-white/70 text-xs"
      >
        crafted with 🌶️ by CurryFlow Labs
      </motion.div>
    </div>
  );
}
