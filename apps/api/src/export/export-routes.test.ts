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

describe('export routes', () => {
  it('packages generated assets into downloadable zip metadata', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'export@example.com')

    const projectResponse = await app.request('/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Export Room', genre: 'sci-fi', roomType: 'single-room' }),
    })
    const project = (await projectResponse.json()) as { data: { project: { id: string } } }
    const projectId = project.data.project.id

    await app.request('/generation/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })

    const response = await app.request('/export/package', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })

    expect(response.status).toBe(200)
    const payload = (await response.json()) as { data: { zipUrl: string } }
    expect(payload.data.zipUrl).toContain('escape-room-package.zip')
  })
})
