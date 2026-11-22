"use client";
import { createBrowserClient } from "@supabase/ssr";
import { MEDIA_BUCKET, supabaseKey, supabaseUrl } from "./env";

let client: ReturnType<typeof createBrowserClient> | undefined;
export const browserClient = () => (client ??= createBrowserClient(supabaseUrl, supabaseKey));

/* Uploads a file to the public media bucket and returns its URL. */
export async function uploadMedia(file: File, folder: string) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${folder}/${Date.now()}-${safe || "file"}`;
  const sb = browserClient();
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
