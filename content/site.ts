/* ==========================================================================
   SITE SETTINGS: DEFAULTS
   Once Supabase is set up you edit all of this at /admin/settings, and what you
   save there wins. These values are used for anything you haven't saved yet,
   and for the whole site when Supabase isn't configured.
   ========================================================================== */

export const defaultSite = {
  url: "https://dimetrilee.com",
  first: "Dimetri",
  last: "Lee",
  kicker: "Software engineer & content creator",
  // <strong> marks the words shown in bold
  lede: "I build <strong>mobile apps, backends and AI tools</strong> from Kingston, Jamaica, and make videos about working in tech while still in university.",
  location: "Kingston, Jamaica",
  email: "dimetri.a.lee@gmail.com",
  portrait: "/images/about/dimetri-sagicor.jpg",
  resumePdf: "/resume.pdf", // drop your resume at public/resume.pdf
  linkedin: "https://linkedin.com/in/dimetri-lee",

  github: {
    user: "Dimmsum",
    count: 6,
    // shown if the GitHub API can't be reached
    fallback: [
      { name: "tabi", description: "Map-based social meetup app", language: "TypeScript", stars: 0, url: "" },
      { name: "rootyou", description: "Desktop AI buddy for macOS", language: "TypeScript", stars: 0, url: "" },
      { name: "campus-cart", description: "Campus errands app prototype", language: "TypeScript", stars: 0, url: "" },
    ],
  },

  socials: {
    tiktok: { label: "TikTok", handle: "@dimetri.lee", url: "https://www.tiktok.com/@dimetri.lee", followers: 824 },
    instagram: { label: "Instagram", handle: "@dimetri.al", url: "https://www.instagram.com/dimetri.al", followers: 19 },
  },

  // Best videos first. Paste a TikTok video link or an Instagram post/reel link.
  // views is optional, e.g. "12.4K". Leave "" to hide it.
  topVideos: [
    { url: "https://www.tiktok.com/@dimetri.lee/video/7576888728778575112", views: "" },
    { url: "https://www.tiktok.com/@dimetri.lee/video/7692257015552494868", views: "" },
  ],

  offers: [
    { icon: "play", title: "Sponsored videos", text: "Tech, study and lifestyle products on TikTok and Instagram." },
    { icon: "code", title: "App and web builds", text: "Mobile apps, websites and backends for businesses." },
    { icon: "users", title: "Workshops and talks", text: "AI and software careers for students and schools." },
    { icon: "pen", title: "Tutorials", text: "Walkthroughs of dev tools and platforms." },
  ],

  about: {
    photos: [
      { src: "/images/about/dimetri-sagicor.jpg", caption: "At work" },
    ],
    bio: [
      "I'm Dimetri, a 21-year-old software engineer working full time while finishing university.",
      "I got my first internship in second year and haven't stopped building since. Today I work at Intellibus and the Sagicor Innovation Lab, and run my own client projects on the side.",
      "Online I share software engineering for CS students, plus what uni life looks like alongside a full-time job.",
    ],
    facts: [
      { icon: "pin", text: "Kingston, Jamaica" },
      { icon: "brief", text: "Intellibus & Sagicor Innovation Lab" },
      { icon: "cap", text: "University student" },
    ],
  },

  jobs: [
    { org: "Intellibus", logo: "/images/logos/intellibus.png", role: "Software Engineer", when: "Current", text: "Chatbots on the Atlas Bot SDK, including consultant onboarding and a patient-facing health bot. Ran the 'Building Your Future with AI' workshop for CANTO Women in ICT." },
    { org: "Sagicor Innovation Lab", logo: "/images/logos/sagicor.png", role: "Developer", when: "Current", text: "Backend and DevOps for Root IQ: .NET API, Docker and multi-environment CI/CD on AWS." },
    { org: "Freelance", role: "Developer & designer", when: "Current", text: "Websites, design systems and apps for Jamaican businesses." },
    { org: "CAPE Computer Science", role: "Tutor", when: "Current", text: "Teaching Unit 1 and Unit 2." },
  ],
  skills: [
    { group: "Languages", items: "TypeScript, JavaScript, C#, Swift, C++, SQL" },
    { group: "Backend & cloud", items: ".NET, Node.js, Supabase, Docker, AWS EC2, GitHub Actions" },
    { group: "Apps", items: "iOS, Tauri, React, Next.js" },
    { group: "AI", items: "Claude API, MCP, chatbots" },
    { group: "Design", items: "Figma, design systems" },
  ],
  education: [{ org: "University of Technology, Jamaica", role: "Computing degree", when: "In progress", text: "" }],
};

export type Site = typeof defaultSite;
export type SocialKey = keyof Site["socials"];

/* 843 -> "843", 12400 -> "12.4K", 1200000 -> "1.2M" */
export function formatCount(n: number) {
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e4) return `${+(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export const totalFollowers = (site: Site) => Object.values(site.socials).reduce((a, s) => a + (Number(s.followers) || 0), 0);

/* Totals are worked out from the follower counts. */
export const statsFor = (site: Site) => [
  { icon: "users", value: formatCount(totalFollowers(site)), label: "Followers across platforms" },
  { icon: "tiktok", value: formatCount(site.socials.tiktok.followers), label: "TikTok followers" },
  { icon: "instagram", value: formatCount(site.socials.instagram.followers), label: "Instagram followers" },
];

/* Icons shown in the hero and footer */
export const socialLinksFor = (site: Site) => [
  { icon: "tiktok", href: site.socials.tiktok.url, label: "TikTok" },
  { icon: "instagram", href: site.socials.instagram.url, label: "Instagram" },
  { icon: "github", href: `https://github.com/${site.github.user}`, label: "GitHub" },
  { icon: "linkedin", href: site.linkedin, label: "LinkedIn" },
];
