import { afterEach, describe, expect, it, vi } from 'vitest'

import { generateConcept, generateMoodBoard } from './api'

describe('concept api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads concept text', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { concept: 'Concept response' } }), { status: 200 }),
    )

    const concept = await generateConcept('https://api.test', 'token', {
      projectId: 'c6467d35-e5f2-4fc1-8aef-c741f2413db2',
      prompt: 'moody detective archive',
    })

    expect(concept).toBe('Concept response')
  })

  it('loads mood board urls', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ data: { images: ['https://img-1.test', 'https://img-2.test'] } }),
        { status: 200 },
      ),
    )

    const images = await generateMoodBoard('https://api.test', 'token', {
      projectId: '0ebc56a5-5f11-4b01-9018-95f08d90f7f2',
      prompt: 'rusted metal and secret passageways',
    })

    expect(images).toEqual(['https://img-1.test', 'https://img-2.test'])
  })
})
