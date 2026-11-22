import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost, getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/Icon";

export async function generateStaticParams() {
  const slugs = (await getPosts()).map((p) => ({ slug: p.slug }));
  // Cache Components needs at least one; new posts still render on first visit.
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { type: "article", publishedTime: p.date } } : {};
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();
  const all = await getPosts();
  const next = all[all.findIndex((x) => x.slug === p.slug) + 1] ?? all[0];

  return (
    <>
      <section className="band">
        <div className="wrap">
          <article className="article">
            <Link className="back" href="/blog">
              <Icon name="right" />
              All posts
            </Link>
            <p className="date">{formatDate(p.date)}</p>
            <h1>{p.title}</h1>
            <div className="by">
              <em>{p.tag}</em>
              <span>{p.minutes} min read</span>
            </div>
            <div className="body md" dangerouslySetInnerHTML={{ __html: p.html }} />
          </article>
        </div>
      </section>
      {next.slug !== p.slug && (
        <section className="band tight">
          <div className="wrap">
            <Link className="next" href={`/blog/${next.slug}`}>
              <span>
                Next post
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

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<section className="band missing" />}>
      <Article params={params} />
    </Suspense>
  );
}
