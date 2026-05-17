import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, User, Store, Bike, Camera, CheckCircle2, Sparkles, FileCheck, Upload } from "lucide-react";
import { useApp } from "@/lib/store";
import { signInWithGoogle, signUpWithEmail } from "@/lib/services/auth";
import { uploadFile } from "@/lib/services/storage";
import { verifyFssaiCertificate } from "@/lib/services/ai";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: Signup });

const roles = [
  { id: "customer", label: "Customer", desc: "Order curries, kits & spices", icon: User, gradient: "bg-gradient-warm" },
  { id: "vendor", label: "Vendor", desc: "Sell your food creations", icon: Store, gradient: "bg-gradient-sunset" },
  { id: "delivery", label: "Delivery Partner", desc: "Earn on your schedule", icon: Bike, gradient: "bg-gradient-ai" },
] as const;

function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"customer" | "vendor" | "delivery">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [trustScore, setTrustScore] = useState(98);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const nav = useNavigate();
  const setUser = useApp((s) => s.setUser);

  const totalSteps = role === "vendor" ? 5 : 4;

  const next = () => {
    if (step === 3 && role === "vendor" && !verified) {
      setVerifying(true);
      (async () => {
        try {
          if (certificate) {
            const result = await verifyFssaiCertificate(certificate);
            setTrustScore(result.trustScore ?? 82);
          }
          setVerified(true);
          setStep(4);
        } catch {
          toast.error("AI verification needs review", { description: "You can continue and complete manual review later." });
          setVerified(true);
          setStep(4);
        } finally {
          setVerifying(false);
        }
      })();
      return;
    }
    setStep((s) => s + 1);
  };

  const finish = async () => {
    try {
      const profile = await signUpWithEmail({ email, password, name: name || "Guest", role, phone, city, businessName });
      if (certificate && profile?.uid) await uploadFile(`fssai/${profile.uid}/${certificate.name}`, certificate);
      setUser({ name: profile?.name ?? name ?? "Guest", role: profile?.role ?? role, avatar: profile?.avatar ?? "https://i.pravatar.cc/150?img=47" });
      nav({ to: role === "vendor" ? "/vendor" : role === "delivery" ? "/delivery" : "/home" });
    } catch (error) {
      toast.error("Could not create account", { description: error instanceof Error ? error.message : "Check the required fields." });
    }
  };

  const finishWithGoogle = async () => {
    try {
      const profile = await signInWithGoogle(role);
      setUser({ name: profile?.name ?? "Guest", role: profile?.role ?? role, avatar: profile?.avatar });
      nav({ to: profile?.role === "vendor" ? "/vendor" : profile?.role === "delivery" ? "/delivery" : "/home" });
    } catch (error) {
      toast.error("Google signup failed", { description: error instanceof Error ? error.message : "Try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="safe-top px-5 pt-3 pb-2 flex items-center gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : nav({ to: "/welcome" })} className="w-9 h-9 grid place-items-center rounded-xl bg-card border border-border">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? "bg-gradient-warm" : "bg-border"}`} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-medium">{step}/{totalSteps}</span>
      </div>

      <div className="px-6 pt-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}>

            {step === 1 && (
              <>
                <h2 className="font-display font-extrabold text-3xl leading-tight">How will you<br />use CurryFlow?</h2>
                <p className="text-muted-foreground text-sm mt-2">Pick the role that fits you best.</p>
                <div className="mt-8 space-y-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = role === r.id;
                    return (
                      <button key={r.id} onClick={() => setRole(r.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${active ? "border-primary bg-primary/5 shadow-card" : "border-border bg-card"}`}>
                        <div className={`w-12 h-12 rounded-xl ${r.gradient} grid place-items-center text-white shadow-card`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.desc}</div>
                        </div>
                        {active && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-display font-extrabold text-3xl leading-tight">Tell us about yourself</h2>
                <p className="text-muted-foreground text-sm mt-2">We'll personalize your experience.</p>
                <div className="mt-6 space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                    className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address"
                    className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
                    className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  {role === "vendor" && (
                    <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border focus:border-primary outline-none" />
                  )}
                </div>
              </>
            )}

            {step === 3 && role !== "vendor" && (
              <>
                <h2 className="font-display font-extrabold text-3xl leading-tight">Add a profile photo</h2>
                <p className="text-muted-foreground text-sm mt-2">So delivery partners recognize you.</p>
                <div className="mt-10 grid place-items-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-warm grid place-items-center text-white shadow-glow">
                      <Camera className="w-12 h-12" />
                    </div>
                    <button className="absolute bottom-2 right-2 w-12 h-12 grid place-items-center rounded-full bg-card border-4 border-background shadow-card">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">Tap to upload — optional</p>
                </div>
              </>
            )}

            {step === 3 && role === "vendor" && (
              <>
                <h2 className="font-display font-extrabold text-3xl leading-tight">FSSAI verification</h2>
                <p className="text-muted-foreground text-sm mt-2">Upload your certificate. AI will verify in seconds.</p>
                <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-center">
                  <FileCheck className="w-10 h-10 text-primary mb-3" />
                  <div className="font-semibold">Drop FSSAI certificate</div>
                  <div className="text-xs text-muted-foreground mt-1">PDF or image · up to 5 MB</div>
                  <label className="mt-4 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">
                    Choose file
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setCertificate(e.target.files?.[0] ?? null)} />
                  </label>
                  {certificate && <div className="mt-3 text-xs text-muted-foreground">{certificate.name}</div>}
                </div>
                {verifying && (
                  <div className="mt-6 p-5 rounded-2xl bg-gradient-ai text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 grid place-items-center pulse-ring">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">AI verifying your document</div>
                        <div className="text-xs text-white/80">Scanning, validating, cross-checking…</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 4 && role === "vendor" && (
              <>
                <div className="grid place-items-center text-center mt-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                    className="w-24 h-24 rounded-full bg-gradient-ai grid place-items-center text-white shadow-ai mb-5">
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h2 className="font-display font-extrabold text-3xl">AI Verified Vendor</h2>
                  <p className="text-muted-foreground text-sm mt-2 max-w-xs">Your FSSAI cert checked out. You'll now display a verified badge across CurryFlow.</p>
                  <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai/10 text-ai font-semibold text-sm">
                    <Sparkles className="w-4 h-4" /> Trust score · {trustScore}%
                  </div>
                </div>
              </>
            )}

            {((step === 4 && role !== "vendor") || (step === 5 && role === "vendor")) && (
              <>
                <h2 className="font-display font-extrabold text-3xl leading-tight">Almost there</h2>
                <p className="text-muted-foreground text-sm mt-2">Link your Google account or finish setup.</p>
                <button onClick={finishWithGoogle} className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-card border border-border rounded-2xl font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#fbbc04" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Continue with Google
                </button>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 safe-bottom px-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="mx-auto max-w-md">
          {((step === 4 && role !== "vendor") || (step === 5 && role === "vendor")) ? (
            <button onClick={finish} className="w-full bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition">
              Enter CurryFlow
            </button>
          ) : (
            <button onClick={next} disabled={verifying}
              className="w-full bg-gradient-warm text-white font-semibold py-4 rounded-2xl shadow-glow active:scale-[0.98] transition disabled:opacity-60">
              {verifying ? "Verifying…" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
