import type { Post } from "./types";

export const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello, world",
    excerpt: "A first post — what this site is and why I made it.",
    body:
      "I've been wanting a single place to put projects, writing, and notes. This is it. The design is inspired by Spotify because most portfolios feel like a resume — I wanted something that felt more like a place I'd actually open.",
    publishedAt: "2026-05-26",
    tags: ["meta"],
  },
  {
    slug: "on-side-projects",
    title: "On side projects",
    excerpt: "Why I keep starting them and what I've learned from finishing a few.",
    body:
      "The point of a side project isn't to ship — it's to learn the shape of a problem. Finishing matters, but only because finishing is what teaches you the part you would have skipped.",
    publishedAt: "2026-04-12",
    tags: ["writing", "process"],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
