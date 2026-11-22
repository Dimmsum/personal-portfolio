"use client";
/* eslint-disable @next/next/no-img-element */
import { marked } from "marked";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { uploadMedia } from "@/lib/supabase/browser";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function Field({ label, hint, children, wide }: { label: string; hint?: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`ad-field${wide ? " wide" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="ad-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

/* ---------------------------------------------------------------- uploads */

function useUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      return await uploadMedia(file, folder);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      return null;
    } finally {
      setBusy(false);
    }
  };
  return { upload, busy, error };
}

function UploadButton({ onFile, busy, accept = "image/*", label = "Upload" }: { onFile: (f: File) => void; busy: boolean; accept?: string; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className="ad-btn" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? "Uploading…" : label}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
    </>
  );
}

/* One image (or file) URL: upload, paste a link, or clear. */
export function ImageField({
  value,
  onChange,
  folder,
  accept = "image/*",
  isImage = true,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
  accept?: string;
  isImage?: boolean;
}) {
  const { upload, busy, error } = useUpload(folder);
  return (
    <div className="ad-image">
      {isImage && <div className="ad-thumb">{value ? <img src={value} alt="" /> : <span>No image</span>}</div>}
      <div className="ad-image-ctl">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={isImage ? "Upload, or paste an image URL" : "Upload, or paste a URL"} />
        <div className="ad-row">
          <UploadButton busy={busy} accept={accept} onFile={async (f) => {
            const url = await upload(f);
            if (url) onChange(url);
          }} />
          {value && (
            <button type="button" className="ad-btn quiet" onClick={() => onChange("")}>
              Remove
            </button>
          )}
          {!isImage && value && (
            <a className="ad-link" href={value} target="_blank" rel="noreferrer">
              Open ↗
            </a>
          )}
        </div>
        {error && <p className="ad-error">{error}</p>}
      </div>
    </div>
  );
}

/* Several images, in order. The first is the cover. */
export function ImageList({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const { upload, busy, error } = useUpload(folder);
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="ad-stack">
      {value.length > 0 && (
        <ul className="ad-gallery">
          {value.map((src, i) => (
            <li key={src + i}>
              <img src={src} alt="" />
              {i === 0 && <em>Cover</em>}
              <div className="ad-row">
                <button type="button" className="ad-btn quiet" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move earlier">
                  ←
                </button>
                <button type="button" className="ad-btn quiet" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move later">
                  →
                </button>
                <button type="button" className="ad-btn quiet" onClick={() => onChange(value.filter((_, k) => k !== i))}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="ad-row">
        <UploadButton busy={busy} label="+ Add image" onFile={async (f) => {
          const url = await upload(f);
          if (url) onChange([...value, url]);
        }} />
        <button
          type="button"
          className="ad-btn quiet"
          onClick={() => {
            const url = prompt("Image URL");
            if (url?.trim()) onChange([...value, url.trim()]);
          }}
        >
          Add by URL
        </button>
      </div>
      {error && <p className="ad-error">{error}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- markdown */

const tools: { label: string; title: string; wrap: [string, string]; block?: boolean }[] = [
  { label: "B", title: "Bold", wrap: ["**", "**"] },
  { label: "I", title: "Italic", wrap: ["_", "_"] },
  { label: "H2", title: "Heading", wrap: ["## ", ""], block: true },
  { label: "H3", title: "Small heading", wrap: ["### ", ""], block: true },
  { label: "•", title: "Bullet list", wrap: ["- ", ""], block: true },
  { label: "❝", title: "Quote", wrap: ["> ", ""], block: true },
  { label: "</>", title: "Code", wrap: ["`", "`"] },
  { label: "Link", title: "Link", wrap: ["[", "](https://)"] },
];

export function MarkdownField({ value, onChange, folder, rows = 22 }: { value: string; onChange: (v: string) => void; folder: string; rows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const { upload, busy, error } = useUpload(folder);

  const insert = (before: string, after = "", block = false) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const pre = value.slice(0, a);
    const lead = block && pre && !pre.endsWith("\n") ? "\n" : "";
    const sel = value.slice(a, b);
    const next = pre + lead + before + sel + after + value.slice(b);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = a + lead.length + before.length;
      el.setSelectionRange(pos, pos + sel.length);
    });
  };

  const addImage = async (f: File) => {
    const url = await upload(f);
    if (url) insert(`\n![${f.name.replace(/\.[^.]+$/, "")}](${url})\n`);
  };

  return (
    <div className="ad-md">
      <div className="ad-md-bar">
        <div className="ad-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>
            Write
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>
            Preview
          </button>
        </div>
        {tab === "write" && (
          <div className="ad-tools">
            {tools.map((t) => (
              <button key={t.title} type="button" title={t.title} aria-label={t.title} onClick={() => insert(t.wrap[0], t.wrap[1], t.block)}>
                {t.label}
              </button>
            ))}
            <UploadButton busy={busy} label="Image" onFile={addImage} />
          </div>
        )}
      </div>
      {tab === "write" ? (
        <textarea
          ref={ref}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            const f = [...e.clipboardData.files].find((x) => x.type.startsWith("image/"));
            if (f) {
              e.preventDefault();
              addImage(f);
            }
          }}
          onDrop={(e) => {
            const f = [...e.dataTransfer.files].find((x) => x.type.startsWith("image/"));
            if (f) {
              e.preventDefault();
              addImage(f);
            }
          }}
          placeholder="Write in Markdown. Paste or drop an image to upload it."
        />
      ) : (
        <div className="ad-preview md" dangerouslySetInnerHTML={{ __html: value.trim() ? (marked.parse(value) as string) : "<p><em>Nothing to preview yet.</em></p>" }} />
      )}
      {error && <p className="ad-error">{error}</p>}
      <small className="ad-muted">
        Markdown: **bold**, _italic_, ## heading, - list, [link](url). Paste or drag an image in to upload it.
      </small>
    </div>
  );
}

/* ---------------------------------------------------------------- saving */

export type SaveState = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

/* Warns before leaving with unsaved changes, and saves on Cmd/Ctrl+S. */
export function useEditorGuards(dirty: boolean, save: () => void) {
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

export function SaveBar({
  state,
  dirty,
  onSave,
  saveLabel = "Save",
  onDelete,
  extra,
  savedText = "Saved. It's live.",
}: {
  savedText?: string;
  state: SaveState;
  dirty: boolean;
  onSave: () => void;
  saveLabel?: string;
  onDelete?: () => void;
  extra?: ReactNode;
}) {
  const [confirming, setConfirming] = useState(false);
  const status =
    state.kind === "saving"
      ? "Saving…"
      : state.kind === "error"
        ? state.message
        : dirty
          ? "Unsaved changes"
          : state.kind === "saved"
            ? savedText
            : "";
  return (
    <div className="ad-savebar">
      <span className={`ad-status ${state.kind === "error" ? "bad" : dirty ? "warn" : ""}`} role="status">
        {status}
      </span>
      {extra}
      {onDelete &&
        (confirming ? (
          <>
            <button type="button" className="ad-btn danger" onClick={onDelete}>
              Yes, delete
            </button>
            <button type="button" className="ad-btn quiet" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="ad-btn quiet" onClick={() => setConfirming(true)}>
            Delete
          </button>
        ))}
      <button type="button" className="btn" onClick={onSave} disabled={state.kind === "saving"}>
        {saveLabel}
      </button>
    </div>
  );
}
