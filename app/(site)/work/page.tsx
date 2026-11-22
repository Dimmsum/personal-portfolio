import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjects, getRepos, getSite } from "@/lib/content";
import { summary } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { WorkBrowser } from "@/components/Filters";

export const metadata: Metadata = { title: "Work", description: "Apps, backends, AI tools and design." };

async function Repos() {
  const site = await getSite();
  const live = await getRepos(site.github.user, site.github.count);
  const repos = live ?? site.github.fallback;
  return (
    <>
      <div className="top">
        <h3>
          <Icon name="github" />
          GitHub <span>{live ? "recently pushed" : "repos"}</span>
        </h3>
        <a className="textlink" href={`https://github.com/${site.github.user}`} target="_blank" rel="noopener noreferrer">
          @{site.github.user}
          <Icon name="arrow" />
        </a>
      </div>
      <div className="repos">
        {repos.map((r) => (
          <a key={r.name} className="repo" href={r.url || `https://github.com/${site.github.user}`} target="_blank" rel="noopener noreferrer">
            <b>{r.name}</b>
            <p>{r.description || "No description yet."}</p>
            <div className="rm">
              {r.language && (
                <span>
                  <i className="dot" />
                  {r.language}
                </span>
              )}
              <span>
                <Icon name="star" />
                {r.stars}
              </span>
              {"updated" in r && r.updated && <span>{r.updated}</span>}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

export default async function Work() {
  const projects = (await getProjects()).map(summary);
  return (
    <>
      <section className="band">
        <div className="wrap ph1">
          <h1>
            Selected <span>work</span>
          </h1>
          <p>Apps, backends, AI tools and design for clients and my own products. Open any project for screenshots and details.</p>
        </div>
      </section>
      <section className="band tight">
        <div className="wrap">
          <WorkBrowser projects={projects} />
        </div>
      </section>
      <section className="band tight">
        <div className="wrap gh">
          <Suspense fallback={<div className="repos" />}>
            <Repos />
          </Suspense>
        </div>
      </section>
    </>
  );
}
