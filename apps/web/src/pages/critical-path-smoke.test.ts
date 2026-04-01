import { describe, expect, it } from 'vitest'

import { renderBudgetPage } from './budget-page'
import { renderDashboardShell } from './dashboard-page'
import { renderDownloadPage } from './download-page'
import { renderReviewPage } from './review-page'

describe('critical path smoke', () => {
  it('renders key flow pages with stable states', () => {
    const dashboard = renderDashboardShell([])
    const review = renderReviewPage({
      loading: false,
      error: null,
      sections: ['Concept', 'Puzzles'],
    })
    const budget = renderBudgetPage([], null)
    const download = renderDownloadPage(null)

    expect(dashboard).toContain('Project Dashboard')
    expect(review).toContain('Project Review')
    expect(budget).toContain('Budget and Materials')
    expect(download).toContain('Download Package')
  })
})
