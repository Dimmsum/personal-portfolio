/**
 * Structured resume content for web display. Keep in sync with your PDF.
 */
export const resume = {
  name: 'Dimetri Lee',
  title: 'Software Engineer',
  email: 'dimetri.lee.2024@gmail.com',
  phone: '1(876)862-9958',
  linkedin: 'linkedin.com/in/dimetri-lee',
  location: 'Kingston, Jamaica',

  summary: 'Software Engineer with experience building full-stack applications, RESTful APIs, and cross-platform mobile apps. Passionate about creating scalable solutions and delivering user-friendly experiences across web and mobile.',

  experience: [
    {
      role: 'Software Engineer (Internship)',
      company: 'Intellibus',
      period: '12/2025 – Present',
      location: 'Kingston',
      description: 'Contributing to software development initiatives in an agile environment.',
    },
    {
      role: 'API Team Lead (Internship)',
      company: 'Sagicor Innovation Lab',
      period: '07/2025 – Present',
      location: 'Kingston, Jamaica',
      description: 'Design and implement modular RESTful APIs in ASP.NET Core, integrating securely with blockchain protocols. Build robust backend features including authentication, RBAC, and data validation to support decentralized operations. Collaborate in Agile sprints, contributing to feature development, testing, and delivery. Assist in CI/CD pipeline setup with DevOps to streamline deployment and improve release efficiency.',
    },
    {
      role: 'Frontend Developer',
      company: 'Sagicor Innovation Lab',
      period: '07/2025 – Present',
      location: 'Kingston, Jamaica',
      description: 'Fixed a responsive web application with Angular, SCSS, and Bootstrap, supporting a university population of 12,000+ students. Developed and optimized the accompanying cross-platform mobile application using Ionic Framework, delivering a modern and consistent UI/UX across devices. Refactored layouts to resolve scaling and responsiveness issues, improving usability and accessibility.',
    },
  ],

  education: [
    {
      degree: 'Bachelor of Science in Computing',
      school: 'University of Technology Jamaica',
      period: '12/2027',
      location: 'Kingston, Jamaica',
      coursework: 'Database Design, Object Oriented Programming, Web Programming, Programming in Python, Data Structures',
    },
  ],

  skills: {
    backend: [
      'ASP.NET', 'C#', 'C/C++', 'Express', 'Firebase', 'Java', 'MySQL', 'Node.js',
      'Numpy', 'Pandas', 'PostgreSQL', 'Python', 'Scikit-learn', 'Supabase',
    ],
    frontend: [
      'Angular', 'Bootstrap', 'Figma', 'Git', 'HTML/CSS', 'JavaScript',
      'ReactJS', 'Tailwind', 'TypeScript', 'Next.js', 'Ionic Framework',
    ],
  },
}
