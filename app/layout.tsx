import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PortfolioShell } from "@/components/shell/PortfolioShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dim — portfolio",
  description: "Personal portfolio, projects, and writing.",
};

const themeInitScript = `
try {
  var t = localStorage.getItem('portfolio:theme');
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  var r = document.documentElement;
  r.classList.add(t === 'light' ? 'theme-light' : 'theme-dark');
  r.setAttribute('data-theme', t);
} catch (e) {
  document.documentElement.classList.add('theme-dark');
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-dvh overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] font-sans">
        <PortfolioShell>{children}</PortfolioShell>
      </body>
    </html>
  );
}
