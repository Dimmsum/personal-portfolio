"use client";

import { profile } from "@/lib/content/profile";
import { CollapseToggle } from "./CollapseToggle";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function RightSidebar({ collapsed, onToggle }: Props) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label="Expand About panel"
        aria-expanded={false}
        className="relative flex h-full w-full overflow-hidden rounded-lg bg-[var(--bg-elevated)] text-left text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)]"
      >
        <div className="flex h-full w-10 shrink-0 items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden
            className="fill-current"
          >
            <path d="M10.5 2.5 5 8l5.5 5.5 1-1L7 8l4.5-4.5z" />
          </svg>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 flex w-64 flex-col justify-center gap-3 px-4 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <Avatar name={profile.name} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {profile.name}
              </div>
              <div className="truncate text-xs text-[var(--text-muted)]">
                {profile.role}
              </div>
            </div>
          </div>
          <div className="line-clamp-3 text-xs leading-5 text-[var(--text-muted)]">
            {profile.bio}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
            Click to expand
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-[var(--bg-elevated)]">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
          About
        </h2>
        <CollapseToggle side="right" collapsed={collapsed} onToggle={onToggle} />
      </div>
      <AboutContent className="px-4 pb-4" />
    </div>
  );
}

function AboutContent({ className }: { className: string }) {
  return (
    <div className={`flex-1 overflow-y-auto ${className} scrollbar-thin`}>
      <div className="flex flex-col gap-5">
        <div className="rounded-lg bg-[var(--bg-card)] p-4">
          <div className="flex items-center gap-3">
            <Avatar name={profile.name} />
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{profile.name}</div>
              <div className="truncate text-xs text-[var(--text-muted)]">
                {profile.role}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
            {profile.bio}
          </p>
          {profile.location && (
            <div className="mt-3 text-xs text-[var(--text-dim)] font-mono">
              {profile.location}
            </div>
          )}
        </div>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Now
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-[var(--text-primary)]">
            {profile.now.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-[var(--accent)]">·</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Contact
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {profile.contact.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="h-12 w-12 flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-sky-700 font-semibold text-black">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
