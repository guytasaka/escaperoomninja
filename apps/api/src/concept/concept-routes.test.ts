import { describe, expect, it } from 'vitest'

import { createApp } from '../index'

const register = async (app: ReturnType<typeof createApp>, email: string) => {
  const response = await app.request('/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'supersecret123' }),
  })

  return (await response.json()) as { data: { token: string } }
}

const createProject = async (app: ReturnType<typeof createApp>, token: string) => {
  const response = await app.request('/projects', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Concept Test Project',
      genre: 'mystery',
      roomType: 'single-room',
    }),
  })

  return (await response.json()) as { data: { project: { id: string } } }
}

describe('concept routes', () => {
  it('generates concept text and mood board', async () => {
    const app = createApp()
    const { data: auth } = await register(app, 'concept@example.com')
    const { data: projectData } = await createProject(app, auth.token)

    const conceptResponse = await app.request('/concept/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        projectId: projectData.project.id,
        prompt: 'An ancient archive where shadows keep secrets',
      }),
    })

    expect(conceptResponse.status).toBe(200)
    const conceptJson = (await conceptResponse.json()) as { data: { concept: string } }
    expect(conceptJson.data.concept).toContain('Concept draft')

    const moodResponse = await app.request('/concept/mood-board', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        projectId: projectData.project.id,
        prompt: 'antique brass locks and rainy alleys',
      }),
    })

    expect(moodResponse.status).toBe(200)
    const moodJson = (await moodResponse.json()) as { data: { images: string[] } }
    expect(moodJson.data.images).toHaveLength(3)
  })
})
