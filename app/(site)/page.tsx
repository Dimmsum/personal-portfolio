import Link from "next/link";
import { site, socialLinks, formatCount, type SocialKey } from "@/content/site";
import { getPosts, getProjects } from "@/lib/content";
import { summary } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { Cover } from "@/components/Cover";
import { Lines } from "@/components/Lines";
import { PostEntry, ProjectGrid } from "@/components/Cards";
import { VideoGrid } from "@/components/VideoEmbed";

export default async function Home() {
  const projects = (await getProjects()).filter((p) => p.featured).slice(0, 3).map(summary);
  const posts = (await getPosts()).slice(0, 2).map(summary);
  const total = Object.values(site.socials).reduce((n, x) => n + x.followers, 0);

  return (
    <>
      <section className="band">
        <div className="wrap">
          <div className="hero">
            <div>
              <p className="kicker rise">{site.kicker}</p>
              <h1 className="name rise" style={{ "--d": ".08s" } as React.CSSProperties}>
                <b>{site.first}</b>
                <span>{site.last}</span>
              </h1>
              <p className="lede rise" style={{ "--d": ".18s" } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: site.lede }} />
              <div className="cta rise" style={{ "--d": ".26s" } as React.CSSProperties}>
                <Link className="btn" href="/content">
                  <Icon name="mail" />
                  Work with me
                </Link>
                <Link className="btn ghost" href="/work">
                  See my work
                </Link>
                {socialLinks.map((s) => (
                  <a key={s.label} className="iconlink" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <Icon name={s.icon} />
                  </a>
                ))}
              </div>
            </div>
            <div className="portrait rise" style={{ "--d": ".14s" } as React.CSSProperties}>
              <Cover
                src={site.portrait}
                alt={`${site.first} ${site.last}`}
                fallback={
                  <div className="mono">
                    <Lines seed={3} />
                    <b>
                      {site.first[0]}
                      <i>{site.last[0]}</i>
                    </b>
                  </div>
                }
              />
              <div className="where">
                <Icon name="pin" />
                {site.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band tight">
        <div className="wrap">
          <div className="head">
            <h2>
              Selected <span>work</span>
            </h2>
            <Link className="textlink" href="/work">
              All projects
              <Icon name="right" />
            </Link>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <section className="band navy">
        <div className="wrap reach">
          <div>
            <div className="head" style={{ marginBottom: 0 }}>
              <h2>
                Most <span>viewed</span>
              </h2>
            </div>
            <p className="big">{formatCount(total)}</p>
            <p className="muted" style={{ margin: 0 }}>followers across TikTok and Instagram</p>
            <ul className="split">
              {(Object.keys(site.socials) as SocialKey[]).map((k) => (
                <li key={k}>
                  <Icon name={k} />
                  <b>{formatCount(site.socials[k].followers)}</b>
                  <a href={site.socials[k].url} target="_blank" rel="noopener noreferrer">
                    {site.socials[k].handle}
                  </a>
                </li>
              ))}
            </ul>
            <Link className="textlink" href="/content">
              Content &amp; collabs
              <Icon name="right" />
            </Link>
          </div>
          <VideoGrid videos={site.topVideos.slice(0, 2)} />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="head">
            <h2>
              Latest <span>writing</span>
            </h2>
            <Link className="textlink" href="/blog">
              All posts
              <Icon name="right" />
            </Link>
          </div>
          <div className="postlist">
            {posts.map((p) => (
              <PostEntry key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
