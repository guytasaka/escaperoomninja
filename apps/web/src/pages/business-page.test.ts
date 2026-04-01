import { describe, expect, it } from 'vitest'

import { renderBusinessPage } from './business-page'

describe('business page', () => {
  it('renders empty state', () => {
    const html = renderBusinessPage(null)
    expect(html).toContain('No business plan generated yet.')
  })

  it('renders business plan sections', () => {
    const html = renderBusinessPage({
      projectId: 'p1',
      pricingStrategy: 'Tiered pricing by timeslot.',
      financialProjection: 'Break-even in 6 months.',
      marketingPlan: 'Launch teaser campaign and referral offer.',
    })

    expect(html).toContain('Tiered pricing by timeslot.')
    expect(html).toContain('Break-even in 6 months.')
    expect(html).toContain('teaser campaign')
  })
})
