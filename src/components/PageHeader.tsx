import { ChevronLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { ReactNode } from "react";

export function PageHeader({ title, subtitle, right, sticky = true }: { title: string; subtitle?: string; right?: ReactNode; sticky?: boolean }) {
  const router = useRouter();
  return (
    <div className={`${sticky ? "sticky top-0 z-30" : ""} glass safe-top px-4 pb-3 pt-3 border-b border-border/50`}>
      <div className="flex items-center gap-3">
        <button onClick={() => router.history.back()} className="w-9 h-9 grid place-items-center rounded-xl bg-card border border-border active:scale-90 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-lg leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
