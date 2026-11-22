import type { Metadata } from "next";
import { statsFor, formatCount, type SocialKey } from "@/content/site";
import { getSite } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Stats } from "@/components/Stats";
import { VideoGrid } from "@/components/VideoEmbed";
import { CopyEmail } from "@/components/CopyEmail";

export const metadata: Metadata = { title: "Content", description: "TikTok and Instagram reach, top posts and how to work together." };

export default async function ContentPage() {
  const site = await getSite();
  const stats = statsFor(site);
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
          <Stats stats={stats} />
          <div className="head" style={{ marginTop: "clamp(48px,6vw,80px)" }}>
            <h2>
              Top <span>videos</span>
            </h2>
          </div>
          <VideoGrid videos={site.topVideos} />
          <div className="handles">
            {(Object.keys(site.socials) as SocialKey[]).map((k) => (
              <a key={k} className="textlink" href={site.socials[k].url} target="_blank" rel="noopener noreferrer">
                <Icon name={k} />
                {site.socials[k].handle} · {formatCount(site.socials[k].followers)}
                <Icon name="arrow" />
              </a>
            ))}
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
                <li key={o.title + o.icon}>
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
