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

describe('collaborator routes', () => {
  it('invites collaborators and stores comments', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'collab@example.com')

    const projectResponse = await app.request('/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Collab Room', genre: 'adventure', roomType: 'single-room' }),
    })
    const project = (await projectResponse.json()) as { data: { project: { id: string } } }
    const projectId = project.data.project.id

    const inviteResponse = await app.request('/collaborators/invite', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, email: 'teammate@example.com', role: 'commenter' }),
    })
    expect(inviteResponse.status).toBe(200)

    const commentResponse = await app.request('/collaborators/comment', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, content: 'Consider a stronger final reveal.' }),
    })
    expect(commentResponse.status).toBe(200)

    const listResponse = await app.request(`/collaborators/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)
    const payload = (await listResponse.json()) as {
      data: { collaborators: unknown[]; comments: unknown[] }
    }
    expect(payload.data.collaborators.length).toBe(1)
    expect(payload.data.comments.length).toBe(1)
  })
})
