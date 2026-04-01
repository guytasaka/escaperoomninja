import { describe, expect, it } from 'vitest'

import { renderDownloadPage } from './download-page'

describe('download page', () => {
  it('renders empty state', () => {
    const html = renderDownloadPage(null)
    expect(html).toContain('No package available yet.')
  })

  it('renders package link and manifest', () => {
    const html = renderDownloadPage({
      projectId: 'p1',
      zipUrl: 'https://downloads.test/package.zip',
      manifest: {
        generatedAt: new Date().toISOString(),
        files: [{ assetName: 'master-plan', outputUrl: 'https://a', status: 'complete' }],
      },
    })
    expect(html).toContain('downloads.test/package.zip')
    expect(html).toContain('master-plan')
  })
})
