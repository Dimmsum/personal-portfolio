import type { Metadata } from "next";
import { site, type SocialKey } from "@/content/site";
import { Icon } from "@/components/Icon";
import { Stats } from "@/components/Stats";
import { PostTile } from "@/components/Cards";
import { CopyEmail } from "@/components/CopyEmail";

export const metadata: Metadata = { title: "Content", description: "TikTok and Instagram reach, top posts and how to work together." };

function Platform({ k }: { k: SocialKey }) {
  const p = site.socials[k];
  return (
    <div className="plat">
      <div className="pt-h">
        <Icon name={k} />
        <b>{p.label}</b>
        <span>{p.followers} followers</span>
        <a className="textlink" href={p.url} target="_blank" rel="noopener noreferrer">
          {p.handle}
          <Icon name="arrow" />
        </a>
      </div>
      <div className="posts">
        {p.posts.map((x) => (
          <PostTile key={x.title} x={x} />
        ))}
      </div>
    </div>
  );
}

export default function ContentPage() {
  return (
    <>
      <section className="band">
        <div className="wrap ph1">
          <h1>
            Content <span>&amp; reach</span>
          </h1>
          <p>I make videos on software engineering, uni life, the gym, food and trips around Jamaica. Here&apos;s what&apos;s landing, and how we can work together.</p>
        </div>
      </section>
      <section className="band navy">
        <div className="wrap">
          <Stats stats={site.stats} note={site.statsNote} />
          <div className="platforms" style={{ marginTop: "clamp(40px,5vw,64px)" }}>
            <Platform k="tiktok" />
            <Platform k="instagram" />
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap collab">
          <h2>
            Work <span>with me</span>
          </h2>
          <div>
            <ul className="offers">
              {site.offers.map((o) => (
                <li key={o.title}>
                  <Icon name={o.icon} />
                  <div>
                    <b>{o.title}</b>
                    <span>{o.text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mailrow">
              <a className="btn" href={`mailto:${site.email}`}>
                <Icon name="mail" />
                Email me
              </a>
              <span className="addr">{site.email}</span>
              <CopyEmail email={site.email} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
