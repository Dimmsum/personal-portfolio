import { Suspense } from "react";
import { hasSupabase } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

async function Notice({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { e } = await searchParams;
  if (e !== "not-admin") return null;
  return <p className="ad-error">That account isn&apos;t on the admin list.</p>;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="ad-login">
      <h1>
        Sign <span>in</span>
      </h1>
      {!hasSupabase && (
        <p className="ad-error">
          Supabase isn&apos;t connected yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
          <code>.env.local</code>, then restart. See the README.
        </p>
      )}
      <Suspense>
        <Notice searchParams={searchParams} />
      </Suspense>
      <LoginForm />
    </main>
  );
}
