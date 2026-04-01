import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  exportLayoutSvg,
  generateNarratives,
  getLayout,
  previewNarrativeTts,
  saveLayout,
  updateNarrativeScript,
} from './api'

describe('narrative and layout api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generates and updates narrative scripts', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              scripts: [
                {
                  id: 's1',
                  projectId: 'p1',
                  category: 'intro',
                  title: 'Intro Script',
                  content: 'Welcome team',
                },
              ],
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              script: {
                id: 's1',
                projectId: 'p1',
                category: 'intro',
                title: 'Intro Script',
                content: 'Updated text',
              },
            },
          }),
          { status: 200 },
        ),
      )

    const scripts = await generateNarratives('https://api.test', 'token', { projectId: 'p1' })
    expect(scripts.length).toBe(1)

    const updated = await updateNarrativeScript(
      'https://api.test',
      'token',
      'p1',
      's1',
      'Updated text',
    )
    expect(updated.content).toBe('Updated text')
  })

  it('requests tts preview and layout save/export', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              audioUrl: 'https://audio.test/preview.mp3',
              voice: 'narrator-a',
              estimatedDurationSec: 5,
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              layout: {
                projectId: 'p1',
                width: 800,
                height: 600,
                zones: [],
                objects: [],
                overlays: { lighting: true, sound: false, emergency: true },
              },
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              layout: {
                projectId: 'p1',
                width: 800,
                height: 600,
                zones: [],
                objects: [],
                overlays: { lighting: true, sound: false, emergency: true },
              },
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { svg: '<svg></svg>' } }), { status: 200 }),
      )

    const preview = await previewNarrativeTts(
      'https://api.test',
      'token',
      'p1',
      'hello world',
      'narrator-a',
    )
    expect(preview.voice).toBe('narrator-a')

    const saved = await saveLayout('https://api.test', 'token', 'p1', {
      width: 800,
      height: 600,
      zones: [],
      objects: [],
      overlays: { lighting: true, sound: false, emergency: true },
    })
    expect(saved.projectId).toBe('p1')

    const loaded = await getLayout('https://api.test', 'token', 'p1')
    expect(loaded?.width).toBe(800)

    const svg = await exportLayoutSvg('https://api.test', 'token', 'p1')
    expect(svg).toBe('<svg></svg>')
  })
})
