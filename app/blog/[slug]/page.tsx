import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/content/posts";
import { PostDetail } from "@/components/blog/PostDetail";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <PostDetail post={post} />;
}
