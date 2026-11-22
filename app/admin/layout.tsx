import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/* Admin pages read the login cookie on every request, so they aren't expected to be instant. */
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="ad">{children}</div>;
}
