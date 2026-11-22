import Link from "next/link";
import { getSite } from "@/lib/content";

/* Two-panel frame for sign-in screens: your name on the navy side, the form on the other. */
export async function AuthShell({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const domain = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="au">
      <aside className="au-brand">
        <p className="au-name" aria-label={`${site.first} ${site.last}`}>
          <b>{site.first}</b>
          <b>{site.last}</b>
        </p>
        <Link className="au-back" href="/">
          Back to {domain}
        </Link>
      </aside>
      <main className="au-main">
        <div className="au-panel">{children}</div>
      </main>
    </div>
  );
}
