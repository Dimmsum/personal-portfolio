import { projects } from "@/lib/content/projects";
import type { ProjectStatus } from "@/lib/content/types";

export default function ProjectsPage() {
  return (
    <div className="px-6 pt-6 pb-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Projects</h1>
      <div className="flex flex-col gap-3 max-w-2xl">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col gap-2 rounded-lg bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">{p.name}</div>
                <div className="mt-0.5 text-sm text-[var(--text-muted)]">{p.tagline}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--bg-highlight)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    "in-progress": "bg-[var(--accent)]/10 text-[var(--accent)]",
    "completed":   "bg-emerald-400/10 text-emerald-400",
    "archived":    "bg-[var(--bg-highlight)] text-[var(--text-dim)]",
  };
  const labels: Record<ProjectStatus, string> = {
    "in-progress": "In progress",
    "completed":   "Completed",
    "archived":    "Archived",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
