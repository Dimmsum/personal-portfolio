export type ProjectStatus = "in-progress" | "completed" | "archived";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  tags: string[];
  description: string;
  links?: { label: string; href: string }[];
  cover?: string;
  featured?: boolean;
  startedAt: string;
  updatedAt: string;
};

export type Company = {
  name: string;
  href?: string;
  logo?: string;
  current?: boolean;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  tags: string[];
};

export type ActivityItem =
  | { kind: "project-update"; at: string; project: Project; note: string }
  | { kind: "post"; at: string; post: Post }
  | { kind: "note"; at: string; id: string; body: string };

export type GitHubEventType = "push" | "pr" | "create" | "star";

export type GitHubEvent = {
  id: string;
  type: GitHubEventType;
  repo: string;
  summary: string;
  url: string;
  at: string;
};

export type Track = {
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  playedAt: string;
  url: string;
};

export type ConsumingItem = {
  kind: "book" | "film" | "show";
  title: string;
  creator: string;
  cover?: string;
  note?: string;
};

export type Profile = {
  name: string;
  displayName?: string;
  role: string;
  bio: string;
  avatar: string;
  location?: string;
  contact: { label: string; href: string }[];
  now: string[];
  companies?: Company[];
  twitterHref?: string;
};
