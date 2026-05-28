import { projects } from "./projects";
import { posts } from "./posts";
import type { ActivityItem } from "./types";

const notes: { id: string; at: string; body: string }[] = [
  {
    id: "n-001",
    at: "2026-05-22",
    body: "Sketched the three-column layout on paper before touching code — saved an hour of refactoring.",
  },
];

export function getActivity(): ActivityItem[] {
  const items: ActivityItem[] = [
    ...projects.map<ActivityItem>((p) => ({
      kind: "project-update",
      at: p.updatedAt,
      project: p,
      note: `Updated — ${p.tagline}`,
    })),
    ...posts.map<ActivityItem>((post) => ({
      kind: "post",
      at: post.publishedAt,
      post,
    })),
    ...notes.map<ActivityItem>((n) => ({
      kind: "note",
      at: n.at,
      id: n.id,
      body: n.body,
    })),
  ];

  return items.sort((a, b) => (a.at < b.at ? 1 : -1));
}
