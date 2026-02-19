import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";

function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  if (count === 0) return null;

  const goTo = (index) => {
    setCurrent((index + count) % count);
  };

  return (
    <div className="mt-6 mb-6">
      <div className="relative overflow-hidden rounded-xl border border-navy-200/80 bg-navy-50/50 shadow-sm">
        {/* Sliding track: one continuous strip for seamless transitions */}
        <div className="aspect-video w-full overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{ width: `${count * 100}%` }}
            animate={{ x: `-${current * (100 / count)}%` }}
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.5 }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="flex h-full shrink-0 items-center justify-center"
                style={{ width: `${100 / count}%` }}
              >
                <img
                  src={src}
                  alt={`${title} — image ${i + 1} of ${count}`}
                  className="max-h-full w-full object-contain object-center"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {count > 1 && (
          <>
            {/* Prev/Next: minimal, only on hover/focus for cleaner look */}
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-navy-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-navy-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Dots: pill indicator with smooth sliding highlight */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-2.5 py-2 backdrop-blur-sm">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className="relative rounded-full p-1 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <span
                    className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const FolderIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c0-.483.392-.875.875-.875h4.844c.483 0 .875.392.875.875v.203c0 .483-.392.875-.875.875H4.625a.875.875 0 01-.875-.875v-.203z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8z" />
  </svg>
);

const FileIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section id="projects" className="relative py-24 bg-gradient-to-b from-navy-50/40 via-white to-navy-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            className="font-heading text-3xl font-bold text-navy-950 sm:text-4xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Portfolio
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-navy-600"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Digital product showcases
          </motion.p>
        </div>

        {/* File-storage style: list left, detail right */}
        <motion.div
          className="mt-12 flex flex-col lg:flex-row gap-0 lg:gap-6 rounded-2xl border border-navy-200/80 bg-white shadow-[0_10px_40px_-10px_rgba(15,23,42,0.12),0_4px_16px_-4px_rgba(15,23,42,0.06)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Left: project list (file explorer style) */}
          <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-navy-200 bg-navy-50/80 flex flex-col">
            <div className="p-3 border-b border-navy-200 flex items-center gap-2 font-heading text-sm font-semibold text-navy-700">
              <FolderIcon />
              <span>Projects</span>
            </div>
            <nav className="p-2 flex-1 max-h-[320px] overflow-y-auto" aria-label="Project list">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    index === activeIndex
                      ? "bg-navy-950 text-white"
                      : "text-navy-700 hover:bg-navy-100"
                  }`}
                >
                  <FileIcon />
                  <span className="truncate flex-1 min-w-0">{project.title}</span>
                  {project.freelance && (
                    <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                      Freelance
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right: active project detail */}
          <div className="flex-1 min-h-[360px] lg:min-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeProject ? (
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-heading text-2xl font-bold text-navy-950">
                      {activeProject.title}
                    </h3>
                    {activeProject.freelance && (
                      <span className="inline-flex items-center rounded-full border-2 border-amber-400 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Freelance project
                      </span>
                    )}
                  </div>
                  {activeProject.techStack?.length > 0 && (
                    <div className="mt-5 mb-5 flex flex-wrap gap-2" aria-label="Technologies used">
                      {activeProject.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <ImageCarousel
                    images={activeProject.screenshots || []}
                    title={activeProject.title}
                  />
                  <p className="mt-5 text-navy-600 leading-relaxed">
                    {activeProject.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {activeProject.liveUrl && activeProject.liveUrl !== "#" && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-900 transition-colors"
                        aria-label="View live deployment"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View live
                      </a>
                    )}
                    {activeProject.githubUrl && activeProject.githubUrl !== "#" && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-950 px-4 py-2.5 text-sm font-semibold text-navy-950 hover:bg-navy-950 hover:text-white transition-colors"
                        aria-label="View GitHub repository"
                      >
                        <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Repository
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="p-8 text-center text-navy-500">
                  Select a project from the list.
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {projects.length === 0 && (
          <p className="mt-12 text-center text-navy-600">
            No projects yet.
          </p>
        )}
      </div>
    </section>
  );
}
