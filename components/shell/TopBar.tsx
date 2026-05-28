"use client";

import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-end bg-[var(--bg-elevated)]/80 px-6 py-4 backdrop-blur">
      <ThemeToggle />
    </div>
  );
}
