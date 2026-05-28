import type { GitHubEvent, GitHubEventType } from "./types";

const GH_USER = "Dimmsum";
const ENDPOINT = `https://api.github.com/users/${GH_USER}/events/public`;

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    ref?: string;
    ref_type?: string;
    commits?: { message: string; sha: string }[];
    pull_request?: { title: string; html_url: string; merged?: boolean; state?: string };
    action?: string;
  };
};

export async function getGitHubEvents(limit = 6): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const raw = (await res.json()) as RawEvent[];
    const normalized: GitHubEvent[] = [];
    for (const ev of raw) {
      const n = normalize(ev);
      if (n) normalized.push(n);
      if (normalized.length >= limit) break;
    }
    return normalized;
  } catch {
    return [];
  }
}

function normalize(ev: RawEvent): GitHubEvent | null {
  const repo = ev.repo.name;
  const repoUrl = `https://github.com/${repo}`;
  const base = { id: ev.id, repo, at: ev.created_at };

  if (ev.type === "PushEvent") {
    const count = ev.payload.commits?.length ?? 0;
    const first = ev.payload.commits?.[0]?.message?.split("\n")[0] ?? "";
    return {
      ...base,
      type: "push" as GitHubEventType,
      summary: count > 1 ? `${count} commits — ${first}` : first || `Pushed to ${repo}`,
      url: repoUrl,
    };
  }
  if (ev.type === "PullRequestEvent" && ev.payload.pull_request) {
    const pr = ev.payload.pull_request;
    return {
      ...base,
      type: "pr",
      summary: `${ev.payload.action ?? "updated"} PR — ${pr.title}`,
      url: pr.html_url,
    };
  }
  if (ev.type === "CreateEvent") {
    return {
      ...base,
      type: "create",
      summary: `Created ${ev.payload.ref_type ?? "ref"}${
        ev.payload.ref ? ` ${ev.payload.ref}` : ""
      }`,
      url: repoUrl,
    };
  }
  if (ev.type === "WatchEvent") {
    return {
      ...base,
      type: "star",
      summary: `Starred ${repo}`,
      url: repoUrl,
    };
  }
  return null;
}
