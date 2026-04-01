import { describe, expect, it } from 'vitest'

import { renderNarrativePage } from './narrative-page'

describe('narrative page', () => {
  it('renders empty state', () => {
    const html = renderNarrativePage([], null)
    expect(html).toContain('No scripts generated yet.')
    expect(html).toContain('No preview yet.')
  })

  it('renders scripts and tts preview details', () => {
    const html = renderNarrativePage(
      [
        {
          id: 's1',
          projectId: 'p1',
          category: 'intro',
          title: 'Intro Script',
          content: 'Welcome investigators.',
        },
      ],
      {
        audioUrl: 'https://audio.test/preview.mp3',
        voice: 'narrator-a',
        estimatedDurationSec: 6,
      },
    )

    expect(html).toContain('Intro Script')
    expect(html).toContain('narrator-a')
    expect(html).toContain('audio.test/preview.mp3')
  })
})
