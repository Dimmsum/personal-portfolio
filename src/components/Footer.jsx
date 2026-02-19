export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-navy-800/50 bg-gradient-to-b from-navy-900 to-navy-950 py-14 text-white shadow-[0_-4px_24px_-4px_rgba(15,23,42,0.2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-navy-300">
            © {currentYear} Dimetri Lee. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#home"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline rounded px-1 py-0.5 hover:bg-white/5"
            >
              Home
            </a>
            <a
              href="#projects"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline rounded px-1 py-0.5 hover:bg-white/5"
            >
              Projects
            </a>
            <a
              href="#resume"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline rounded px-1 py-0.5 hover:bg-white/5"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline rounded px-1 py-0.5 hover:bg-white/5"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
