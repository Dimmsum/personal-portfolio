"use server";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/content";
import { hasSupabase } from "@/lib/supabase/env";
import { serverClient } from "@/lib/supabase/server";
import type { Site } from "@/content/site";

export type Result = { ok: true; id?: string } | { ok: false; error: string };

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const text = (v: unknown, max = 100_000) => String(v ?? "").trim().slice(0, max);
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => text(x, 2000)).filter(Boolean) : []);
const friendly = (msg: string) =>
  msg.includes("duplicate key") ? "That URL slug is already used by another item. Pick a different one." : msg;

/* ---------------------------------------------------------------- auth */

export async function login(_: unknown, form: FormData): Promise<{ error: string } | undefined> {
  if (!hasSupabase) return { error: "Supabase isn't set up yet. Add the keys to .env.local (see README)." };
  const sb = await serverClient();
  const { error } = await sb.auth.signInWithPassword({ email: text(form.get("email"), 320), password: String(form.get("password") ?? "") });
  if (error) return { error: error.message === "Invalid login credentials" ? "Wrong email or password." : error.message };
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) {
    await sb.auth.signOut();
    return { error: "This account isn't on the admin list. Add its email to the admins table in Supabase." };
  }
  redirect("/admin/posts");
}

export async function logout() {
  const sb = await serverClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

/* ---------------------------------------------------------------- posts */

export type PostInput = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  body: string;
  published: boolean;
};

export async function savePost(input: PostInput): Promise<Result> {
  const { sb } = await requireAdmin();
  const row = {
    slug: text(input.slug, 120),
    title: text(input.title, 300),
    date: text(input.date, 10),
    tag: text(input.tag, 60) || "Notes",
    excerpt: text(input.excerpt, 500),
    body: String(input.body ?? ""),
    published: Boolean(input.published),
  };
  if (!row.title) return { ok: false, error: "Give the post a title." };
  if (!SLUG.test(row.slug)) return { ok: false, error: "The URL slug can only use lowercase letters, numbers and dashes." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return { ok: false, error: "Pick a date." };

  const q = input.id ? sb.from("posts").update(row).eq("id", input.id) : sb.from("posts").insert(row);
  const { data, error } = await q.select("id").single();
  if (error) return { ok: false, error: friendly(error.message) };
  updateTag(TAGS.posts);
  return { ok: true, id: data.id };
}

export async function deletePost(id: string) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message } satisfies Result;
  updateTag(TAGS.posts);
  redirect("/admin/posts");
}

/* ---------------------------------------------------------------- projects */

export type ProjectInput = {
  id?: string;
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
};

export async function saveProject(input: ProjectInput): Promise<Result> {
  const { sb } = await requireAdmin();
  const row = {
    slug: text(input.slug, 120),
    title: text(input.title, 300),
    year: Math.round(Number(input.year)) || new Date().getFullYear(),
    type: text(input.type, 60) || "Other",
    status: text(input.status, 60),
    featured: Boolean(input.featured),
    sort_order: Math.round(Number(input.sort_order)) || 0,
    tags: list(input.tags),
    blurb: text(input.blurb, 500),
    images: list(input.images),
    link: text(input.link, 2000),
    repo: text(input.repo, 2000),
    body: String(input.body ?? ""),
    published: Boolean(input.published),
  };
  if (!row.title) return { ok: false, error: "Give the project a title." };
  if (!SLUG.test(row.slug)) return { ok: false, error: "The URL slug can only use lowercase letters, numbers and dashes." };

  const q = input.id ? sb.from("projects").update(row).eq("id", input.id) : sb.from("projects").insert(row);
  const { data, error } = await q.select("id").single();
  if (error) return { ok: false, error: friendly(error.message) };
  updateTag(TAGS.projects);
  return { ok: true, id: data.id };
}

export async function deleteProject(id: string) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message } satisfies Result;
  updateTag(TAGS.projects);
  redirect("/admin/projects");
}

/* ---------------------------------------------------------------- settings */

export async function saveSettings(data: Site): Promise<Result> {
  const { sb } = await requireAdmin();
  if (!data || typeof data !== "object" || !data.first || !data.socials?.tiktok || !data.socials?.instagram)
    return { ok: false, error: "Settings look incomplete. Reload the page and try again." };
  if (JSON.stringify(data).length > 200_000) return { ok: false, error: "Settings are too large to save." };
  const clean: Site = {
    ...data,
    github: { ...data.github, count: Math.max(0, Math.min(30, Math.round(Number(data.github.count)) || 0)) },
    socials: {
      tiktok: { ...data.socials.tiktok, followers: Math.max(0, Number(data.socials.tiktok.followers) || 0) },
      instagram: { ...data.socials.instagram, followers: Math.max(0, Number(data.socials.instagram.followers) || 0) },
    },
  };
  const { error } = await sb.from("settings").update({ data: clean }).eq("id", 1);
  if (error) return { ok: false, error: error.message };
  updateTag(TAGS.settings);
  return { ok: true };
}
