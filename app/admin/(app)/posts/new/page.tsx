import { requireAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPost() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("posts").select("tag");
  const tags = [...new Set((data ?? []).map((r) => r.tag as string))];
  return <PostEditor post={null} tags={tags} />;
}
