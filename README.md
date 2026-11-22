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
| `/admin` | Sign in and edit posts, projects and settings |

## Editing (no code needed)

Go to **`/admin`**, sign in, and edit everything from there:

- **Blog**: write, edit, delete. Posts start as drafts; flip *Published* when ready. Markdown editor with a preview tab; paste or drag an image in to upload it. `Cmd/Ctrl+S` saves.
- **Projects**: same idea, plus an image gallery (first image is the cover), *Feature on home page*, and an order number.
- **Settings**: intro, portrait, socials and follower counts, top videos, offers, bio, photos, jobs, skills, education, resume PDF.

Saving updates the live site straight away. No redeploy.

### One-time setup (about 10 minutes)

1. Create a free project at [supabase.com](https://supabase.com/dashboard).
2. In **SQL Editor**, paste `supabase/schema.sql` and **Run**. Its last line sets the only email allowed to edit (`dimetri.lee.2024@gmail.com`); change it there first if that ever needs to differ. Then paste and run `supabase/seed.sql` (copies in the posts and projects from `content/`).
3. In **Authentication → Users**, click **Add user → Create new user** with `dimetri.lee.2024@gmail.com` and a password. Tick *Auto confirm*.
4. In **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**, so nobody else can make an account.
5. In **Project Settings → API** (or the **Connect** button), copy the project URL and the publishable (or anon) key into `.env.local`. Use `.env.example` as the template. Add the same two variables in Vercel under **Settings → Environment Variables**, then redeploy once.
6. Run `npm run dev`, open http://localhost:3000/admin and sign in.

To add another editor, insert their email into the `admins` table in Supabase and create a user for them.

### How it fits together

- Supabase holds the content (`posts`, `projects`, `settings` tables) and uploads (the public `media` bucket). Row-level security lets visitors read published items only; writing needs a logged-in email listed in `admins`.
- `content/site.ts` holds the **defaults** for settings. Anything saved at `/admin/settings` overrides them.
- Without the Supabase env vars, the site falls back to the Markdown files in `content/posts` and `content/projects`. Once Supabase is connected, those files are only a backup; edit in `/admin`. `node scripts/make-seed.mjs` regenerates `seed.sql` from them.

## GitHub

`/work` pulls your latest public repos from the GitHub API and refreshes them every hour. If GitHub can't be reached, it shows `github.fallback` from `site.ts`.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). Add the two Supabase variables from `.env.example`. Then set the site address in `/admin/settings`.

## Notes

- Light and dark mode follow the visitor's system setting; the toggle remembers their choice.
- Motion is turned off for visitors who prefer reduced motion.
- Follower counts are set by hand in `/admin/settings`; pulling them live would need TikTok's Display API and the Instagram API.
