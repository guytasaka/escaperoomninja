import { afterEach, describe, expect, it, vi } from 'vitest'

import { generateAudience, generatePuzzles, updatePuzzle } from './api'

describe('audience and puzzle api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads audience profile', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            profile: {
              projectId: 'p1',
              groupSize: 4,
              difficulty: 'medium',
              audienceType: 'friends',
              psychologyProfile: 'Collaborative and curious',
              recommendations: ['Use layered clues'],
            },
          },
        }),
        { status: 200 },
      ),
    )

    const profile = await generateAudience('https://api.test', 'token', {
      projectId: 'p1',
      groupSize: 4,
      difficulty: 'medium',
      audienceType: 'friends',
    })

    expect(profile.groupSize).toBe(4)
    expect(profile.recommendations[0]).toBe('Use layered clues')
  })

  it('loads generated puzzles and updates one', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              puzzles: [
                {
                  id: 'pz-1',
                  projectId: 'p1',
                  title: 'Cipher Door',
                  type: 'logic',
                  difficulty: 'medium',
                  estimatedMinutes: 12,
                  description: 'Decode symbols',
                  order: 1,
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
              puzzle: {
                id: 'pz-1',
                projectId: 'p1',
                title: 'Updated Cipher Door',
                type: 'logic',
                difficulty: 'medium',
                estimatedMinutes: 12,
                description: 'Decode symbols',
                order: 1,
              },
            },
          }),
          { status: 200 },
        ),
      )

    const puzzles = await generatePuzzles('https://api.test', 'token', {
      projectId: 'p1',
      count: 1,
    })
    expect(puzzles[0]?.title).toBe('Cipher Door')

    const updated = await updatePuzzle('https://api.test', 'token', 'p1', 'pz-1', {
      title: 'Updated Cipher Door',
    })

    expect(updated.title).toBe('Updated Cipher Door')
  })
})
