import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'

function ProjectCard({ project, index, onSelect }) {
  const [imgError, setImgError] = useState(false)
  const thumbnail = project.screenshots?.[0] || null

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group cursor-pointer rounded-2xl border border-navy-200 bg-white p-0 shadow-sm overflow-hidden hover:shadow-xl hover:border-navy-300 transition-all duration-300"
      onClick={() => onSelect(project)}
    >
      <div className="aspect-video bg-navy-100 overflow-hidden">
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt={project.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-500 text-sm">
            Add screenshots to public/projects/{project.id}/
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">
          {project.category}
        </span>
        <h3 className="mt-2 font-heading text-xl font-bold text-navy-950 group-hover:text-navy-700">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-navy-600 line-clamp-2">{project.description}</p>
      </div>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-navy-700 shadow hover:bg-white"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-navy-950">{project.title}</h2>
          <p className="mt-2 text-navy-600">{project.description}</p>
          <div className="mt-6 space-y-4">
            {project.screenshots?.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full rounded-lg border border-navy-200 shadow"
              />
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-900"
              >
                View Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-navy-950 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-navy-950 hover:text-white"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="bg-navy-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-navy-950 sm:text-4xl">
            Portfolio
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Digital product showcases
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <p className="mt-12 text-center text-navy-600">No projects yet.</p>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
