import type { Profile } from "./types";

export const profile: Profile = {
  name: "dim",
  displayName: "Dimetri Lee",
  role: "Software engineer & designer",
  bio: "I build interfaces and tools that sit at the intersection of design and engineering. I care deeply about the craft — the details that make software feel considered rather than assembled. Currently building products that help people express and share their ideas.",
  avatar: "/avatar.svg",
  location: "Earth",
  contact: [
    { label: "Email", href: "mailto:dimetri.lee.2024@gmail.com" },
    { label: "GitHub", href: "https://github.com/Dimmsum" },
    { label: "LinkedIn", href: "https://linkedin.com/in/dimetrilee" },
  ],
  twitterHref: "https://twitter.com/",
  now: [
    "Scaffolding this portfolio",
    "Reading: A Pattern Language",
    "Learning: WebGL fundamentals",
  ],
  companies: [
    { name: "Current Co.", href: "#", current: true },
    { name: "Past Co. A", href: "#", current: false },
    { name: "Past Co. B", href: "#", current: false },
  ],
};
