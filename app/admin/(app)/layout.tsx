import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";

async function Who() {
  const { email } = await requireAdmin();
  return (
    <form action={logout} className="ad-who">
      <span>{email}</span>
      <button className="ad-link">Log out</button>
    </form>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="ad-bar">
        <Link href="/admin/posts" className="ad-logo">
          Admin
        </Link>
        <AdminNav />
        <Link href="/" className="ad-link" target="_blank">
          View site ↗
        </Link>
        <Suspense fallback={<span className="ad-who" />}>
          <Who />
        </Suspense>
      </header>
      <main className="ad-main">
        <Suspense fallback={<p className="ad-muted">Loading…</p>}>{children}</Suspense>
      </main>
    </>
  );
}
