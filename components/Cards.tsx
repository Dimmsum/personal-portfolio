import Link from "next/link";
import type { Post, Project } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Cover } from "./Cover";
import { Icon } from "./Icon";
import { GenCover, Lines, hash } from "./Lines";

export type ProjectSummary = Omit<Project, "html">;
export type PostSummary = Omit<Post, "html">;

export function ProjectCard({ p, feature }: { p: ProjectSummary; feature?: boolean }) {
  return (
    <Link className={`proj${feature ? " feature" : ""}`} href={`/work/${p.slug}`}>
      <div className="cover">
        <Cover src={p.images[0]} alt={p.title} fallback={<GenCover label={p.title} seed={hash(p.title)} />} />
      </div>
      <div>
        <div className="meta">
          <span>
            {p.type} · {p.year}
          </span>
          {p.status && <span className="status">{p.status}</span>}
        </div>
        <h3>
          {p.title}
          <Icon name="arrow" />
        </h3>
        <p>{p.blurb}</p>
        <div className="tags">
          {p.tags.map((t, i) => (
            <span key={t}>
              {i > 0 && <span aria-hidden="true">/ </span>}
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="projects">
      {projects.map((p, k) => (
        <ProjectCard key={p.slug} p={p} feature={k === 0 && projects.length > 2} />
      ))}
    </div>
  );
}

export function PostEntry({ p }: { p: PostSummary }) {
  return (
    <Link className="entry" href={`/blog/${p.slug}`}>
      <time dateTime={p.date}>{formatDate(p.date)}</time>
      <div>
        <b>{p.title}</b>
        <p>{p.excerpt}</p>
      </div>
      <span className="rt">
        <em>{p.tag}</em>
        {p.minutes} min
      </span>
    </Link>
  );
}

type SocialPost = { title: string; views: string; url: string; thumb: string };

export function PostTile({ x, platform }: { x: SocialPost; platform?: string }) {
  return (
    <a className="post" href={x.url} target="_blank" rel="noopener noreferrer">
      <Cover
        src={x.thumb}
        alt={x.title}
        fallback={
          <div className="pg">
            <Lines seed={hash(x.title)} />
          </div>
        }
      />
      <div className="shade" />
      <span className="src">{platform ? <Icon name={platform} /> : <Icon name="play" className="fill" />}</span>
      <span className="pt">
        <b>{x.title}</b>
        <span>
          <Icon name="eye" />
          {x.views}
        </span>
      </span>
    </a>
  );
}

