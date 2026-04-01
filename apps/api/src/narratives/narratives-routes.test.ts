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
    body: JSON.stringify({ name: 'Narrative Room', genre: 'mystery', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('narrative routes', () => {
  it('generates, lists, and edits narrative scripts', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'narrative@example.com')
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    const generateResponse = await app.request('/narratives/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, tone: 'dramatic' }),
    })
    expect(generateResponse.status).toBe(200)
    const generated = (await generateResponse.json()) as {
      data: { scripts: Array<{ id: string; content: string }> }
    }
    expect(generated.data.scripts.length).toBe(4)

    const listResponse = await app.request(`/narratives/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)

    const patchResponse = await app.request(
      `/narratives/${generated.data.scripts[0]?.id}?projectId=${projectId}`,
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: 'Updated narrative script' }),
      },
    )
    expect(patchResponse.status).toBe(200)
  })
})
