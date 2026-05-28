"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { projects } from "@/lib/content/projects";
import type { ProjectStatus } from "@/lib/content/types";
import { CollapseToggle } from "./CollapseToggle";

type Filter = "all" | ProjectStatus;
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "archived", label: "Archived" },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export function LeftSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.status === filter)),
    [filter]
  );

  return (
    <div className="flex h-full flex-col rounded-lg bg-[var(--bg-elevated)]">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        {!collapsed && (
          <h2 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
            Projects
          </h2>
        )}
        <CollapseToggle side="left" collapsed={collapsed} onToggle={onToggle} />
      </div>

      {!collapsed && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-[var(--text-primary)] text-[var(--bg-elevated)]"
                  : "bg-[var(--bg-highlight)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin">
        <ul className="flex flex-col gap-1">
          {visible.map((p) => {
            const href = `/projects/${p.slug}`;
            const active = pathname === href;
            return (
              <li key={p.slug}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors ${
                    active
                      ? "bg-[var(--bg-highlight)]"
                      : "hover:bg-[var(--bg-highlight)]"
                  }`}
                  title={p.name}
                >
                  <Thumb name={p.name} status={p.status} />
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-[var(--text-primary)]">
                        {p.name}
                      </div>
                      <div className="truncate text-xs text-[var(--text-muted)]">
                        <StatusLabel status={p.status} /> · {p.tags[0] ?? "project"}
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Thumb({ name, status }: { name: string; status: ProjectStatus }) {
  const initial = name.slice(0, 1).toUpperCase();
  const ring =
    status === "in-progress"
      ? "ring-1 ring-[var(--accent)]"
      : status === "completed"
      ? "ring-1 ring-white/20"
      : "ring-1 ring-white/5";
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-zinc-700 to-zinc-900 text-sm font-semibold text-white ${ring}`}
    >
      {initial}
    </div>
  );
}

function StatusLabel({ status }: { status: ProjectStatus }) {
  if (status === "in-progress") return <span className="text-[var(--accent)]">In progress</span>;
  if (status === "completed") return <span>Completed</span>;
  return <span>Archived</span>;
}
