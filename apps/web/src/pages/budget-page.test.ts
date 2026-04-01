import { describe, expect, it } from 'vitest'

import { renderBudgetPage } from './budget-page'

describe('budget page', () => {
  it('renders empty state', () => {
    const html = renderBudgetPage([], null)
    expect(html).toContain('No materials yet.')
    expect(html).toContain('No summary yet.')
  })

  it('renders materials and budget summary', () => {
    const html = renderBudgetPage(
      [
        {
          id: 'm1',
          projectId: 'p1',
          category: 'props',
          name: 'Cipher Wheel Kit',
          quantity: 2,
          unitCost: 35,
          vendorUrl: null,
          alternatives: [],
          threeDPrintable: true,
        },
      ],
      {
        projectId: 'p1',
        totalsByCategory: { props: 70, electronics: 0, decor: 0, tools: 0, misc: 0 },
        totalCost: 70,
        allocatedBudget: 300,
        remainingBudget: 230,
      },
    )

    expect(html).toContain('Cipher Wheel Kit')
    expect(html).toContain('Remaining Budget: 230')
  })
})
