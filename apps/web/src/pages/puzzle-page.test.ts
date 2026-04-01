import { describe, expect, it } from 'vitest'

import {
  renderDifficultyTimingView,
  renderPuzzleFlowDiagram,
  renderPuzzlePage,
} from './puzzle-page'

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

  it('renders puzzle flow diagram data', () => {
    const html = renderPuzzleFlowDiagram({
      nodes: [
        { id: 'a', label: 'Cipher Door', order: 1, difficulty: 'medium' },
        { id: 'b', label: 'Light Relay', order: 2, difficulty: 'hard' },
      ],
      edges: [{ from: 'a', to: 'b' }],
    })

    expect(html).toContain('Puzzle Flow Diagram')
    expect(html).toContain('Cipher Door')
    expect(html).toContain('a -> b')
  })

  it('renders difficulty curve and timing blueprint', () => {
    const html = renderDifficultyTimingView({
      difficultyCurve: [
        { order: 1, title: 'Cipher Door', difficultyScore: 2 },
        { order: 2, title: 'Light Relay', difficultyScore: 3 },
      ],
      timingBlueprint: [
        { order: 1, title: 'Cipher Door', estimatedMinutes: 12, cumulativeMinutes: 12 },
        { order: 2, title: 'Light Relay', estimatedMinutes: 9, cumulativeMinutes: 21 },
      ],
      totalMinutes: 21,
    })

    expect(html).toContain('Difficulty Curve')
    expect(html).toContain('Timing Blueprint')
    expect(html).toContain('Total Estimated Runtime: 21 minutes')
  })
})
