import { describe, expect, it } from 'vitest'

import { renderGenerationDashboard } from './generation-page'

describe('generation page', () => {
  it('renders empty state', () => {
    const html = renderGenerationDashboard([])
    expect(html).toContain('No generation jobs queued yet.')
  })

  it('renders job progress summary and items', () => {
    const html = renderGenerationDashboard([
      {
        id: 'j1',
        projectId: 'p1',
        assetType: 'text',
        assetName: 'master-plan',
        status: 'complete',
        attempt: 1,
        maxAttempts: 2,
        outputUrl: 'https://assets.test/master-plan.md',
        error: null,
      },
      {
        id: 'j2',
        projectId: 'p1',
        assetType: 'diagram',
        assetName: 'puzzle-flow',
        status: 'processing',
        attempt: 2,
        maxAttempts: 2,
        outputUrl: null,
        error: null,
      },
    ])

    expect(html).toContain('Complete: 1')
    expect(html).toContain('Processing: 1')
    expect(html).toContain('master-plan')
  })
})
