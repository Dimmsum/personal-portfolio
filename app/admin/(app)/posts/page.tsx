import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export default async function PostsAdmin() {
  const { sb } = await requireAdmin();
  const { data, error } = await sb.from("posts").select("id,slug,title,date,tag,published").order("date", { ascending: false });
  const posts = data ?? [];
  return (
    <>
      <div className="ad-head">
        <h1>Blog</h1>
        <Link className="btn" href="/admin/posts/new">
          + New post
        </Link>
      </div>
      {error && <p className="ad-error">{error.message}</p>}
      {posts.length === 0 && !error ? (
        <p className="ad-empty">No posts yet. Write your first one.</p>
      ) : (
        <ul className="ad-list">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/posts/${p.id}`}>
                <b>{p.title}</b>
                <span className="ad-muted">
                  {formatDate(p.date)} · {p.tag}
                </span>
              </Link>
              <span className={`ad-pill${p.published ? " on" : ""}`}>{p.published ? "Published" : "Draft"}</span>
              {p.published && (
                <a className="ad-link" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">
                  View ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
