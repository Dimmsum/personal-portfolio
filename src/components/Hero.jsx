import { motion } from "framer-motion";
import profileImage from "../assets/profile.png";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-navy-50/20 to-transparent">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <h1 className="font-heading text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl lg:text-6xl drop-shadow-sm">
              Hello, I Am <br />
              <span className="bg-gradient-to-r from-navy-600 to-navy-800 bg-clip-text text-transparent">Dimetri Lee</span>.
            </h1>
            <p className="font-heading mt-3 text-xl font-semibold text-navy-800 sm:text-2xl">
              Software Engineer
            </p>

            <p className="mt-6 text-lg leading-relaxed text-navy-700 max-w-xl">
              I build full-stack applications, RESTful APIs, and cross-platform
              mobile apps with a focus on scalable backend systems and
              user-friendly frontends.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center rounded-xl bg-navy-950 px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.25)] transition-all hover:bg-navy-900 hover:shadow-[0_8px_30px_-4px_rgba(15,23,42,0.3)] hover:-translate-y-0.5"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                download="Dimetri Lee Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border-2 border-navy-950 px-6 py-3.5 text-base font-semibold text-navy-950 transition-all hover:bg-navy-950 hover:text-white hover:shadow-[0_4px_20px_-2px_rgba(15,23,42,0.2)] hover:-translate-y-0.5"
              >
                Download CV
              </a>
            </div>
          </motion.div>

          {/* Right: Photo with decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full border-2 border-navy-200/70 pointer-events-none" />
            <div className="absolute -bottom-2 -right-8 h-48 w-48 rounded-full bg-gradient-to-br from-navy-100/60 to-navy-200/30 pointer-events-none" />
            <div className="absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-navy-200/40 pointer-events-none" />

            <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-full border-4 border-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] ring-2 ring-navy-200/50">
              <img
                src={profileImage}
                alt="Dimetri Lee"
                className="h-full w-full object-cover object-[center_15%]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
