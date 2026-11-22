import { requireAdmin } from "@/lib/auth";
import { mergeSite } from "@/lib/content";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export default async function SettingsAdmin() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("settings").select("data").eq("id", 1).maybeSingle();
  return <SettingsEditor initial={mergeSite(data?.data ?? {})} />;
}
