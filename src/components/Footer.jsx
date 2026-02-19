export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-200 bg-navy-950 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-navy-300">
            © {currentYear} Dimetri Lee. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#home"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline"
            >
              Home
            </a>
            <a
              href="#projects"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline"
            >
              Projects
            </a>
            <a
              href="#resume"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="text-sm text-navy-300 hover:text-white transition-colors focus-visible:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
