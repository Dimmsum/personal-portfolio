"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { Site } from "@/content/site";
import { Field, ImageField, SaveBar, useEditorGuards, type SaveState } from "./fields";

const ICONS = ["users", "play", "code", "pen", "pin", "brief", "cap", "dumb", "heart", "eye", "star", "mail", "github", "linkedin", "tiktok", "instagram"];

type Col = { key: string; label: string; kind?: "text" | "long" | "icon" | "image"; placeholder?: string };
type Row = Record<string, string>;

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="ad-card ad-stack ad-section">
      <div>
        <h2>{title}</h2>
        {hint && <p className="ad-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/* Add, remove, reorder and edit a list of small records. */
function ListEditor({ rows, cols, onChange, addLabel, folder = "site" }: { rows: Row[]; cols: Col[]; onChange: (r: Row[]) => void; addLabel: string; folder?: string }) {
  const update = (i: number, key: string, v: string) => onChange(rows.map((r, k) => (k === i ? { ...r, [key]: v } : r)));
  const move = (i: number, d: number) => {
    const next = [...rows];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="ad-stack">
      {rows.map((r, i) => (
        <div className="ad-item" key={i}>
          <div className="ad-item-fields">
            {cols.map((c) => (
              <Field key={c.key} label={c.label} wide={c.kind === "long" || c.kind === "image"}>
                {c.kind === "long" ? (
                  <textarea rows={3} value={r[c.key] ?? ""} placeholder={c.placeholder} onChange={(e) => update(i, c.key, e.target.value)} />
                ) : c.kind === "icon" ? (
                  <select value={r[c.key] ?? ""} onChange={(e) => update(i, c.key, e.target.value)}>
                    {ICONS.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                ) : c.kind === "image" ? (
                  <ImageField value={r[c.key] ?? ""} folder={folder} onChange={(v) => update(i, c.key, v)} />
                ) : (
                  <input value={r[c.key] ?? ""} placeholder={c.placeholder} onChange={(e) => update(i, c.key, e.target.value)} />
                )}
              </Field>
            ))}
          </div>
          <div className="ad-item-ctl">
            <button type="button" className="ad-btn quiet" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
              ↑
            </button>
            <button type="button" className="ad-btn quiet" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
              ↓
            </button>
            <button type="button" className="ad-btn quiet" onClick={() => onChange(rows.filter((_, k) => k !== i))}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="ad-btn" onClick={() => onChange([...rows, Object.fromEntries(cols.map((c) => [c.key, c.kind === "icon" ? ICONS[0] : ""]))])}>
          {addLabel}
        </button>
      </div>
    </div>
  );
}

/* Lists of plain strings (bio paragraphs) reuse the list editor with one column. */
const toRows = (xs: string[]) => xs.map((text) => ({ text }));
const fromRows = (rs: Row[]) => rs.map((r) => r.text ?? "");

export function SettingsEditor({ initial }: { initial: Site }) {
  const router = useRouter();
  const [site, setSite] = useState<Site>(initial);
  const [saved, setSaved] = useState(initial);
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const [, startTransition] = useTransition();
  const dirty = JSON.stringify(site) !== JSON.stringify(saved);

  const set = <K extends keyof Site>(k: K, v: Site[K]) => setSite((s) => ({ ...s, [k]: v }));
  const text = (k: keyof Site) => ({ value: String(site[k] ?? ""), onChange: (e: { target: { value: string } }) => set(k, e.target.value as never) });
  const social = (k: "tiktok" | "instagram", f: "handle" | "url" | "followers", v: string) =>
    set("socials", { ...site.socials, [k]: { ...site.socials[k], [f]: f === "followers" ? Number(v) || 0 : v } });

  const save = () => {
    setState({ kind: "saving" });
    startTransition(async () => {
      const res = await saveSettings(site);
      if (!res.ok) return setState({ kind: "error", message: res.error });
      setSaved(site);
      setState({ kind: "saved" });
      router.refresh();
    });
  };
  useEditorGuards(dirty, save);

  return (
    <div className="ad-editor">
      <div className="ad-head">
        <h1>Settings</h1>
      </div>

      <div className="ad-stack ad-settings">
        <Section title="Intro" hint="The big name and line at the top of the home page.">
          <div className="ad-two">
            <Field label="First name">
              <input {...text("first")} />
            </Field>
            <Field label="Last name">
              <input {...text("last")} />
            </Field>
          </div>
          <Field label="Kicker" hint="Small line above your name.">
            <input {...text("kicker")} />
          </Field>
          <Field label="Intro line" hint={<>Wrap words in &lt;strong&gt;…&lt;/strong&gt; to make them bold.</>}>
            <textarea rows={3} {...text("lede")} />
          </Field>
          <div className="ad-two">
            <Field label="Location">
              <input {...text("location")} />
            </Field>
            <Field label="Email">
              <input type="email" {...text("email")} />
            </Field>
          </div>
          <Field label="Portrait">
            <ImageField value={site.portrait} folder="site" onChange={(v) => set("portrait", v)} />
          </Field>
        </Section>

        <Section title="Links & resume">
          <Field label="LinkedIn URL">
            <input type="url" {...text("linkedin")} />
          </Field>
          <Field label="Resume PDF" hint="Upload a new PDF to replace the download on /about.">
            <ImageField value={site.resumePdf} folder="resume" accept="application/pdf" isImage={false} onChange={(v) => set("resumePdf", v)} />
          </Field>
          <div className="ad-two">
            <Field label="GitHub username" hint="Repos on /work come from here.">
              <input value={site.github.user} onChange={(e) => set("github", { ...site.github, user: e.target.value })} />
            </Field>
            <Field label="Repos to show">
              <input type="number" min={0} max={30} value={site.github.count} onChange={(e) => set("github", { ...site.github, count: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Site address" hint="Used for share previews.">
            <input type="url" {...text("url")} />
          </Field>
        </Section>

        <Section title="Socials" hint="Follower totals on the site add up from these.">
          {(["tiktok", "instagram"] as const).map((k) => (
            <div className="ad-three" key={k}>
              <Field label={`${site.socials[k].label} handle`}>
                <input value={site.socials[k].handle} onChange={(e) => social(k, "handle", e.target.value)} />
              </Field>
              <Field label="Profile URL">
                <input type="url" value={site.socials[k].url} onChange={(e) => social(k, "url", e.target.value)} />
              </Field>
              <Field label="Followers">
                <input type="number" min={0} value={site.socials[k].followers} onChange={(e) => social(k, "followers", e.target.value)} />
              </Field>
            </div>
          ))}
        </Section>

        <Section title="Top videos" hint="Best first. Paste a TikTok video link or an Instagram post/reel link. Views are optional, e.g. 12.4K.">
          <ListEditor
            rows={site.topVideos}
            onChange={(r) => set("topVideos", r as Site["topVideos"])}
            addLabel="+ Add video"
            cols={[
              { key: "url", label: "Video link", placeholder: "https://www.tiktok.com/@…/video/…" },
              { key: "views", label: "Views", placeholder: "12.4K" },
            ]}
          />
        </Section>

        <Section title="Work with me" hint="The offers on /content.">
          <ListEditor
            rows={site.offers}
            onChange={(r) => set("offers", r as Site["offers"])}
            addLabel="+ Add offer"
            cols={[
              { key: "icon", label: "Icon", kind: "icon" },
              { key: "title", label: "Title" },
              { key: "text", label: "Description", kind: "long" },
            ]}
          />
        </Section>

        <Section title="About: bio" hint="Each entry is a paragraph.">
          <ListEditor
            rows={toRows(site.about.bio)}
            onChange={(r) => set("about", { ...site.about, bio: fromRows(r) })}
            addLabel="+ Add paragraph"
            cols={[{ key: "text", label: "Paragraph", kind: "long" }]}
          />
        </Section>

        <Section title="About: photos">
          <ListEditor
            rows={site.about.photos}
            onChange={(r) => set("about", { ...site.about, photos: r as Site["about"]["photos"] })}
            addLabel="+ Add photo"
            folder="about"
            cols={[
              { key: "caption", label: "Caption" },
              { key: "src", label: "Photo", kind: "image" },
            ]}
          />
        </Section>

        <Section title="About: quick facts">
          <ListEditor
            rows={site.about.facts}
            onChange={(r) => set("about", { ...site.about, facts: r as Site["about"]["facts"] })}
            addLabel="+ Add fact"
            cols={[
              { key: "icon", label: "Icon", kind: "icon" },
              { key: "text", label: "Text" },
            ]}
          />
        </Section>

        <Section title="Resume: experience">
          <ListEditor
            rows={site.jobs as Row[]}
            onChange={(r) => set("jobs", r as Site["jobs"])}
            addLabel="+ Add job"
            folder="logos"
            cols={[
              { key: "org", label: "Company" },
              { key: "role", label: "Role" },
              { key: "when", label: "When", placeholder: "2025 – now" },
              { key: "text", label: "What you did", kind: "long" },
              { key: "logo", label: "Logo (optional)", kind: "image" },
            ]}
          />
        </Section>

        <Section title="Resume: skills">
          <ListEditor
            rows={site.skills}
            onChange={(r) => set("skills", r as Site["skills"])}
            addLabel="+ Add skill group"
            cols={[
              { key: "group", label: "Group" },
              { key: "items", label: "Skills", placeholder: "TypeScript, C#, SQL" },
            ]}
          />
        </Section>

        <Section title="Resume: education">
          <ListEditor
            rows={site.education}
            onChange={(r) => set("education", r as Site["education"])}
            addLabel="+ Add school"
            cols={[
              { key: "org", label: "School" },
              { key: "role", label: "Program" },
              { key: "when", label: "When" },
              { key: "text", label: "Notes", kind: "long" },
            ]}
          />
        </Section>
      </div>

      <SaveBar state={state} dirty={dirty} onSave={save} saveLabel="Save settings" />
    </div>
  );
}
