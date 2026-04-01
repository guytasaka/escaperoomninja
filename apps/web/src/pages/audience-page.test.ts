import { describe, expect, it } from 'vitest'

import { renderAudiencePage } from './audience-page'

describe('audience page', () => {
  it('renders empty state', () => {
    const html = renderAudiencePage(null)

    expect(html).toContain('No profile generated yet.')
  })

  it('renders generated profile', () => {
    const html = renderAudiencePage({
      projectId: 'p1',
      groupSize: 5,
      difficulty: 'medium',
      audienceType: 'friends',
      psychologyProfile: 'Players enjoy social deduction and medium pressure.',
      recommendations: ['Use layered hints', 'Balance parallel puzzle tracks'],
    })

    expect(html).toContain('Audience Profile')
    expect(html).toContain('Use layered hints')
  })
})
