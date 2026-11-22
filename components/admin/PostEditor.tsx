"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePost, savePost, type PostInput } from "@/app/admin/actions";
import type { PostRow } from "@/lib/content";
import { Field, MarkdownField, SaveBar, slugify, Toggle, useEditorGuards, type SaveState } from "./fields";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

export function PostEditor({ post, tags }: { post: PostRow | null; tags: string[] }) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>(() =>
    post
      ? { id: post.id, slug: post.slug, title: post.title, date: String(post.date).slice(0, 10), tag: post.tag, excerpt: post.excerpt, body: post.body, published: post.published }
      : { slug: "", title: "", date: today(), tag: tags[0] ?? "Notes", excerpt: "", body: "", published: false },
  );
  const [saved, setSaved] = useState(form);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const [, startTransition] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = (overrides: Partial<PostInput> = {}) => {
    const next = { ...form, ...overrides };
    setForm(next);
    setState({ kind: "saving" });
    startTransition(async () => {
      const res = await savePost(next);
      if (!res.ok) return setState({ kind: "error", message: res.error });
      const withId = { ...next, id: res.id };
      setForm(withId);
      setSaved(withId);
      setState({ kind: "saved" });
      if (!post) router.replace(`/admin/posts/${res.id}`);
      else router.refresh();
    });
  };
  useEditorGuards(dirty, () => save());

  return (
    <div className="ad-editor">
      <div className="ad-head">
        <div>
          <Link className="ad-link" href="/admin/posts">
            ← All posts
          </Link>
          <h1>{post ? "Edit post" : "New post"}</h1>
        </div>
        {post && saved.published && (
          <a className="ad-link" href={`/blog/${saved.slug}`} target="_blank" rel="noreferrer">
            View on site ↗
          </a>
        )}
      </div>

      <div className="ad-grid">
        <div className="ad-stack">
          <input
            className="ad-title"
            value={form.title}
            placeholder="Post title"
            aria-label="Title"
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
            }}
          />
          <MarkdownField value={form.body} onChange={(v) => set("body", v)} folder="posts" />
        </div>

        <aside className="ad-card ad-stack ad-side">
          <Toggle
            label={form.published ? "Published" : "Draft"}
            hint={form.published ? "Anyone can read it." : "Only you can see it."}
            checked={form.published}
            onChange={(v) => set("published", v)}
          />
          <Field label="Date">
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Tag" hint="Used for the filters on /blog.">
            <input list="post-tags" value={form.tag} onChange={(e) => set("tag", e.target.value)} />
            <datalist id="post-tags">
              {tags.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Excerpt" hint="One line shown in the post list.">
            <textarea rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>
          <Field label="URL" hint={<>dimetrilee.com/blog/<b>{form.slug || "…"}</b></>}>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </Field>
        </aside>
      </div>

      <SaveBar
        state={state}
        dirty={dirty}
        onSave={() => save()}
        saveLabel={form.published ? (saved.published ? "Update" : "Publish") : "Save draft"}
        savedText={saved.published ? "Saved. It's live." : "Draft saved."}
        onDelete={
          post
            ? () =>
                startTransition(async () => {
                  const res = await deletePost(post.id);
                  if (res && !res.ok) setState({ kind: "error", message: res.error });
                })
            : undefined
        }
      />
    </div>
  );
}
