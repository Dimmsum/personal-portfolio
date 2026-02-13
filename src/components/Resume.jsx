import { motion } from 'framer-motion'
import { resume } from '../data/resume'

export default function Resume() {
  return (
    <section id="resume" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Formatted web version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <h2 className="font-heading text-3xl font-bold text-navy-950 sm:text-4xl">
              Resume
            </h2>
            <p className="mt-4 text-lg text-navy-600">
              {resume.summary}
            </p>

            {/* Education */}
            <div className="mt-12">
              <h3 className="font-heading text-xl font-bold text-navy-950">Education</h3>
              <div className="mt-6 space-y-4">
                {resume.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-navy-200 bg-navy-50/50 p-4">
                    <h4 className="font-heading font-semibold text-navy-950">{edu.degree}</h4>
                    <p className="text-navy-600">{edu.school}{edu.location && ` • ${edu.location}`}</p>
                    <p className="text-sm text-navy-500">{edu.period}</p>
                    {edu.coursework && (
                      <p className="mt-2 text-sm text-navy-600">Relevant Coursework: {edu.coursework}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mt-12">
              <h3 className="font-heading text-xl font-bold text-navy-950">Experience</h3>
              <div className="mt-6 space-y-8">
                {resume.experience.map((job, i) => (
                  <div
                    key={i}
                    className="relative border-l-2 border-navy-200 pl-6 before:absolute before:left-[-5px] before:top-0 before:h-3 before:w-3 before:rounded-full before:bg-navy-600"
                  >
                    <h4 className="font-heading font-semibold text-navy-950">{job.role}</h4>
                    <p className="text-navy-600">{job.company}{job.location && ` • ${job.location}`}</p>
                    <p className="text-sm text-navy-500">{job.period}</p>
                    <p className="mt-2 text-navy-700">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mt-12">
              <h3 className="font-heading text-xl font-bold text-navy-950">Skills</h3>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-navy-600">Backend</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resume.skills.backend.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-navy-100 px-4 py-2 text-sm font-medium text-navy-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-navy-600">Frontend</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resume.skills.frontend.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-navy-100 px-4 py-2 text-sm font-medium text-navy-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PDF download sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 lg:col-span-4 lg:mt-0"
          >
            <div className="sticky top-24 rounded-2xl border border-navy-200 bg-navy-50/50 p-8 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-navy-950">
                Download PDF
              </h3>
              <p className="mt-2 text-sm text-navy-600">
                Get a printable version of my resume for your records.
              </p>
              <a
                href="/resume.pdf"
                download="Dimetri Lee Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-navy-950 px-6 py-4 font-semibold text-white shadow-lg hover:bg-navy-900 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
