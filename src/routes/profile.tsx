import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";
import { Bike, ChevronRight, CreditCard, Heart, LogOut, MapPin, Moon, Receipt, Settings, Sparkles, Store, Sun } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const { user, dark, toggleDark, setUser } = useApp();
  const nav = useNavigate();
  const isVendor = user?.role === "vendor";
  const isDelivery = user?.role === "delivery";

  return (
    <AppShell>
      <PageHeader title="Profile" sticky={false} />
      <div className="px-5">
        <div className="p-4 rounded-2xl bg-gradient-warm text-white shadow-glow relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <img src={user?.avatar} alt="" className="w-16 h-16 rounded-2xl border-2 border-white/40 object-cover" />
            <div>
              <div className="font-display font-bold text-lg">{user?.name}</div>
              <div className="text-xs opacity-90 capitalize">{user?.role} · CurryFlow Gold</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> 248 AI picks loved
              </div>
            </div>
          </div>
        </div>

        {/* Role switcher */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Link to="/vendor" className="p-3 rounded-2xl bg-card border border-border text-center">
            <Store className="w-5 h-5 mx-auto text-primary" />
            <div className="text-[11px] font-semibold mt-1">Vendor</div>
          </Link>
          <Link to="/delivery" className="p-3 rounded-2xl bg-card border border-border text-center">
            <Bike className="w-5 h-5 mx-auto text-primary" />
            <div className="text-[11px] font-semibold mt-1">Delivery</div>
          </Link>
          <Link to="/notifications" className="p-3 rounded-2xl bg-card border border-border text-center">
            <Receipt className="w-5 h-5 mx-auto text-primary" />
            <div className="text-[11px] font-semibold mt-1">Inbox</div>
          </Link>
        </div>

        <Section title="Account">
          <Row icon={MapPin} label="Saved addresses" sub="Home · Work · +2" />
          <Row icon={CreditCard} label="Payment methods" sub="VISA •• 4242, UPI" />
          <Row icon={Heart} label="Favourites" sub="14 dishes" />
        </Section>

        <Section title="Preferences">
          <Row icon={Sparkles} label="AI food preferences" sub="Spicy 🌶️🌶️ · High-protein · No mushroom" accent />
          <button onClick={toggleDark} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center">
              {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold">Dark mode</div>
              <div className="text-xs text-muted-foreground">{dark ? "On" : "Off"}</div>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition ${dark ? "bg-primary" : "bg-border"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${dark ? "left-5" : "left-0.5"}`} />
            </div>
          </button>
          <Row icon={Settings} label="App settings" />
        </Section>

        <button onClick={() => { setUser(null); nav({ to: "/" }); }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-destructive/30 text-destructive font-semibold">
          <LogOut className="w-4 h-4" /> Log out
        </button>
        <p className="text-center text-xs text-muted-foreground mt-6">CurryFlow v1.0.0 · made with 🌶️</p>
        <div className="h-6" />
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, accent }: { icon: any; label: string; sub?: string; accent?: boolean }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${accent ? "bg-gradient-ai text-white" : "bg-accent"}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-semibold">{label}</div>
        {sub && <div className="text-xs text-muted-foreground line-clamp-1">{sub}</div>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
