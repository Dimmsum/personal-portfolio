# dimetrilee.com

Personal site for Dimetri Lee. Next.js 16 (App Router, TypeScript), plain CSS, Montserrat (self-hosted).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero, stats, featured work, most viewed posts, latest writing |
| `/work` | All projects (filter by type) + live GitHub repos |
| `/work/[slug]` | One project: write-up, stack, links, screenshots |
| `/content` | TikTok + Instagram reach, top posts, "work with me" |
| `/blog`, `/blog/[slug]` | Posts (filter by tag) |
| `/about` | Bio, photos, resume (`/about#resume`) |

## Editing

Everything you'd change lives in `content/` and `public/`.

**Settings** – `content/site.ts`: name, intro, email, socials, bio, jobs, skills.

**Follower counts and top videos** – in `content/site.ts`, update `followers` for each platform (the totals on the site add up on their own), and list your best videos in `topVideos`, best first. Paste a TikTok video link or an Instagram post/reel link and the site embeds the official player. `views` is optional.

**Add a project** – copy `content/projects/_template.md`, rename it (`my-app.md` becomes `/work/my-app`), fill in the top block, write the story underneath in Markdown.

- `images`: the first one is the cover, the rest show on the project page. Put files in `public/images/projects/` and list them as `/images/projects/name.jpg`.
- `featured: true` puts it on the home page (first three by `order`).
- No images yet? A navy cover with the title is drawn for you.

**Add a post** – copy `content/posts/_template.md`, rename it, write. Code blocks, lists, links and images all work.

**Photos** – `public/images/about/` (about page), `public/images/posts/` (video thumbnails), and set `portrait` in `site.ts` for the hero.

**Resume** – drop your PDF at `public/resume.pdf`.

Files starting with `_` are ignored.

## GitHub

`/work` pulls your latest public repos from the GitHub API and refreshes them every hour. If GitHub can't be reached, it shows `github.fallback` from `site.ts`.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). No environment variables needed. Then set `url` in `content/site.ts` to your domain.

## Notes

- Light and dark mode follow the visitor's system setting; the toggle remembers their choice.
- Motion is turned off for visitors who prefer reduced motion.
- Follower counts are set by hand in `site.ts`; pulling them live would need TikTok's Display API and the Instagram API.
