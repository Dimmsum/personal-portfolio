import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { ProjectRow } from "@/lib/content";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const [{ data: project }, { data: all }] = await Promise.all([
    sb.from("projects").select("*").eq("id", id).maybeSingle(),
    sb.from("projects").select("type"),
  ]);
  if (!project) notFound();
  const types = [...new Set((all ?? []).map((r) => r.type as string))];
  return <ProjectEditor key={project.id} project={project as ProjectRow} types={types} />;
}
