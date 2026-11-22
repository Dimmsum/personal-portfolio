import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const name = `${site.first} ${site.last}`;
  return {
    metadataBase: new URL(site.url),
    title: { default: name, template: `%s · ${name}` },
    description: `${name}: ${site.kicker.toLowerCase()} in ${site.location}.`,
    openGraph: { title: name, description: site.kicker, url: site.url, siteName: name, type: "website" },
  };
}

/* Sets the saved theme before the page paints, so there's no flash. */
const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
