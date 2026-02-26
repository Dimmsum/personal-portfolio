import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";

const PREVIEW_COUNT = 3;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.96 },
};

function ProjectScreenshots({ images, title }) {
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [enlargedIndex, setEnlargedIndex] = useState(null);
  if (!images?.length) return null;

  const previewImages = images.slice(0, PREVIEW_COUNT);
  const hasMore = images.length > PREVIEW_COUNT;
  const closeEnlarged = () => setEnlargedIndex(null);
  const goPrev = () => setEnlargedIndex((i) => (i != null && i > 0 ? i - 1 : images.length - 1));
  const goNext = () => setEnlargedIndex((i) => (i != null && i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="mt-6 mb-6">
      {/* Rectangle with grid of ~3 screens */}
      <motion.div
        className="rounded-xl border border-navy-200/80 bg-navy-50/40 shadow-sm overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-2">
          {previewImages.map((src, i) => (
            <motion.button
              type="button"
              key={`${src}-${i}`}
              variants={itemVariants}
              onClick={() => setEnlargedIndex(i)}
              className="group relative aspect-video overflow-hidden rounded-lg bg-navy-100/50 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-1"
            >
              <motion.img
                src={src}
                alt={`${title} — screenshot ${i + 1}`}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="sr-only">Enlarge screenshot {i + 1}</span>
            </motion.button>
          ))}
        </div>

        {hasMore && (
          <motion.div
            variants={itemVariants}
            className="px-2 pb-2 sm:px-3 sm:pb-3"
          >
            <button
              type="button"
              onClick={() => setViewMoreOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-navy-300 bg-navy-50/60 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:bg-navy-100/60 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-2"
            >
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View more
              </motion.span>
              <span className="text-navy-500">({images.length} screens)</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Modal: all screens */}
      <AnimatePresence>
        {viewMoreOpen && (
          <>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`All screens for ${title}`}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
              onClick={() => { setViewMoreOpen(false); setEnlargedIndex(null); }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-navy-200/80 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
                  <h4 className="font-heading text-lg font-semibold text-navy-950">
                    {title} — all screens
                  </h4>
                  <button
                    type="button"
                    onClick={() => { setViewMoreOpen(false); setEnlargedIndex(null); }}
                    className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
                    aria-label="Close"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-56px)] p-4">
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {images.map((src, i) => (
                      <motion.button
                        type="button"
                        key={`modal-${src}-${i}`}
                        variants={itemVariants}
                        onClick={() => setEnlargedIndex(i)}
                        className="group relative overflow-hidden rounded-xl border border-navy-200/80 bg-navy-50/40 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-2"
                      >
                        <div className="aspect-video w-full overflow-hidden">
                          <motion.img
                            src={src}
                            alt={`${title} — screenshot ${i + 1}`}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                        <span className="sr-only">Enlarge screenshot {i + 1}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enlarged lightbox (from preview grid or View more modal) */}
      <AnimatePresence>
        {enlargedIndex != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/20 backdrop-blur-md"
            onClick={closeEnlarged}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[75vh] w-full max-w-4xl flex-col rounded-2xl border border-navy-200/80 bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-end gap-2 border-b border-navy-100 px-3 py-2">
                {images.length > 1 && (
                  <span className="mr-auto text-sm text-navy-500">
                    {enlargedIndex + 1} / {images.length}
                  </span>
                )}
                <button
                  type="button"
                  onClick={closeEnlarged}
                  className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 focus:outline-none focus:ring-2 focus:ring-navy-400"
                  aria-label="Close enlarged view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative flex flex-1 min-h-0 items-center justify-center p-4">
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-navy-100 p-2 text-navy-700 hover:bg-navy-200 focus:outline-none focus:ring-2 focus:ring-navy-400"
                      aria-label="Previous screenshot"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-navy-100 p-2 text-navy-700 hover:bg-navy-200 focus:outline-none focus:ring-2 focus:ring-navy-400"
                      aria-label="Next screenshot"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <img
                  src={images[enlargedIndex]}
                  alt={`${title} — screenshot ${enlargedIndex + 1}`}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
                  <ProjectScreenshots
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
