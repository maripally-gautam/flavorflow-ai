import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="mx-auto max-w-md min-h-screen relative pb-28">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
