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
      name: 'Audience Test Room',
      genre: 'mystery',
      roomType: 'single-room',
    }),
  })

  return (await response.json()) as { data: { project: { id: string } } }
}

describe('audience routes', () => {
  it('generates and retrieves audience recommendations', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'audience@example.com')
    const projectPayload = await createProject(app, token)

    const generateResponse = await app.request('/audience/recommendations', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId: projectPayload.data.project.id,
        groupSize: 5,
        difficulty: 'medium',
        audienceType: 'friends',
      }),
    })

    expect(generateResponse.status).toBe(200)
    const generated = (await generateResponse.json()) as {
      data: { profile: { recommendations: string[] } }
    }
    expect(generated.data.profile.recommendations.length).toBeGreaterThan(0)

    const getResponse = await app.request(`/audience/${projectPayload.data.project.id}`, {
      headers: { authorization: `Bearer ${token}` },
    })

    expect(getResponse.status).toBe(200)
  })
})
