"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-[var(--bg-elevated)]/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <NavButton ariaLabel="Go back" onClick={() => router.back()}>
          <svg viewBox="0 0 16 16" width="14" height="14" className="fill-current" aria-hidden>
            <path d="M10.5 2.5 5 8l5.5 5.5 1-1L7 8l4.5-4.5z" />
          </svg>
        </NavButton>
        <NavButton ariaLabel="Go forward" onClick={() => router.forward()}>
          <svg viewBox="0 0 16 16" width="14" height="14" className="fill-current" aria-hidden>
            <path d="M5.5 2.5 11 8l-5.5 5.5-1-1L9 8 4.5 3.5z" />
          </svg>
        </NavButton>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <Link
          href="/"
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
            isHome
              ? "bg-[var(--text-primary)] text-[var(--bg-elevated)]"
              : "bg-[var(--bg-highlight)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" className="fill-current" aria-hidden>
            <path d="M12 3.172 2 11l1.414 1.414L4 11.828V20a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1v-8.172l.586.586L22 11 12 3.172z" />
          </svg>
        </Link>
        <div className="flex h-10 flex-1 max-w-md items-center gap-2 rounded-full bg-[var(--bg-highlight)] px-4 text-[var(--text-muted)]">
          <svg viewBox="0 0 16 16" width="14" height="14" className="fill-current" aria-hidden>
            <path d="M7 2a5 5 0 1 1-3.2 8.8l-3 3-1.4-1.4 3-3A5 5 0 0 1 7 2zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
          <span className="text-sm">Search projects & posts</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-highlight)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
    >
      {children}
    </button>
  );
}
