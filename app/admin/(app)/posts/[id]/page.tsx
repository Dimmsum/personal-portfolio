import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { PostRow } from "@/lib/content";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const [{ data: post }, { data: all }] = await Promise.all([
    sb.from("posts").select("*").eq("id", id).maybeSingle(),
    sb.from("posts").select("tag"),
  ]);
  if (!post) notFound();
  const tags = [...new Set((all ?? []).map((r) => r.tag as string))];
  return <PostEditor key={post.id} post={post as PostRow} tags={tags} />;
}
