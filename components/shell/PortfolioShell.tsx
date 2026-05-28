"use client";

import { useEffect, useState } from "react";
import { LeftSidebar } from "./LeftSidebar";
import { TopBar } from "./TopBar";

const LS_LEFT = "portfolio:leftCollapsed";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage requires a client-only state sync
    setLeftCollapsed(localStorage.getItem(LS_LEFT) === "1");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_LEFT, leftCollapsed ? "1" : "0");
  }, [leftCollapsed, hydrated]);

  return (
    <div className="flex h-full w-full gap-2 p-2">
      <aside
        className={`${
          leftCollapsed ? "w-[72px]" : "w-[320px]"
        } shrink-0 transition-[width] duration-300 ease-in-out`}
      >
        <LeftSidebar
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed((v) => !v)}
        />
      </aside>

      <main className="flex-1 min-w-0 overflow-hidden rounded-lg bg-[var(--bg-elevated)]">
        <div className="flex h-full flex-col">
          <TopBar />
          <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
        </div>
      </main>
    </div>
  );
}
