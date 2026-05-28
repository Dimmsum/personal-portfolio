import type { Post } from "@/lib/content/types";

export function PostDetail({ post }: { post: Post }) {
  return (
    <article className="px-6 pt-2 pb-12">
      <header className="border-b border-[var(--border-subtle)] pb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Post · <span className="font-mono">{post.publishedAt}</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-base text-[var(--text-muted)]">{post.excerpt}</p>
      </header>

      <div className="prose-portfolio mt-8 max-w-2xl text-base leading-7 text-[var(--text-primary)] whitespace-pre-wrap">
        {post.body}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-[var(--bg-highlight)] px-3 py-1 text-xs text-[var(--text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
