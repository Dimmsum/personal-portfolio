"use client";
import { useState } from "react";
import { PostEntry, ProjectGrid, type PostSummary, type ProjectSummary } from "./Cards";

function FilterRow({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} aria-pressed={o === value} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function WorkBrowser({ projects }: { projects: ProjectSummary[] }) {
  const [type, setType] = useState("All");
  const types = ["All", ...new Set(projects.map((p) => p.type))];
  const list = projects.filter((p) => type === "All" || p.type === type);
  return (
    <>
      <FilterRow options={types} value={type} onChange={setType} label="Filter projects" />
      <ProjectGrid projects={list} />
    </>
  );
}

export function BlogBrowser({ posts }: { posts: PostSummary[] }) {
  const [tag, setTag] = useState("All");
  const tags = ["All", ...new Set(posts.map((p) => p.tag))];
  const list = posts.filter((p) => tag === "All" || p.tag === tag);
  return (
    <>
      <FilterRow options={tags} value={tag} onChange={setTag} label="Filter posts" />
      <div className="postlist">
        {list.map((p) => (
          <PostEntry key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
