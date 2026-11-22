import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { cacheLife } from "next/cache";
import { formatDate } from "./format";

export type Project = {
  slug: string;
  title: string;
  year: number;
  type: string;
  status: string;
  featured: boolean;
  order: number;
  tags: string[];
  blurb: string;
  images: string[];
  link: string;
  repo: string;
  html: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tag: string;
  excerpt: string;
  minutes: number;
  html: string;
};

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  updated?: string;
};

async function readFolder(folder: string) {
  const dir = path.join(process.cwd(), "content", folder);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  return Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await fs.readFile(path.join(dir, file), "utf8"));
      return { slug: file.replace(/\.md$/, ""), data, content };
    }),
  );
}

const toDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? ""));

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  const items = await readFolder("projects");
  return items
    .map(({ slug, data, content }) => ({
      slug,
      title: String(data.title ?? slug),
      year: Number(data.year ?? new Date(0).getFullYear()),
      type: String(data.type ?? "Other"),
      status: String(data.status ?? ""),
      featured: Boolean(data.featured),
      order: Number(data.order ?? 99),
      tags: (data.tags ?? []) as string[],
      blurb: String(data.blurb ?? ""),
      images: (data.images ?? []) as string[],
      link: String(data.link ?? ""),
      repo: String(data.repo ?? ""),
      html: marked.parse(content) as string,
    }))
    .sort((a, b) => a.order - b.order || b.year - a.year);
}

export async function getProject(slug: string) {
  "use cache";
  cacheLife("max");
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  const items = await readFolder("posts");
  return items
    .map(({ slug, data, content }) => ({
      slug,
      title: String(data.title ?? slug),
      date: toDate(data.date),
      tag: String(data.tag ?? "Notes"),
      excerpt: String(data.excerpt ?? ""),
      minutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
      html: marked.parse(content) as string,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  "use cache";
  cacheLife("max");
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

/* Live repos, refreshed every hour. Returns null if GitHub can't be reached. */
export async function getRepos(user: string, count: number): Promise<Repo[] | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const list = (await res.json()) as Array<Record<string, unknown>>;
    const repos = list
      .filter((r) => !r.fork)
      .slice(0, count)
      .map((r) => ({
        name: String(r.name),
        description: (r.description as string) ?? null,
        language: (r.language as string) ?? null,
        stars: Number(r.stargazers_count ?? 0),
        url: String(r.html_url),
        updated: formatDate(String(r.pushed_at).slice(0, 10), false),
      }));
    return repos.length ? repos : null;
  } catch {
    return null;
  }
}

export async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

