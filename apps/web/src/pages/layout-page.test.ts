import { describe, expect, it } from 'vitest'

import { renderLayoutPage } from './layout-page'

describe('layout page', () => {
  it('renders empty state', () => {
    const html = renderLayoutPage(null, null)
    expect(html).toContain('No layout saved yet.')
    expect(html).toContain('Not exported yet.')
  })

  it('renders layout model and svg preview', () => {
    const html = renderLayoutPage(
      {
        projectId: 'p1',
        width: 900,
        height: 700,
        zones: [
          { id: 'z1', name: 'Entry', x: 20, y: 20, width: 200, height: 150, color: '#93c5fd' },
        ],
        objects: [{ id: 'o1', kind: 'prop', label: 'Locked Crate', x: 120, y: 100 }],
        overlays: { lighting: true, sound: false, emergency: true },
      },
      '<svg></svg>',
    )

    expect(html).toContain('Canvas: 900x700')
    expect(html).toContain('Locked Crate')
    expect(html).toContain('<svg></svg>')
  })
})
