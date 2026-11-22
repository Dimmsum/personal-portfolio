import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject, getProjects } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { Cover } from "@/components/Cover";
import { GenCover, hash } from "@/components/Lines";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.blurb } : {};
}

async function ProjectDetail({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const all = await getProjects();
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length];
  const shots = p.images.length ? p.images : [""];

  return (
    <>
      <section className="band">
        <div className="wrap">
          <div className="ph1">
            <Link className="back" href="/work">
              <Icon name="right" />
              All work
            </Link>
            <h1>{p.title}</h1>
          </div>
          <div className="pp">
            <div className="body md" dangerouslySetInnerHTML={{ __html: p.html || `<p>${p.blurb}</p>` }} />
            <div>
              <ul className="spec">
                <li>
                  <span>Type</span>
                  <span>{p.type}</span>
                </li>
                <li>
                  <span>Year</span>
                  <span>{p.year}</span>
                </li>
                {p.status && (
                  <li>
                    <span>Status</span>
                    <span className="status">{p.status}</span>
                  </li>
                )}
                <li>
                  <span>Stack</span>
                  <span>{p.tags.join(", ")}</span>
                </li>
              </ul>
              {(p.link || p.repo) && (
                <div className="spec">
                  <div className="lk">
                    {p.link && (
                      <a className="textlink" href={p.link} target="_blank" rel="noopener noreferrer">
                        Visit
                        <Icon name="arrow" />
                      </a>
                    )}
                    {p.repo && (
                      <a className="textlink" href={p.repo} target="_blank" rel="noopener noreferrer">
                        Code
                        <Icon name="github" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`shots${shots.length > 1 ? " two" : ""}`}>
            {shots.map((s, k) => (
              <div className="cover" key={k}>
                <Cover src={s} alt={`${p.title} screenshot ${k + 1}`} fallback={<GenCover label={p.title} seed={hash(p.title) + k} />} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {next.slug !== p.slug && (
        <section className="band tight">
          <div className="wrap">
            <Link className="next" href={`/work/${next.slug}`}>
              <span>
                Next project
                <b>
                  {next.title}
                  <Icon name="arrow" />
                </b>
              </span>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<section className="band missing" />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}
