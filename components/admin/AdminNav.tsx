"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin/posts", "Blog"],
  ["/admin/projects", "Projects"],
  ["/admin/settings", "Settings"],
] as const;

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="ad-nav" aria-label="Admin sections">
      {items.map(([href, label]) => (
        <Link key={href} href={href} aria-current={path.startsWith(href) ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
