import { describe, expect, it } from 'vitest'

import { renderConceptPage } from './concept-page'

describe('concept page', () => {
  it('renders empty state', () => {
    const html = renderConceptPage({})

    expect(html).toContain('No concept generated yet')
    expect(html).toContain('No images yet')
  })

  it('renders concept and mood board urls', () => {
    const html = renderConceptPage({
      conceptText: 'A forgotten museum wing sealed by puzzles.',
      moodBoardUrls: ['https://image-1.test', 'https://image-2.test'],
    })

    expect(html).toContain('forgotten museum wing')
    expect(html).toContain('https://image-1.test')
    expect(html).toContain('https://image-2.test')
  })
})
