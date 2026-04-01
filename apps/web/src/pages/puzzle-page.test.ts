import { describe, expect, it } from 'vitest'

import { renderPuzzlePage } from './puzzle-page'

describe('puzzle page', () => {
  it('renders empty puzzle state', () => {
    const html = renderPuzzlePage([])

    expect(html).toContain('No puzzles generated yet.')
  })

  it('renders puzzle cards', () => {
    const html = renderPuzzlePage([
      {
        id: 'pz-1',
        projectId: 'p-1',
        title: 'Cipher Door',
        type: 'logic',
        difficulty: 'medium',
        estimatedMinutes: 12,
        description: 'Decode symbols to open the chamber door.',
        order: 1,
      },
    ])

    expect(html).toContain('Cipher Door')
    expect(html).toContain('Estimated Minutes: 12')
  })
})
