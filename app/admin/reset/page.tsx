import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/admin/AuthShell";
import { NewPasswordForm } from "@/components/admin/NewPasswordForm";

export const metadata: Metadata = { title: "New password" };

/* Reached from the reset email, after /admin/auth/callback has signed you in. */
async function Gate() {
  const sb = await serverClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/login?e=link-expired");
  return <NewPasswordForm />;
}

export default function ResetPage() {
  return (
    <AuthShell>
      <Suspense>
        <Gate />
      </Suspense>
    </AuthShell>
  );
}
