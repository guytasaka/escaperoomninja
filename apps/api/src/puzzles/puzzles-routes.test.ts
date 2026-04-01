import { describe, expect, it } from 'vitest'

import { createApp } from '../index'

const registerAndGetToken = async (app: ReturnType<typeof createApp>, email: string) => {
  const response = await app.request('/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'supersecret123',
    }),
  })

  const payload = (await response.json()) as { data: { token: string } }
  return payload.data.token
}

const createProject = async (app: ReturnType<typeof createApp>, token: string) => {
  const response = await app.request('/projects', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Puzzle Test Room',
      genre: 'adventure',
      roomType: 'single-room',
    }),
  })

  return (await response.json()) as { data: { project: { id: string } } }
}

describe('puzzle routes', () => {
  it('generates, lists, and patches puzzle records', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'puzzles@example.com')
    const projectPayload = await createProject(app, token)
    const projectId = projectPayload.data.project.id

    const generateResponse = await app.request('/puzzles/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        count: 3,
      }),
    })

    expect(generateResponse.status).toBe(200)
    const generated = (await generateResponse.json()) as {
      data: { puzzles: Array<{ id: string; title: string }> }
    }
    expect(generated.data.puzzles).toHaveLength(3)

    const listResponse = await app.request(`/puzzles/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)

    const patchResponse = await app.request(
      `/puzzles/${generated.data.puzzles[0]?.id}?projectId=${projectId}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Updated Puzzle Title',
        }),
      },
    )

    expect(patchResponse.status).toBe(200)
    const patched = (await patchResponse.json()) as { data: { puzzle: { title: string } } }
    expect(patched.data.puzzle.title).toBe('Updated Puzzle Title')
  })
})
