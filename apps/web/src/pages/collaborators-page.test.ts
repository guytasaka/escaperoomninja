import { describe, expect, it } from 'vitest'

import { renderCollaboratorsPage } from './collaborators-page'

describe('collaborators page', () => {
  it('renders empty state', () => {
    const html = renderCollaboratorsPage([], [])
    expect(html).toContain('No collaborators yet.')
    expect(html).toContain('No comments yet.')
  })

  it('renders collaborators and comments', () => {
    const html = renderCollaboratorsPage(
      [{ id: 'c1', projectId: 'p1', email: 'a@b.com', role: 'commenter' }],
      [{ id: 'm1', projectId: 'p1', authorEmail: 'a@b.com', content: 'Looks great' }],
    )
    expect(html).toContain('a@b.com')
    expect(html).toContain('Looks great')
  })
})
