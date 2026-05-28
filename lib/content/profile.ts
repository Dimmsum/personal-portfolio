import type { Profile } from "./types";

export const profile: Profile = {
  name: "dim",
  displayName: "Dimetri Lee",
  role: "Software Engineer",
  bio: "I have worked on APIs, Full-Stack Applications, Bots & other tools which are used to solve real-world problems and improve effeciency. Though everything is now about shipping fast and utilizing AI to be effecient, I do not neglect learning tools, fundamentals and best practices. Currently working on a university student exclusive platform to buy, sell & earn money through tasks.",
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
