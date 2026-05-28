import { posts } from "@/lib/content/posts";

export default function PostsPage() {
  const sorted = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="px-6 pt-6 pb-16 max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Posts</h1>
      <div className="flex flex-col gap-8">
        {sorted.map((p) => (
          <article key={p.slug}>
            <div className="mb-1 text-xs text-[var(--text-dim)]">{formatDate(p.publishedAt)}</div>
            <h2 className="font-semibold text-[var(--text-primary)]">{p.title}</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
