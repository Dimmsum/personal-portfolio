import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Cover } from "@/components/Cover";
import { GenCover } from "@/components/Lines";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: "About", description: `About ${site.first} ${site.last}, plus resume.` };
}

type Entry = { org: string; role: string; when: string; text: string; logo?: string };

function Job({ j }: { j: Entry }) {
  return (
    <div className="job">
      <b>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {j.logo && <img src={j.logo} alt="" />}
        {j.org}
      </b>
      <span className="when">{j.when}</span>
      <span className="role">{j.role}</span>
      {j.text && <p>{j.text}</p>}
    </div>
  );
}

export default async function About() {
  const site = await getSite();
  return (
    <>
      <section className="band">
        <div className="wrap ph1">
          <h1>
            About <span>me</span>
          </h1>
        </div>
      </section>
      <section className="band tight">
        <div className="wrap about">
          <div className="photos">
            {site.about.photos.map((p, i) => (
              <div className="ph" key={i}>
                <Cover src={p.src} alt={p.caption} fallback={<GenCover label={p.caption} seed={i + 11} />} />
              </div>
            ))}
          </div>
          <div className="bio">
            {site.about.bio.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
            <ul className="facts">
              {site.about.facts.map((f, i) => (
                <li key={i}>
                  <Icon name={f.icon} />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="band tight" id="resume">
        <div className="wrap">
          <div className="head">
            <h2>Resume</h2>
            <a className="btn" href={site.resumePdf} target="_blank" rel="noopener noreferrer">
              <Icon name="down" />
              Download PDF
            </a>
          </div>
          <div className="resume">
            <div>
              <h3>Experience</h3>
              {site.jobs.map((j, i) => (
                <Job key={i} j={j} />
              ))}
            </div>
            <div>
              <h3>Skills</h3>
              <div className="skills">
                {site.skills.map((s, i) => (
                  <div key={i}>
                    <b>{s.group}</b>
                    <span>{s.items}</span>
                  </div>
                ))}
              </div>
              <h3>Education</h3>
              {site.education.map((j, i) => (
                <Job key={i} j={j} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
