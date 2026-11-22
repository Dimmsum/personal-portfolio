import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { summary } from "@/lib/format";
import { BlogBrowser } from "@/components/Filters";

export const metadata: Metadata = { title: "Blog", description: "Things I'm learning, how I work, and lessons from building." };

export default async function Blog() {
  const posts = (await getPosts()).map(summary);
  return (
    <>
      <section className="band">
        <div className="wrap ph1">
          <h1>
            Blog <span>&amp; notes</span>
          </h1>
          <p>Things I&apos;m learning, how I work, and lessons from building.</p>
        </div>
      </section>
      <section className="band tight">
        <div className="wrap">
          <BlogBrowser posts={posts} />
        </div>
      </section>
    </>
  );
}
