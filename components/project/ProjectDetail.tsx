import type { Project } from "@/lib/content/types";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="flex flex-col">
      <div className="bg-gradient-to-b from-zinc-700/40 to-transparent px-6 pt-2 pb-8">
        <div className="flex items-end gap-6">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-zinc-600 to-zinc-900 text-5xl font-bold shadow-2xl">
            {project.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Project
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{project.name}</h1>
            <p className="mt-2 text-base text-[var(--text-muted)]">{project.tagline}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <StatusPill status={project.status} />
              <span>·</span>
              <span className="font-mono">started {project.startedAt}</span>
              <span>·</span>
              <span className="font-mono">updated {project.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--bg-highlight)] px-3 py-1 text-xs text-[var(--text-muted)]"
            >
              {t}
            </span>
          ))}
        </div>

        <section className="mt-8 max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            About
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--text-primary)]">
            {project.description}
          </p>
        </section>

        {project.links && project.links.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Links
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)]"
                  >
                    {l.label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const map = {
    "in-progress": { label: "In progress", cls: "bg-[var(--accent)]/15 text-[var(--accent)]" },
    completed: { label: "Completed", cls: "bg-[var(--bg-highlight)] text-[var(--text-primary)]" },
    archived: { label: "Archived", cls: "bg-[var(--bg-highlight)] text-[var(--text-muted)]" },
  } as const;
  const s = map[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
}
