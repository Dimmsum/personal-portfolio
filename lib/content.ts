import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { cacheLife, cacheTag } from "next/cache";
import { defaultSite, type Site } from "@/content/site";
import { formatDate } from "./format";
import { hasSupabase } from "./supabase/env";
import { publicClient } from "./supabase/public";

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

/* Cache tags. Admin actions call updateTag() with these so changes show up right away. */
export const TAGS = { posts: "posts", projects: "projects", settings: "settings" } as const;

/* Turns "table not found" into a pointer at the setup step. */
function dbError(what: string, error: { code?: string; message: string }) {
  const hint = error.code === "PGRST205" ? " Run supabase/schema.sql and supabase/seed.sql in this project's SQL Editor (see README)." : "";
  return new Error(`Couldn't load ${what}: ${error.message}.${hint}`);
}

const minutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).length / 220));
const toDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? ""));

/* ---------- Markdown files (used when Supabase isn't configured) ---------- */

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

async function projectsFromFiles(): Promise<Project[]> {
  return (await readFolder("projects")).map(({ slug, data, content }) => ({
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
  }));
}

async function postsFromFiles(): Promise<Post[]> {
  return (await readFolder("posts")).map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? slug),
    date: toDate(data.date),
    tag: String(data.tag ?? "Notes"),
    excerpt: String(data.excerpt ?? ""),
    minutes: minutes(content),
    html: marked.parse(content) as string,
  }));
}

/* ---------- Supabase ---------- */

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  year: number;
  type: string;
  status: string;
  featured: boolean;
  sort_order: number;
  tags: string[];
  blurb: string;
  images: string[];
  link: string;
  repo: string;
  body: string;
  published: boolean;
  updated_at?: string;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  body: string;
  published: boolean;
  updated_at?: string;
};

async function projectsFromDb(): Promise<Project[]> {
  const { data, error } = await publicClient().from("projects").select("*").eq("published", true);
  if (error) throw dbError("projects", error);
  return (data as ProjectRow[]).map((r) => ({
    slug: r.slug,
    title: r.title,
    year: r.year,
    type: r.type,
    status: r.status,
    featured: r.featured,
    order: r.sort_order,
    tags: r.tags ?? [],
    blurb: r.blurb,
    images: (r.images ?? []).filter(Boolean),
    link: r.link,
    repo: r.repo,
    html: marked.parse(r.body ?? "") as string,
  }));
}

async function postsFromDb(): Promise<Post[]> {
  const { data, error } = await publicClient().from("posts").select("*").eq("published", true);
  if (error) throw dbError("posts", error);
  return (data as PostRow[]).map((r) => ({
    slug: r.slug,
    title: r.title,
    date: toDate(r.date),
    tag: r.tag,
    excerpt: r.excerpt,
    minutes: minutes(r.body ?? ""),
    html: marked.parse(r.body ?? "") as string,
  }));
}

/* ---------- What the pages use ---------- */

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.projects);
  const items = hasSupabase ? await projectsFromDb() : await projectsFromFiles();
  return items.sort((a, b) => a.order - b.order || b.year - a.year);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.posts);
  const items = hasSupabase ? await postsFromDb() : await postsFromFiles();
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

/* Saved settings layered over the defaults in content/site.ts. */
export async function getSite(): Promise<Site> {
  "use cache";
  cacheLife("max");
  cacheTag(TAGS.settings);
  if (!hasSupabase) return defaultSite;
  const { data, error } = await publicClient().from("settings").select("data").eq("id", 1).maybeSingle();
  if (error) {
    console.error("Couldn't load settings, using defaults:", error.message);
    return defaultSite;
  }
  return mergeSite(data?.data ?? {});
}

export function mergeSite(saved: Partial<Site>): Site {
  const d = defaultSite;
  return {
    ...d,
    ...saved,
    github: { ...d.github, ...saved.github },
    socials: {
      tiktok: { ...d.socials.tiktok, ...saved.socials?.tiktok },
      instagram: { ...d.socials.instagram, ...saved.socials?.instagram },
    },
    about: { ...d.about, ...saved.about },
  };
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

