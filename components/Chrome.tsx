import Link from "next/link";
import { socialLinksFor } from "@/content/site";
import { currentYear, getSite } from "@/lib/content";
import { Icon } from "./Icon";
import { NavLinks, ThemeToggle } from "./Nav";

export async function Header() {
  const site = await getSite();
  return (
    <header className="nav">
      <div className="bar">
        <Link className="logo" href="/">
          {site.first} <span>{site.last}</span>
        </Link>
        <NavLinks />
        <ThemeToggle />
      </div>
    </header>
  );
}

export async function Footer() {
  const [site, year] = await Promise.all([getSite(), currentYear()]);
  const name = `${site.first} ${site.last}`;
  return (
    <footer className="band navy contact">
      <div className="wrap">
        <h2>
          <b>Let&apos;s build</b>
          <span>something.</span>
        </h2>
        <a className="bigmail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <div className="foot">
          <span>
            © {year} {name} · {site.location}
          </span>
          <div className="soc">
            {[...socialLinksFor(site), { icon: "mail", href: `mailto:${site.email}`, label: "Email" }].map((s) => (
              <a key={s.label} className="iconlink" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <Icon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
