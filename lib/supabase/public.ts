import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";

/* Anonymous client for public reads. No cookies, so it's safe inside "use cache". */
export function publicClient() {
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
