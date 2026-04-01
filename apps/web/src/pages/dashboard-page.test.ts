import { describe, expect, it } from 'vitest'

import { renderDashboardShell } from './dashboard-page'

describe('dashboard shell', () => {
  it('renders empty state', () => {
    const html = renderDashboardShell([])

    expect(html).toContain('No projects yet')
    expect(html).toContain('Create New Project')
  })

  it('renders project cards', () => {
    const html = renderDashboardShell([
      {
        id: 'p1',
        name: 'Vault Run',
        genre: 'heist',
        roomType: 'single-room',
        status: 'draft',
        updatedAt: new Date().toISOString(),
      },
    ])

    expect(html).toContain('Vault Run')
    expect(html).toContain('Genre: heist')
  })
})
