import type { ProjectCard } from '../types'

const renderProjectCard = (project: ProjectCard): string => {
  return [
    '<article class="project-card">',
    `<h2>${project.name}</h2>`,
    `<p>Genre: ${project.genre}</p>`,
    `<p>Room Type: ${project.roomType}</p>`,
    `<p>Status: ${project.status}</p>`,
    '</article>',
  ].join('')
}

export const renderDashboardShell = (projects: ProjectCard[]): string => {
  const cards = projects.length
    ? projects.map((project) => renderProjectCard(project)).join('')
    : '<p>No projects yet. Create your first project.</p>'

  return [
    '<main>',
    '<header>',
    '<h1>Project Dashboard</h1>',
    '<a href="/dashboard/new">Create New Project</a>',
    '</header>',
    `<section aria-label="projects">${cards}</section>`,
    '</main>',
  ].join('')
}
