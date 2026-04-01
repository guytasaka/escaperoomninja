import { describe, expect, it } from 'vitest'

import { createApp } from '../index'

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

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
    body: JSON.stringify({ name: 'Generation Room', genre: 'sci-fi', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('generation routes', () => {
  it('queues generation jobs and tracks completion', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'generation@example.com')
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    const startResponse = await app.request('/generation/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })
    expect(startResponse.status).toBe(202)

    await sleep(30)

    const listResponse = await app.request(`/generation/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(listResponse.status).toBe(200)
    const listed = (await listResponse.json()) as {
      data: { jobs: Array<{ status: string; assetType: string; attempt: number }> }
    }

    expect(listed.data.jobs.length).toBe(8)
    expect(listed.data.jobs.some((job) => job.assetType === 'diagram' && job.attempt >= 2)).toBe(
      true,
    )
    expect(listed.data.jobs.every((job) => job.status === 'complete')).toBe(true)
  })
})
