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
    body: JSON.stringify({ name: 'Layout Room', genre: 'adventure', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('layout routes', () => {
  it('saves layout and exports svg', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'layout@example.com')
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    const saveResponse = await app.request(`/layouts/${projectId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        width: 900,
        height: 700,
        zones: [
          { id: 'z1', name: 'Intro Zone', x: 20, y: 20, width: 250, height: 180, color: '#93c5fd' },
        ],
        objects: [{ id: 'o1', kind: 'prop', label: 'Locked Crate', x: 120, y: 120 }],
        overlays: { lighting: true, sound: true, emergency: false },
      }),
    })
    expect(saveResponse.status).toBe(200)

    const getResponse = await app.request(`/layouts/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(getResponse.status).toBe(200)

    const exportResponse = await app.request(`/layouts/${projectId}/export-svg`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(exportResponse.status).toBe(200)
    const payload = (await exportResponse.json()) as { data: { svg: string } }
    expect(payload.data.svg).toContain('<svg')
    expect(payload.data.svg).toContain('Locked Crate')
  })
})
