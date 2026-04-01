import { describe, expect, it } from 'vitest'

import { renderReviewPage } from './review-page'

describe('review page', () => {
  it('renders loading state', () => {
    const html = renderReviewPage({ loading: true, error: null, sections: [] })
    expect(html).toContain('Loading review data')
    expect(html).toContain('mobile-stack')
  })

  it('renders error state', () => {
    const html = renderReviewPage({ loading: false, error: 'Network failed', sections: [] })
    expect(html).toContain('Error: Network failed')
  })

  it('renders section list', () => {
    const html = renderReviewPage({ loading: false, error: null, sections: ['Concept', 'Puzzles'] })
    expect(html).toContain('Concept')
    expect(html).toContain('Puzzles')
  })
})
