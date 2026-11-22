/* Set these in .env.local (and in Vercel). Without them the site reads content/ files instead. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const hasSupabase = Boolean(supabaseUrl && supabaseKey);
export const MEDIA_BUCKET = "media";
