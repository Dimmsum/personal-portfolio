import "server-only";
import { redirect } from "next/navigation";
import { hasSupabase } from "./supabase/env";
import { serverClient } from "./supabase/server";

/* Use at the top of every admin page and Server Action. Redirects to login if needed. */
export async function requireAdmin() {
  if (!hasSupabase) redirect("/admin/login");
  const sb = await serverClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) redirect("/admin/login?e=not-admin");
  return { sb, email: data.user.email ?? "" };
}
