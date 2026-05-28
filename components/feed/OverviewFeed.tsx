import Link from "next/link";
import { getGitHubEvents } from "@/lib/content/github";
import { posts } from "@/lib/content/posts";
import { getRecentlyPlayed } from "@/lib/content/spotify";
import { consuming } from "@/lib/content/consuming";
import type { GitHubEvent, ConsumingItem, Track, Post } from "@/lib/content/types";

export async function OverviewFeed() {
  const [events, tracks] = await Promise.all([
    getGitHubEvents(6),
    getRecentlyPlayed(6),
  ]);
  const recentPosts = [...posts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="px-6 pt-2 pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          What I&apos;m building, writing, listening to, and consuming.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <Row
          label="On GitHub"
          hint="Recent public activity"
          href={{ label: "github.com/Dimmsum", url: "https://github.com/Dimmsum" }}
          empty={events.length === 0 ? "GitHub is quiet right now." : undefined}
        >
          {events.map((ev) => (
            <GitHubCard key={ev.id} event={ev} />
          ))}
        </Row>

        <Row label="Recent writing" hint="Latest blog posts">
          {recentPosts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </Row>

        <Row label="Recently played" hint="From Spotify">
          {tracks.map((t, i) => (
            <TrackCard key={`${t.url}-${i}`} track={t} />
          ))}
        </Row>

        <Row label="On the shelf" hint="Currently reading / watching">
          {consuming.map((it) => (
            <ConsumingCard key={`${it.kind}-${it.title}`} item={it} />
          ))}
        </Row>
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  const links = [
    { label: "GitHub", href: "https://github.com/Dimmsum", icon: <GitHubIcon /> },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/dimetrilee",
      icon: <LinkedInIcon />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/dimetri.al",
      icon: <InstagramIcon />,
    },
    {
      label: "Email",
      href: "mailto:dimetri.lee.2024@gmail.com",
      icon: <MailIcon />,
    },
  ];
  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] pt-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--text-dim)]">
          © {new Date().getFullYear()} Dimetri Lee
        </p>
        <ul className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={l.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-highlight)] hover:text-[var(--accent)]"
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.02 3.24 9.27 7.74 10.77.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.15.68-3.82-1.52-3.82-1.52-.51-1.31-1.26-1.66-1.26-1.66-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.31 3.12 1.16.9-.25 1.87-.38 2.83-.39.96 0 1.93.13 2.83.39 2.17-1.47 3.12-1.16 3.12-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55 4.5-1.5 7.73-5.75 7.73-10.77C23.33 5.57 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.12 1.39A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.39 2.12.66.66 1.33 1.08 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.39 5.86 5.86 0 0 0 1.39-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.39-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function Row({
  label,
  hint,
  href,
  empty,
  children,
}: {
  label: string;
  hint?: string;
  href?: { label: string; url: string };
  empty?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{label}</h2>
          {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
        </div>
        {href && (
          <a
            href={href.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            {href.label} →
          </a>
        )}
      </div>
      {empty ? (
        <div className="rounded-lg bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
          {empty}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {children}
        </div>
      )}
    </section>
  );
}

function Card({
  href,
  external,
  cover,
  title,
  subtitle,
  meta,
}: {
  href?: string;
  external?: boolean;
  cover: React.ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  const inner = (
    <div className="group flex flex-col gap-3 rounded-lg bg-[var(--bg-card)] p-3 transition-colors hover:bg-[var(--bg-highlight)]">
      <div className="aspect-square w-full overflow-hidden rounded-md shadow-md">
        {cover}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </div>
        {subtitle && (
          <div className="line-clamp-2 text-xs text-[var(--text-muted)]">
            {subtitle}
          </div>
        )}
        {meta && (
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--text-dim)]">
            {meta}
          </div>
        )}
      </div>
    </div>
  );
  if (!href) return inner;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

function GitHubCard({ event }: { event: GitHubEvent }) {
  const palette = ghPalette(event.type);
  const glyph =
    event.type === "push"
      ? "↑"
      : event.type === "pr"
      ? "PR"
      : event.type === "create"
      ? "+"
      : "★";
  const kindLabel =
    event.type === "push"
      ? "Push"
      : event.type === "pr"
      ? "Pull request"
      : event.type === "create"
      ? "Created"
      : "Starred";
  return (
    <Card
      href={event.url}
      external
      cover={
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: palette }}
        >
          <span className="font-mono text-5xl font-bold text-black/80 drop-shadow">
            {glyph}
          </span>
        </div>
      }
      title={event.repo.split("/").pop() ?? event.repo}
      subtitle={event.summary}
      meta={`${kindLabel} · ${formatRelative(event.at)}`}
    />
  );
}

function ghPalette(type: GitHubEvent["type"]): string {
  switch (type) {
    case "push":
      return "linear-gradient(135deg,#38bdf8 0%,#1e3a8a 100%)";
    case "pr":
      return "linear-gradient(135deg,#a855f7 0%,#4c1d95 100%)";
    case "create":
      return "linear-gradient(135deg,#38bdf8 0%,#0c4a6e 100%)";
    case "star":
      return "linear-gradient(135deg,#fbbf24 0%,#78350f 100%)";
  }
}

function PostCard({ post }: { post: Post }) {
  const grad = postPalette(post.slug);
  const initial = post.title.slice(0, 1).toUpperCase();
  return (
    <Card
      href={`/blog/${post.slug}`}
      cover={
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: grad }}
        >
          <span className="font-serif text-6xl font-bold text-white/90 drop-shadow">
            {initial}
          </span>
        </div>
      }
      title={post.title}
      subtitle={post.excerpt}
      meta={post.publishedAt}
    />
  );
}

function postPalette(seed: string): string {
  const palettes = [
    "linear-gradient(135deg,#38bdf8 0%,#1e3a8a 100%)",
    "linear-gradient(135deg,#ef4444 0%,#7f1d1d 100%)",
    "linear-gradient(135deg,#6366f1 0%,#1e1b4b 100%)",
    "linear-gradient(135deg,#ec4899 0%,#831843 100%)",
    "linear-gradient(135deg,#f59e0b 0%,#78350f 100%)",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return palettes[Math.abs(h) % palettes.length];
}

function TrackCard({ track }: { track: Track }) {
  return (
    <Card
      href={track.url}
      external
      cover={
        <div className="h-full w-full bg-[var(--bg-highlight)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.albumArt}
            alt={track.album}
            className="h-full w-full object-cover"
          />
        </div>
      }
      title={track.title}
      subtitle={track.artist}
      meta={formatRelative(track.playedAt)}
    />
  );
}

function ConsumingCard({ item }: { item: ConsumingItem }) {
  const kindLabel = item.kind === "book" ? "Reading" : "Watching";
  return (
    <Card
      cover={
        item.cover ? (
          <div className="h-full w-full bg-[var(--bg-highlight)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.cover}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: consumingPalette(item.kind) }}
          >
            <span className="font-serif text-5xl font-bold text-white/90 drop-shadow">
              {item.title.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )
      }
      title={item.title}
      subtitle={item.creator}
      meta={kindLabel}
    />
  );
}

function consumingPalette(kind: ConsumingItem["kind"]): string {
  return kind === "book"
    ? "linear-gradient(135deg,#f97316 0%,#7c2d12 100%)"
    : "linear-gradient(135deg,#8b5cf6 0%,#312e81 100%)";
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return iso.slice(0, 10);
}
