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
    { label: "LinkedIn", href: "https://linkedin.com/in/dimetri-lee" },
  ],
  instagramHref: "https://instagram.com/dimetri.lee",
  now: [
    "Scaffolding this portfolio",
    "Reading: A Pattern Language",
    "Learning: WebGL fundamentals",
  ],
  companies: [
    {
      name: "Sagicor Innovation Lab",
      href: "https://www.linkedin.com/company/utech-ja-innovation-lab/posts/?feedView=all",
      logo: "/sagicor.png",
      current: true,
    },
    {
      name: "Intellibus",
      href: "https://www.intellibus.com",
      logo: "/intellibus.png",
      current: true,
    },
  ],
};
