import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { site, socialLinks } from "@/content/site";
import { currentYear } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { NavLinks, ThemeToggle } from "@/components/Nav";

const name = `${site.first} ${site.last}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: name, template: `%s · ${name}` },
  description: `${name}: ${site.kicker.toLowerCase()} in ${site.location}.`,
  openGraph: { title: name, description: site.kicker, url: site.url, siteName: name, type: "website" },
};

/* Sets the saved theme before the page paints, so there's no flash. */
const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;


async function Footer() {
  const year = await currentYear();
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
            {[...socialLinks, { icon: "mail", href: `mailto:${site.email}`, label: "Email" }].map((s) => (
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="nav">
          <div className="bar">
            <Link className="logo" href="/">
              {site.first} <span>{site.last}</span>
            </Link>
            <NavLinks />
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
