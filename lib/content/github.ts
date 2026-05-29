import type { GitHubEvent, GitHubEventType } from "./types";

const GH_USER = "Dimmsum";
const ENDPOINT = `https://api.github.com/users/${GH_USER}/events/public`;

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    head?: string;
    ref?: string;
    ref_type?: string;
    commits?: { message: string; sha: string }[];
    pull_request?: { title: string; html_url: string; merged?: boolean; state?: string };
    action?: string;
  };
};

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type CommitDetail = { message: string; additions: number; deletions: number };

async function fetchCommitDetail(repo: string, sha: string): Promise<CommitDetail> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
      headers: ghHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { message: "", additions: 0, deletions: 0 };
    const data = (await res.json()) as {
      commit?: { message?: string };
      stats?: { additions?: number; deletions?: number };
    };
    return {
      message: data.commit?.message?.split("\n")[0] ?? "",
      additions: data.stats?.additions ?? 0,
      deletions: data.stats?.deletions ?? 0,
    };
  } catch {
    return { message: "", additions: 0, deletions: 0 };
  }
}

export async function getGitHubEvents(limit = 6): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(ENDPOINT, {
      headers: ghHeaders(),
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const raw = (await res.json()) as RawEvent[];
    const normalized: GitHubEvent[] = [];
    for (const ev of raw) {
      const n = await normalize(ev);
      if (n) normalized.push(n);
      if (normalized.length >= limit) break;
    }
    return normalized;
  } catch {
    return [];
  }
}

async function normalize(ev: RawEvent): Promise<GitHubEvent | null> {
  const repo = ev.repo.name;
  const repoUrl = `https://github.com/${repo}`;
  const base = { id: ev.id, repo, at: ev.created_at };

  if (ev.type === "PushEvent") {
    const sha = ev.payload.head ?? ev.payload.commits?.[0]?.sha;
    const detail = sha ? await fetchCommitDetail(repo, sha) : null;
    const message =
      detail?.message ||
      ev.payload.commits?.[0]?.message?.split("\n")[0] ||
      `pushed to ${repo}`;
    return {
      ...base,
      type: "push" as GitHubEventType,
      summary: message,
      url: repoUrl,
      additions: detail?.additions,
      deletions: detail?.deletions,
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
