import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

/* Keeps the admin session fresh and sends logged-out visitors to the login page.
   This is only a first check: every admin page and action verifies again with requireAdmin(). */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!hasSupabase) return response;

  const sb = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await sb.auth.getUser();

  const isLogin = request.nextUrl.pathname === "/admin/login";
  if (!data.user && !isLogin) return NextResponse.redirect(new URL("/admin/login", request.url));
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
