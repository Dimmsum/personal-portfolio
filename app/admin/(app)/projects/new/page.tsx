import { requireAdmin } from "@/lib/auth";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export default async function NewProject() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("projects").select("type");
  const types = [...new Set((data ?? []).map((r) => r.type as string))];
  return <ProjectEditor project={null} types={types} />;
}
