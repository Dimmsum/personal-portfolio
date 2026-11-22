"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, saveProject, type ProjectInput } from "@/app/admin/actions";
import type { ProjectRow } from "@/lib/content";
import { Field, ImageList, MarkdownField, SaveBar, slugify, Toggle, useEditorGuards, type SaveState } from "./fields";

export function ProjectEditor({ project, types }: { project: ProjectRow | null; types: string[] }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(() =>
    project
      ? {
          id: project.id,
          slug: project.slug,
          title: project.title,
          year: project.year,
          type: project.type,
          status: project.status,
          featured: project.featured,
          sort_order: project.sort_order,
          tags: project.tags ?? [],
          blurb: project.blurb,
          images: project.images ?? [],
          link: project.link,
          repo: project.repo,
          body: project.body,
          published: project.published,
        }
      : {
          slug: "",
          title: "",
          year: new Date().getFullYear(),
          type: types[0] ?? "Web",
          status: "",
          featured: false,
          sort_order: 10,
          tags: [],
          blurb: "",
          images: [],
          link: "",
          repo: "",
          body: "",
          published: true,
        },
  );
  const [saved, setSaved] = useState(form);
  const [tagText, setTagText] = useState(form.tags.join(", "));
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const [, startTransition] = useTransition();
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    setState({ kind: "saving" });
    startTransition(async () => {
      const res = await saveProject(form);
      if (!res.ok) return setState({ kind: "error", message: res.error });
      const withId = { ...form, id: res.id };
      setForm(withId);
      setSaved(withId);
      setState({ kind: "saved" });
      if (!project) router.replace(`/admin/projects/${res.id}`);
      else router.refresh();
    });
  };
  useEditorGuards(dirty, save);

  return (
    <div className="ad-editor">
      <div className="ad-head">
        <div>
          <Link className="ad-link" href="/admin/projects">
            ← All projects
          </Link>
          <h1>{project ? "Edit project" : "New project"}</h1>
        </div>
        {project && saved.published && (
          <a className="ad-link" href={`/work/${saved.slug}`} target="_blank" rel="noreferrer">
            View on site ↗
          </a>
        )}
      </div>

      <div className="ad-grid">
        <div className="ad-stack">
          <input
            className="ad-title"
            value={form.title}
            placeholder="Project name"
            aria-label="Title"
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
            }}
          />
          <Field label="One-line summary" hint="Shown on the project card.">
            <input value={form.blurb} onChange={(e) => set("blurb", e.target.value)} />
          </Field>
          <div className="ad-field">
            <span>Images</span>
            <ImageList value={form.images} onChange={(v) => set("images", v)} folder="projects" />
            <small>The first image is the cover. With none, a navy cover with the title is drawn for you.</small>
          </div>
          <div className="ad-field">
            <span>Write-up</span>
            <MarkdownField value={form.body} onChange={(v) => set("body", v)} folder="projects" rows={16} />
          </div>
        </div>

        <aside className="ad-card ad-stack ad-side">
          <Toggle
            label={form.published ? "Live" : "Hidden"}
            hint={form.published ? "Shown on /work." : "Only you can see it."}
            checked={form.published}
            onChange={(v) => set("published", v)}
          />
          <Toggle label="Feature on home page" hint="The first three featured, by order." checked={form.featured} onChange={(v) => set("featured", v)} />
          <div className="ad-two">
            <Field label="Year">
              <input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
            </Field>
            <Field label="Order" hint="Lower shows first.">
              <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Type" hint="Filter on /work: Mobile, Web, AI…">
            <input list="project-types" value={form.type} onChange={(e) => set("type", e.target.value)} />
            <datalist id="project-types">
              {types.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Status" hint="Optional: Shipped, In progress, Client…">
            <input value={form.status} onChange={(e) => set("status", e.target.value)} />
          </Field>
          <Field label="Stack" hint="Separate with commas.">
            <input
              value={tagText}
              onChange={(e) => {
                setTagText(e.target.value);
                set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean));
              }}
            />
          </Field>
          <Field label="Live link">
            <input type="url" value={form.link} placeholder="https://" onChange={(e) => set("link", e.target.value)} />
          </Field>
          <Field label="Code link">
            <input type="url" value={form.repo} placeholder="https://github.com/…" onChange={(e) => set("repo", e.target.value)} />
          </Field>
          <Field label="URL" hint={<>dimetrilee.com/work/<b>{form.slug || "…"}</b></>}>
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
        onSave={save}
        savedText={saved.published ? "Saved. It's live." : "Saved (hidden)."}
        onDelete={
          project
            ? () =>
                startTransition(async () => {
                  const res = await deleteProject(project.id);
                  if (res && !res.ok) setState({ kind: "error", message: res.error });
                })
            : undefined
        }
      />
    </div>
  );
}
