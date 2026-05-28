import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "personal-portfolio",
    name: "Personal Portfolio",
    tagline: "This site — a Spotify-inspired portfolio.",
    status: "in-progress",
    tags: ["next.js", "tailwind", "design"],
    description:
      "A three-column, Spotify-inspired portfolio built with Next.js 16 and Tailwind v4. Projects on the left, content in the middle, about-me on the right. Sidebars collapse into rails.",
    links: [
      { label: "Source", href: "https://github.com/" },
    ],
    startedAt: "2026-05-20",
    updatedAt: "2026-05-26",
  },
  {
    slug: "heart-of-love",
    name: "Heart of Love",
    tagline: "An interactive web experiment.",
    status: "in-progress",
    tags: ["webgl", "experiment"],
    description:
      "Exploring how interaction design can make a single web page feel like a place rather than a document.",
    startedAt: "2026-04-02",
    updatedAt: "2026-05-10",
  },
  {
    slug: "yesterday-evening",
    name: "Yesterday Evening",
    tagline: "A photo journal with a soft, ambient UI.",
    status: "completed",
    tags: ["next.js", "photography"],
    description:
      "Personal photo journal. Each post is a single image with a short paragraph — minimal chrome, focus on the photograph.",
    startedAt: "2025-11-01",
    updatedAt: "2026-01-18",
  },
  {
    slug: "composure",
    name: "Composure",
    tagline: "A practice timer for musicians.",
    status: "archived",
    tags: ["music", "side-project"],
    description:
      "A practice timer that asks you what you worked on after each session and builds a quiet log over time.",
    startedAt: "2024-08-15",
    updatedAt: "2025-03-04",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
