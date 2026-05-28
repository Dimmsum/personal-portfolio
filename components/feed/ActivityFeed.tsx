import Link from "next/link";
import { getActivity } from "@/lib/content/activity";
import type { ActivityItem } from "@/lib/content/types";

export function ActivityFeed() {
  const items = getActivity();

  return (
    <div className="px-6 pt-2 pb-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Recently</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Projects, writing, and notes — newest first.
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i}>
            <FeedRow item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeedRow({ item }: { item: ActivityItem }) {
  if (item.kind === "project-update") {
    return (
      <Link
        href={`/projects/${item.project.slug}`}
        className="flex items-center gap-4 rounded-md p-3 hover:bg-[var(--bg-highlight)] transition-colors"
      >
        <Badge label="Project" tone="accent" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{item.project.name}</div>
          <div className="truncate text-xs text-[var(--text-muted)]">{item.note}</div>
        </div>
        <DateTag iso={item.at} />
      </Link>
    );
  }
  if (item.kind === "post") {
    return (
      <Link
        href={`/blog/${item.post.slug}`}
        className="flex items-center gap-4 rounded-md p-3 hover:bg-[var(--bg-highlight)] transition-colors"
      >
        <Badge label="Post" tone="muted" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{item.post.title}</div>
          <div className="truncate text-xs text-[var(--text-muted)]">{item.post.excerpt}</div>
        </div>
        <DateTag iso={item.at} />
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-md p-3">
      <Badge label="Note" tone="dim" />
      <div className="min-w-0 flex-1 text-sm text-[var(--text-muted)]">{item.body}</div>
      <DateTag iso={item.at} />
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "accent" | "muted" | "dim" }) {
  const cls =
    tone === "accent"
      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
      : tone === "muted"
      ? "bg-[var(--bg-highlight)] text-[var(--text-primary)]"
      : "bg-[var(--bg-highlight)] text-[var(--text-muted)]";
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

function DateTag({ iso }: { iso: string }) {
  return (
    <span className="shrink-0 font-mono text-xs text-[var(--text-dim)]">{iso}</span>
  );
}
