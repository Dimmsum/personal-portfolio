/* ==========================================================================
   SITE SETTINGS
   Everything on the site that isn't a project or a blog post lives here.
   Projects:   content/projects/*.md   (one file per project)
   Blog posts: content/posts/*.md      (one file per post)
   Images:     public/images/...       (reference them as "/images/...")
   ========================================================================== */

export const site = {
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

  statsNote: "Sample numbers. Update them in content/site.ts.",
  stats: [
    { icon: "users", value: "18.2K", label: "Followers" },
    { icon: "eye", value: "1.4M", label: "Total views" },
    { icon: "heart", value: "6.8%", label: "Avg. engagement" },
    { icon: "code", value: "12", label: "Projects shipped" },
  ],

  // thumb: a screenshot of the video cover, e.g. "/images/posts/tiktok-1.jpg"
  socials: {
    tiktok: {
      label: "TikTok",
      handle: "@dimetri.lee",
      url: "https://www.tiktok.com/@dimetri.lee",
      followers: "10.3K",
      posts: [
        { title: "POV: CS student with a full-time job", views: "412K", url: "https://www.tiktok.com/@dimetri.lee", thumb: "" },
        { title: "3 projects that got me interviews", views: "156K", url: "https://www.tiktok.com/@dimetri.lee", thumb: "" },
        { title: "What a software engineer actually does", views: "97K", url: "https://www.tiktok.com/@dimetri.lee", thumb: "" },
      ],
    },
    instagram: {
      label: "Instagram",
      handle: "@dimetri.al",
      url: "https://www.instagram.com/dimetri.al",
      followers: "7.9K",
      posts: [
        { title: "Day in the life: work + uni", views: "84K", url: "https://www.instagram.com/dimetri.al", thumb: "" },
        { title: "My desk setup tour", views: "31K", url: "https://www.instagram.com/dimetri.al", thumb: "" },
        { title: "Kingston food run after the gym", views: "22K", url: "https://www.instagram.com/dimetri.al", thumb: "" },
      ],
    },
  },

  offers: [
    { icon: "play", title: "Sponsored videos", text: "Tech, study and lifestyle products on TikTok and Instagram." },
    { icon: "code", title: "App and web builds", text: "Mobile apps, websites and backends for businesses." },
    { icon: "users", title: "Workshops and talks", text: "AI and software careers for students and schools." },
    { icon: "pen", title: "Tutorials", text: "Walkthroughs of dev tools and platforms." },
  ],

  about: {
    photos: [
      { src: "/images/about/dimetri-sagicor.jpg", caption: "At work" },
      { src: "", caption: "Gym" },
      { src: "", caption: "Trips" },
    ],
    bio: [
      "I'm Dimetri, a 21-year-old software engineer working full time while finishing university.",
      "I got my first internship in second year and haven't stopped building since. Today I work at Intellibus and the Sagicor Innovation Lab, and run my own client projects on the side.",
      "Online I share software engineering for CS students, plus the rest of my life: school, the gym, food and trips.",
    ],
    facts: [
      { icon: "pin", text: "Kingston, Jamaica" },
      { icon: "brief", text: "Intellibus & Sagicor Innovation Lab" },
      { icon: "cap", text: "University student" },
      { icon: "dumb", text: "Gym most days" },
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

export type Site = typeof site;
export type SocialKey = keyof typeof site.socials;

/* Icons shown in the hero and footer */
export const socialLinks = [
  { icon: "tiktok", href: site.socials.tiktok.url, label: "TikTok" },
  { icon: "instagram", href: site.socials.instagram.url, label: "Instagram" },
  { icon: "github", href: `https://github.com/${site.github.user}`, label: "GitHub" },
  { icon: "linkedin", href: site.linkedin, label: "LinkedIn" },
];
