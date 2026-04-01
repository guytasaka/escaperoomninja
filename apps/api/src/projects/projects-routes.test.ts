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
  expect(response.status).toBe(201)

  const json = (await response.json()) as { data: { token: string } }
  return json.data.token
}

describe('project routes', () => {
  it('creates, lists, reads, and patches project for owner', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, `owner-${Date.now()}@example.com`)

    const createResponse = await app.request('/projects', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Ninja Vault',
        genre: 'heist',
        roomType: 'single-room',
      }),
    })

    expect(createResponse.status).toBe(201)
    const created = (await createResponse.json()) as {
      data: { project: { id: string; name: string; ownerId: string } }
    }
    expect(created.data.project.name).toBe('Ninja Vault')

    const listResponse = await app.request('/projects', {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)
    const listed = (await listResponse.json()) as {
      data: { projects: Array<{ id: string }> }
    }
    expect(listed.data.projects).toHaveLength(1)

    const getResponse = await app.request(`/projects/${created.data.project.id}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(getResponse.status).toBe(200)

    const patchResponse = await app.request(`/projects/${created.data.project.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'active' }),
    })
    expect(patchResponse.status).toBe(200)
  })

  it('blocks access from non-owner user', async () => {
    const app = createApp()
    const ownerToken = await registerAndGetToken(app, `owner-${Date.now()}@example.com`)
    const otherToken = await registerAndGetToken(app, `other-${Date.now()}@example.com`)

    const createResponse = await app.request('/projects', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: 'Secret Room',
        genre: 'mystery',
        roomType: 'single-room',
      }),
    })
    const created = (await createResponse.json()) as { data: { project: { id: string } } }

    const forbiddenRead = await app.request(`/projects/${created.data.project.id}`, {
      headers: { authorization: `Bearer ${otherToken}` },
    })
    expect(forbiddenRead.status).toBe(403)
  })
})
