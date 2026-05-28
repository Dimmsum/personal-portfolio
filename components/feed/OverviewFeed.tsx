import Image from "next/image";
import Link from "next/link";
import { getGitHubEvents } from "@/lib/content/github";
import { posts } from "@/lib/content/posts";
import { profile } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";
import type { GitHubEvent, Post, Project, Company } from "@/lib/content/types";

// ─── Main component ───────────────────────────────────────────────────────────

const SPOTIFY_PLAYLIST_ID = "0tLjhJRpvDRdUYxTvBGOK7";
const SPOTIFY_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;

async function getSpotifyPlaylist(): Promise<{
  title: string;
  thumbnail: string;
} | null> {
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(SPOTIFY_URL)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      title?: string;
      thumbnail_url?: string;
    };
    return {
      title: data.title ?? "Playlist",
      thumbnail: data.thumbnail_url ?? "",
    };
  } catch {
    return null;
  }
}

export async function OverviewFeed() {
  const [events, spotifyPlaylist] = await Promise.all([
    getGitHubEvents(5),
    getSpotifyPlaylist(),
  ]);
  const recentPosts = [...posts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 4);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const fallbackProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 2);

  return (
    <div className="px-6 pt-6 pb-16">
      <div className="flex flex-col gap-12">
        <HeroSection />
        <FeaturedProjectsSection projects={fallbackProjects} />
        <ActivityRow
          events={events}
          posts={recentPosts}
          spotify={spotifyPlaylist}
        />
        <LetsConnectSection />
      </div>
      <Footer />
    </div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const displayName = profile.displayName ?? profile.name;
  const githubHref =
    profile.contact.find((c) => c.label === "GitHub")?.href ?? "#";
  const linkedinHref =
    profile.contact.find((c) => c.label === "LinkedIn")?.href ?? "#";
  const instagramHref = profile.instagramHref ?? "#";

  return (
    <section className="flex flex-col gap-6">
      <div
        className="grid items-stretch gap-8"
        style={{ gridTemplateColumns: "3fr 2fr" }}
      >
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Hey! I&apos;m{" "}
              <span style={{ color: "var(--accent)" }}>{displayName}</span>
            </h1>
            <p className="text-sm font-medium tracking-wide">
              <span style={{ color: "#ffffff" }}>
                API Team Lead @ Sagicor Innovation Lab
              </span>{" "}
              <span style={{ color: "#ffffff" }}>|</span>{" "}
              <span style={{ color: "#ffffff" }}>Intern @ Intellibus</span>
            </p>
          </div>
          <p className="text-base leading-7 text-[var(--text-muted)] text-justify">
            {highlightBio(profile.bio, [
              "API Team Lead @ Sagicor Innovation Lab",
              "Intern @ Intellibus",
              "|",
            ])}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <GitHubIcon />
              <span>GitHub</span>
            </a>
            <Divider />
            <a
              href={linkedinHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <Divider />
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <InstagramIcon />
            </a>
            <Divider />
            <Link
              href="/about"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              More about me →
            </Link>
          </div>

          {profile.companies && profile.companies.length > 0 && (
            <CompanyRow companies={profile.companies} />
          )}
        </div>

        {/* ── Right column: photo ── */}
        <div className="hidden sm:block p-2">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src="/picture-1.png"
              alt="Dimetri Lee"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return <span className="text-[var(--border-subtle)] select-none">|</span>;
}

function CompanyRow({ companies }: { companies: Company[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
      {companies.map((co, i) => (
        <div key={co.name} className="flex items-center gap-3">
          {i > 0 && (
            <span className="text-[var(--text-dim)] text-sm select-none">
              /
            </span>
          )}
          <a
            href={co.href ?? "#"}
            target={co.href && co.href !== "#" ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center gap-2 group"
          >
            {co.logo ? (
              <Image
                src={co.logo}
                alt={co.name}
                width={36}
                height={36}
                style={{ height: 32, width: "auto" }}
                className="select-none"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-highlight)] text-[10px] font-bold text-[var(--text-primary)] shadow-[0_1px_6px_rgba(0,0,0,0.4)] select-none">
                {co.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {co.name}
            </span>
            {!co.current && (
              <span className="text-xs text-[var(--text-dim)]">(Past)</span>
            )}
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── Featured projects ────────────────────────────────────────────────────────

function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <StarIcon />
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <FeaturedProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  const slug = project.slug.replace(/-/g, "_");
  return (
    <Link href={`/projects/${project.slug}`}>
      <article className="group overflow-hidden rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 bg-[var(--bg-card)]">
        {/* ── Title bar ── */}
        <div className="flex items-center px-4 py-3 bg-[var(--bg-elevated)]">
          <div className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: "#ff5f57" }}
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: "#febc2e" }}
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: "#28c840" }}
            />
          </div>
          <span
            className="flex-1 text-center text-xs font-medium text-[var(--text-dim)]"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {slug}.sh
          </span>
        </div>

        {/* ── Terminal body ── */}
        <div
          className="px-4 py-4 text-xs leading-6 select-none"
          style={{
            fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
            minHeight: "9rem",
          }}
        >
          <p>
            <span style={{ color: "#28c840" }}>➜</span>
            <span style={{ color: "#58a6ff" }}> ~/projects</span>
            <span className="text-[var(--text-primary)]"> cat README.md</span>
          </p>
          <p className="mt-1">
            <span style={{ color: "#febc2e" }}># </span>
            <span className="text-[var(--text-primary)]">{project.name}</span>
          </p>
          <p className="text-[var(--text-muted)]">{project.tagline}</p>
          <p className="mt-2">
            <span className="text-[var(--text-dim)]">status </span>
            <span
              style={{
                color:
                  project.status === "in-progress"
                    ? "#28c840"
                    : project.status === "completed"
                      ? "#58a6ff"
                      : "var(--text-dim)",
              }}
            >
              {project.status}
            </span>
          </p>
          <p>
            <span className="text-[var(--text-dim)]">stack </span>
            <span className="text-[var(--text-muted)]">
              {project.tags.join(", ")}
            </span>
          </p>
          <p className="mt-2">
            <span style={{ color: "#28c840" }}>➜</span>
            <span style={{ color: "#58a6ff" }}> ~/projects</span>
            <span
              className="inline-block w-2 h-4 ml-1 align-middle animate-pulse bg-[var(--text-primary)]"
              style={{ opacity: 0.8 }}
            />
          </p>
        </div>
      </article>
    </Link>
  );
}

// ─── Activity row (commits + posts) ──────────────────────────────────────────

function ActivityRow({
  events,
  posts,
  spotify,
}: {
  events: GitHubEvent[];
  posts: Post[];
  spotify: { title: string; thumbnail: string } | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[2fr_1fr_1fr]">
      <RecentCommitsCard events={events} />
      <LatestPostsCard posts={posts} />
      <SpotifyCard playlist={spotify} />
    </div>
  );
}

function SpotifyCard({
  playlist,
}: {
  playlist: { title: string; thumbnail: string } | null;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <SpotifyIcon />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Favorite Playlist
          </span>
        </div>
      </div>

      {/* Cover art */}
      <div className="relative w-full aspect-square bg-[var(--bg-highlight)]">
        {playlist?.thumbnail ? (
          <Image
            src={playlist.thumbnail}
            alt={playlist.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <SpotifyIcon size={40} />
          </div>
        )}
      </div>

      {/* Name + link */}
      <div className="flex flex-col gap-2 px-4 py-3 mt-auto">
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {playlist?.title ?? "My Playlist"}
        </p>
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1db954] hover:underline underline-offset-4 w-fit"
        >
          <SpotifyIcon size={12} />
          Open in Spotify
        </a>
      </div>
    </div>
  );
}

function RecentCommitsCard({ events }: { events: GitHubEvent[] }) {
  const langBar = [
    { color: "#38bdf8", pct: 32 },
    { color: "#3178c6", pct: 22 },
    { color: "#5fa04e", pct: 18 },
    { color: "#f59e0b", pct: 12 },
    { color: "#a855f7", pct: 9 },
    { color: "#ef4444", pct: 7 },
  ];
  return (
    <div className="flex flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <CommitIcon />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Recent Commits
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-dim)] bg-[var(--bg-highlight)] rounded px-1.5 py-0.5">
          info
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {events.length === 0 ? (
          <li className="px-4 py-3 text-sm text-[var(--text-dim)]">
            No recent activity.
          </li>
        ) : (
          events.map((ev) => <CommitRow key={ev.id} event={ev} />)
        )}
      </ul>
      <div className="mt-auto px-4 py-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
        <a
          href="https://github.com/Dimmsum"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-[var(--accent)] hover:underline underline-offset-4 w-fit flex items-center gap-1"
        >
          View on GitHub <ExternalLinkIcon />
        </a>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
          {langBar.map((seg) => (
            <div
              key={seg.color}
              style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommitRow({ event }: { event: GitHubEvent }) {
  const repoShort = event.repo.split("/").pop() ?? event.repo;
  const isCommit = event.type === "push";
  const additions = isCommit ? Math.floor(Math.random() * 40) + 1 : null;
  const deletions = isCommit ? Math.floor(Math.random() * 10) : null;

  return (
    <li className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-[var(--bg-highlight)] transition-colors">
      <a
        href={event.url}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 flex-1"
      >
        <div className="truncate text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-primary)]">
            {repoShort}:
          </span>{" "}
          {event.summary}
        </div>
      </a>
      {additions !== null && deletions !== null && (
        <div className="shrink-0 flex items-center gap-1 font-mono text-[11px]">
          <span className="text-green-400">+{additions}</span>
          <span className="text-[var(--text-dim)]">/</span>
          <span className="text-red-400">-{deletions}</span>
        </div>
      )}
    </li>
  );
}

function LatestPostsCard({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <PostsIcon />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Latest Posts
          </span>
        </div>
        <Link
          href="/blog"
          className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
          aria-label="View all posts"
        >
          <ExternalLinkIcon />
        </Link>
      </div>
      <ul className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {posts.length === 0 ? (
          <li className="px-4 py-3 text-sm text-[var(--text-dim)]">
            No posts yet.
          </li>
        ) : (
          posts.map((p) => <PostRow key={p.slug} post={p} />)
        )}
      </ul>
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[var(--bg-highlight)] transition-colors">
      <Link
        href={`/blog/${post.slug}`}
        className="truncate text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors min-w-0"
      >
        {post.title}
      </Link>
      <span className="shrink-0 text-xs text-[var(--text-dim)] font-mono">
        {formatDate(post.publishedAt)}
      </span>
    </li>
  );
}

// ─── Let's connect ────────────────────────────────────────────────────────────

function LetsConnectSection() {
  const email =
    profile.contact.find((c) => c.label === "Email")?.href ??
    "mailto:dimetri.lee.2024@gmail.com";
  return (
    <section className="rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)] overflow-hidden">
      <div
        className="relative flex flex-col items-center gap-4 px-8 py-12 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)",
        }}
      >
        <h2 className="text-2xl font-bold tracking-tight">
          Let&apos;s connect
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-sm leading-6">
          Have a project in mind or just want to say hi? My inbox is always
          open.
        </p>
        <a
          href={email}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all duration-150"
        >
          <MailIcon />
          Send me an email →
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/Dimmsum",
      icon: <GitHubIcon />,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/dimetrilee",
      icon: <LinkedInIcon />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/dimetri.al",
      icon: <InstagramIcon />,
    },
    {
      label: "Email",
      href: "mailto:dimetri.lee.2024@gmail.com",
      icon: <MailIcon />,
    },
  ];
  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] pt-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--text-dim)]">
          © {new Date().getFullYear()} Dimetri Lee
        </p>
        <ul className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={l.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-highlight)] hover:text-[var(--accent)]"
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function highlightBio(text: string, phrases: string[]): React.ReactNode {
  const pattern = new RegExp(
    `(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );
  const parts = text.split(pattern);
  const set = new Set(phrases);
  return parts.map((part, i) => {
    if (!set.has(part)) return part;
    if (part === "|")
      return (
        <span key={i} style={{ color: "#ffffff" }}>
          {part}
        </span>
      );
    return (
      <span key={i} className="font-bold" style={{ color: "var(--accent)" }}>
        {part}
      </span>
    );
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.02 3.24 9.27 7.74 10.77.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.15.68-3.82-1.52-3.82-1.52-.51-1.31-1.26-1.66-1.26-1.66-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .95-.31 3.12 1.16.9-.25 1.87-.38 2.83-.39.96 0 1.93.13 2.83.39 2.17-1.47 3.12-1.16 3.12-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.36.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55 4.5-1.5 7.73-5.75 7.73-10.77C23.33 5.57 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.12 1.39A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.39 2.12.66.66 1.33 1.08 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.39 5.86 5.86 0 0 0 1.39-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.39-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CommitIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function PostsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function SpotifyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#1db954"
      aria-hidden
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.313a.75.75 0 0 1-1.032.244c-2.827-1.728-6.387-2.12-10.578-1.162a.75.75 0 1 1-.334-1.463c4.587-1.047 8.52-.597 11.7 1.349a.75.75 0 0 1 .244 1.032zm1.472-3.27a.937.937 0 0 1-1.288.308c-3.234-1.988-8.164-2.563-11.99-1.403a.937.937 0 1 1-.544-1.793c4.375-1.328 9.813-.685 13.514 1.6a.938.938 0 0 1 .308 1.288zm.126-3.403C15.34 8.39 9.108 8.186 5.705 9.205a1.125 1.125 0 1 1-.652-2.154c3.93-1.19 10.465-.96 14.593 1.617a1.125 1.125 0 0 1-1.532 1.972z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
