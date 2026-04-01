import { describe, expect, it } from 'vitest'

import { renderRevisionsPage } from './revisions-page'

describe('revisions page', () => {
  it('renders empty state', () => {
    expect(renderRevisionsPage([])).toContain('No revision snapshots yet.')
  })

  it('renders snapshot list', () => {
    const html = renderRevisionsPage([
      { id: 'r1', projectId: 'p1', label: 'Checkpoint A', payload: { phase: 'concept' } },
    ])
    expect(html).toContain('Checkpoint A')
  })
})
