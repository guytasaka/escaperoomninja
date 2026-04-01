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

describe('revision routes', () => {
  it('creates and restores revision snapshots', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'revision@example.com')

    const projectResponse = await app.request('/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Revision Room', genre: 'horror', roomType: 'single-room' }),
    })
    const project = (await projectResponse.json()) as { data: { project: { id: string } } }
    const projectId = project.data.project.id

    const snapshotResponse = await app.request('/revisions/snapshot', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, label: 'Checkpoint A', payload: { phase: 'puzzles' } }),
    })
    expect(snapshotResponse.status).toBe(200)
    const snapshot = (await snapshotResponse.json()) as { data: { snapshot: { id: string } } }

    const listResponse = await app.request(`/revisions/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)

    const restoreResponse = await app.request(
      `/revisions/${projectId}/restore/${snapshot.data.snapshot.id}`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
      },
    )
    expect(restoreResponse.status).toBe(200)
  })
})
