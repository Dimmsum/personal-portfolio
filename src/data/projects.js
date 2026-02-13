/**
 * Add your projects here. Place screenshots in public/projects/[project-slug]/
 * and reference them as /projects/[project-slug]/filename.png
 */
export const projects = [
  {
    id: '1',
    title: 'SaaS Landing Page',
    category: 'Landing Page',
    description: 'A modern landing page for a SaaS product with clean design and strong conversion focus.',
    screenshots: ['/projects/saas-landing/screen1.png', '/projects/saas-landing/screen2.png'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: '2',
    title: 'Education Platform',
    category: 'App Design',
    description: 'E-learning platform with intuitive navigation and engaging user experience.',
    screenshots: ['/projects/education-platform/screen1.png'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: '3',
    title: 'Litigation Mobile App',
    category: 'App Design',
    description: 'Mobile application for legal professionals to manage cases on the go.',
    screenshots: ['/projects/litigation-app/screen1.png'],
    liveUrl: '#',
    githubUrl: '#',
  },
]

/**
 * Unique categories for filter tabs (derived from projects)
 */
export const categories = ['All', ...new Set(projects.map((p) => p.category))]
