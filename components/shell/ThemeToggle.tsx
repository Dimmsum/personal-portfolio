"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const LS_KEY = "portfolio:theme";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("theme-light") ? "light" : "dark";
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-light", t === "light");
  root.classList.toggle("theme-dark", t === "dark");
  root.setAttribute("data-theme", t);
  try {
    localStorage.setItem(LS_KEY, t);
  } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from DOM on mount
    setTheme(currentTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-highlight)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current" aria-hidden>
          <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
      )}
    </button>
  );
}
