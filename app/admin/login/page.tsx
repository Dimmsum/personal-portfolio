import type { Metadata } from "next";
import { hasSupabase } from "@/lib/supabase/env";
import { AuthShell } from "@/components/admin/AuthShell";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm connected={hasSupabase} />
    </AuthShell>
  );
}
