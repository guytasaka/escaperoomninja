import { describe, expect, it } from 'vitest'

import { createApp } from '../index'

const registerAndGetToken = async (app: ReturnType<typeof createApp>, email: string) => {
  const response = await app.request('/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'supersecret123' }),
  })
  const payload = (await response.json()) as { data: { token: string } }
  return payload.data.token
}

const createProject = async (app: ReturnType<typeof createApp>, token: string) => {
  const response = await app.request('/projects', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'Preview Room', genre: 'horror', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('preview routes', () => {
  it('returns quick tts preview metadata', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'preview@example.com')
    const project = await createProject(app, token)

    const response = await app.request('/preview/tts', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        projectId: project.data.project.id,
        text: 'Welcome investigators, your mission starts now.',
        voice: 'narrator-a',
      }),
    })

    expect(response.status).toBe(200)
    const payload = (await response.json()) as {
      data: { audioUrl: string; estimatedDurationSec: number; voice: string }
    }
    expect(payload.data.audioUrl).toContain('https://audio.escaperoomninja.local')
    expect(payload.data.estimatedDurationSec).toBeGreaterThan(0)
    expect(payload.data.voice).toBe('narrator-a')
  })
})
