import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function ProjectsAdmin() {
  const { sb } = await requireAdmin();
  const { data, error } = await sb
    .from("projects")
    .select("id,slug,title,year,type,featured,published,sort_order")
    .order("sort_order")
    .order("year", { ascending: false });
  const projects = data ?? [];
  return (
    <>
      <div className="ad-head">
        <h1>Projects</h1>
        <Link className="btn" href="/admin/projects/new">
          + New project
        </Link>
      </div>
      <p className="ad-muted">Listed in the order they show on the site. Change the order number on a project to move it.</p>
      {error && <p className="ad-error">{error.message}</p>}
      {projects.length === 0 && !error ? (
        <p className="ad-empty">No projects yet.</p>
      ) : (
        <ul className="ad-list">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/projects/${p.id}`}>
                <b>{p.title}</b>
                <span className="ad-muted">
                  #{p.sort_order} · {p.type} · {p.year}
                  {p.featured ? " · ★ On home page" : ""}
                </span>
              </Link>
              <span className={`ad-pill${p.published ? " on" : ""}`}>{p.published ? "Live" : "Hidden"}</span>
              {p.published && (
                <a className="ad-link" href={`/work/${p.slug}`} target="_blank" rel="noreferrer">
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
