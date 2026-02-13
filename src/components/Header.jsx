import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#home", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-navy-100 shadow-sm">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-navy-700 hover:text-navy-950 font-medium transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            download="Dimetri Lee Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-900 transition-colors"
          >
            Download CV
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden rounded-lg p-2 text-navy-700 hover:bg-navy-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-navy-100 bg-white"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={handleNavClick}
                  className="block rounded-lg px-4 py-3 text-navy-700 hover:bg-navy-100 font-medium"
                >
                  {label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                download="Dimetri Lee Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                className="block rounded-lg bg-navy-950 px-4 py-3 text-center font-semibold text-white hover:bg-navy-900"
              >
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
