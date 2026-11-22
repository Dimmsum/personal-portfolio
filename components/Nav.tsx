"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const items = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/content", "Content"],
  ["/blog", "Blog"],
  ["/about", "About"],
] as const;

export function NavLinks() {
  const path = usePathname();
  return (
    <nav className="links" aria-label="Pages">
      {items.map(([href, label]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.dataset.theme = cur === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {}
  };
  return (
    <button className="tog" onClick={toggle} aria-label="Switch light or dark mode">
      <Icon name="sun" className="sun" />
      <Icon name="moon" className="moon" />
    </button>
  );
}
