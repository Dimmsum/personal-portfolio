"use server";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
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

export type AuthState = { error?: string; field?: "email" | "password"; email?: string; sent?: boolean } | undefined;

/* Only allow redirects back into the admin area, never to another site. */
const safeNext = (v: unknown) => {
  const s = String(v ?? "");
  return s.startsWith("/admin/") && !s.startsWith("//") && !s.includes("\\") && !s.startsWith("/admin/login") ? s : "/admin/posts";
};

const authMessage = (code: string | undefined, message: string) => {
  switch (code) {
    case "invalid_credentials":
      return "That email and password don't match. Check both and try again.";
    case "email_not_confirmed":
      return "This account isn't confirmed yet. In Supabase, open Authentication → Users and confirm it.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Wait a few minutes, then try again.";
    case "weak_password":
      return "That password is too easy to guess. Use a longer one.";
    case "same_password":
      return "That's your current password. Choose a new one.";
    default:
      return message;
  }
};

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form.get("email"), 320).toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!hasSupabase) return { email, error: "Sign-in isn't connected yet. Add the Supabase keys to .env.local (see README)." };
  if (!email) return { email, field: "email", error: "Enter your email." };
  if (!password) return { email, field: "password", error: "Enter your password." };

  const sb = await serverClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { email, field: error.code === "invalid_credentials" ? "password" : undefined, error: authMessage(error.code, error.message) };

  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) {
    await sb.auth.signOut();
    return { email, field: "email", error: "This account can't edit the site." };
  }
  redirect(safeNext(form.get("next")));
}

export async function requestReset(_: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form.get("email"), 320).toLowerCase();
  if (!hasSupabase) return { email, error: "Sign-in isn't connected yet." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { email, field: "email", error: "Enter the email you sign in with." };

  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const sb = await serverClient();
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/admin/auth/callback?next=/admin/reset` });
  // Same reply whether or not the account exists, so the form can't be used to find accounts.
  if (error && (error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"))
    return { email, error: authMessage(error.code, error.message) };
  return { email, sent: true };
}

export async function updatePassword(_: AuthState, form: FormData): Promise<AuthState> {
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 10) return { field: "password", error: "Use at least 10 characters." };
  if (password !== confirm) return { field: "password", error: "The two passwords don't match." };

  const sb = await serverClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { error } = await sb.auth.updateUser({ password });
  if (error) return { field: "password", error: authMessage(error.code, error.message) };
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
