import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const theme = useApp((state) => state.theme ?? "dark");
  const setTheme = useApp((state) => state.setTheme);

  return (
    <AppShell hideNav>
      <PageHeader title="Settings" />
      <main className="mx-auto max-w-md p-5">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h1 className="font-display text-xl font-bold">Theme</h1>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold ${
                theme === "dark" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
              }`}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold ${
                theme === "light" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
              }`}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
