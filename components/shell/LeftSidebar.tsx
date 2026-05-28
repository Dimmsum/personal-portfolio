"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { posts } from "@/lib/content/posts";
import { profile } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";
import { CollapseToggle } from "./CollapseToggle";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

// ─── Main component ───────────────────────────────────────────────────────────

export function LeftSidebar({ collapsed, onToggle }: Props) {
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)).slice(0, 2),
    []
  );

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-lg bg-[var(--bg-elevated)] ${collapsed ? "cursor-pointer" : ""}`}>
      {/* Collapse toggle — centered when collapsed, right-aligned when expanded */}
      <div className={`flex items-center px-2 pt-2 pb-1 ${collapsed ? "justify-center" : "justify-end"}`}>
        <CollapseToggle side="left" collapsed={collapsed} onToggle={onToggle} />
      </div>

      {/* Primary nav — vertically stacked */}
      <div className={`flex flex-col gap-0.5 pb-1 ${collapsed ? "items-center px-0" : "px-2"}`}>
        <NavItem
          icon={<PersonIcon />}
          label="About Me"
          href="/about"
          collapsed={collapsed}
          preview={
            <div className="flex flex-col gap-0.5">
              <div className="font-medium text-[var(--text-muted)]">{profile.displayName ?? profile.name}</div>
              <div className="text-[var(--text-dim)]">{profile.role}</div>
              <p className="mt-1 line-clamp-2 text-[var(--text-dim)]">{profile.bio}</p>
            </div>
          }
        />
        <NavItem
          icon={<FolderIcon />}
          label="Projects"
          href="/projects"
          collapsed={collapsed}
          preview={
            <div className="flex flex-col gap-0.5">
              {projects.slice(0, 3).map((p) => (
                <div key={p.slug} className="truncate text-[var(--text-muted)]">{p.name}</div>
              ))}
            </div>
          }
        />
        <NavItem
          icon={<DocumentIcon />}
          label="Posts"
          href="/posts"
          collapsed={collapsed}
          preview={
            <div className="flex flex-col gap-1">
              {sortedPosts.map((p) => (
                <div key={p.slug} className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[var(--text-muted)]">{p.title}</span>
                  <span className="shrink-0 text-[var(--text-dim)]">{formatDate(p.publishedAt)}</span>
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* Misc section — pinned to bottom */}
      <div className="mt-auto shrink-0 border-t border-[var(--border-subtle)] py-2 px-2">
        <MiscItem href="/notes"  icon={<NotesIcon />}  label="Notes"  collapsed={collapsed} />
        <MiscItem href="/resume" icon={<ResumeIcon />} label="Resume" collapsed={collapsed} />
      </div>
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  icon,
  label,
  href,
  collapsed,
  preview,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  preview?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <div className="group">
      <Link
        href={href}
        title={label}
        className={`flex items-center rounded-md transition-colors ${
          collapsed ? "h-9 w-9 justify-center" : "w-full gap-2 px-2 py-1.5"
        } ${
          active
            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)]"
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-[opacity,max-width] ${
          collapsed ? "max-w-0 opacity-0 duration-150" : "max-w-[200px] opacity-100 duration-200 delay-[160ms]"
        }`}>
          {label}
        </span>
      </Link>
      {!collapsed && preview && (
        <div className="max-h-0 overflow-hidden transition-all duration-200 ease-out group-hover:max-h-48">
          <div className="px-2 pb-2 pt-0.5 text-xs">
            {preview}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Misc section item ────────────────────────────────────────────────────────

function MiscItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      title={label}
      className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors ${
        active ? "bg-[var(--bg-highlight)]" : "hover:bg-[var(--bg-highlight)]"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
          active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
        }`}
      >
        {icon}
      </span>
      <span className={`overflow-hidden whitespace-nowrap text-sm text-[var(--text-primary)] transition-[opacity,max-width] ${
        collapsed ? "max-w-0 opacity-0 duration-150" : "max-w-[200px] opacity-100 duration-200 delay-[160ms]"
      }`}>
        {label}
      </span>
    </Link>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
