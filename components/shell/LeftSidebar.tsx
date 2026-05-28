"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/content/profile";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function LeftSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <HomeIcon />, label: "Overview", exact: true },
    { href: "/about", icon: <PersonIcon />, label: "About" },
    { href: "/projects", icon: <FolderIcon />, label: "Projects" },
    { href: "/posts", icon: <DocumentIcon />, label: "Posts" },
  ];

  const pinnedItems = [
    { href: "/notes", icon: <NotesIcon />, label: "Notes" },
    { href: "/resume", icon: <ResumeIcon />, label: "Resume" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-[var(--bg-elevated)]">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center py-2.5">
        {/* Avatar — always in the icon column, toggles sidebar */}
        <div className="flex w-10 shrink-0 items-center justify-center ml-2">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-white transition-opacity hover:opacity-80"
          >
            <span className="text-xs font-bold tracking-tight">DL</span>
          </button>
        </div>

        {/* Name + role */}
        <div
          className={`flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden pl-2.5 transition-[opacity] duration-200 ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {profile.displayName}
            </div>
            <div className="truncate text-xs text-[var(--text-muted)]">{profile.role}</div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            tabIndex={collapsed ? -1 : 0}
            className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-highlight)] hover:text-[var(--text-muted)]"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
          collapsed ? "max-h-0 opacity-0" : "max-h-14 opacity-100"
        }`}
      >
        <div className="px-3 pb-3">
          <div className="flex h-8 items-center gap-2 rounded-md bg-[var(--bg-highlight)] px-2.5">
            <SearchIcon />
            <span className="flex-1 text-sm text-[var(--text-dim)]">Search</span>
            <kbd className="rounded bg-[var(--bg-base)] px-1.5 py-px text-[10px] text-[var(--text-dim)]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* ── Primary nav ────────────────────────────────────────────────── */}
      <nav className="flex shrink-0 flex-col gap-px">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`mx-2 flex h-8 items-center rounded-md transition-colors ${
                active
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)]"
              }`}
            >
              {/* Icon — fixed 40 px column so it never moves */}
              <span
                className={`flex w-10 shrink-0 items-center justify-center ${
                  active ? "text-[var(--accent)]" : "text-[var(--text-dim)]"
                }`}
              >
                {item.icon}
              </span>
              {/* Label — slides away when collapsed */}
              <span
                className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,opacity] duration-200 ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 pr-2"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Pinned section ─────────────────────────────────────────────── */}
      <div className="mt-3">
        {/* Section header — hidden when collapsed */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
            collapsed ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
          }`}
        >
          <div className="mb-0.5 flex items-center justify-between px-4 py-0.5">
            <div className="flex items-center gap-1 text-[var(--text-dim)]">
              <ChevronDownIcon />
              <span className="text-xs font-medium">Pinned</span>
            </div>
            <button
              type="button"
              aria-label="Add pinned item"
              className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-dim)] transition-colors hover:bg-[var(--bg-highlight)] hover:text-[var(--text-muted)]"
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Pinned items */}
        <div className="flex flex-col gap-px">
          {pinnedItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`mx-2 flex h-8 items-center rounded-md transition-colors ${
                  active
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span
                  className={`flex w-10 shrink-0 items-center justify-center ${
                    active ? "text-[var(--accent)]" : "text-[var(--text-dim)]"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity] duration-200 ${
                    collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 pr-2"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3.172 2 11l1.414 1.414L4 11.828V20a1 1 0 0 0 1 1h4v-6h6v6h4a1 1 0 0 0 1-1v-8.172l.586.586L22 11 12 3.172z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" />
      <circle cx="7" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--text-dim)]" aria-hidden>
      <path d="M7 2a5 5 0 1 1-3.2 8.8l-3 3-1.4-1.4 3-3A5 5 0 0 1 7 2zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="16" height="16" rx="2.5" />
      <line x1="7" y1="2" x2="7" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </svg>
  );
}
