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
    body: JSON.stringify({ name: 'Materials Room', genre: 'adventure', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('materials routes', () => {
  it('generates, enriches, updates, and summarizes materials', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'materials@example.com')
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    await app.request('/puzzles/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, count: 3 }),
    })

    const generateResponse = await app.request('/materials/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })
    expect(generateResponse.status).toBe(200)
    const generated = (await generateResponse.json()) as { data: { items: Array<{ id: string }> } }
    expect(generated.data.items.length).toBeGreaterThan(0)

    const enrichResponse = await app.request('/materials/enrich', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })
    expect(enrichResponse.status).toBe(200)

    const patchResponse = await app.request(
      `/materials/${generated.data.items[0]?.id}?projectId=${projectId}`,
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: 2, unitCost: 45 }),
      },
    )
    expect(patchResponse.status).toBe(200)

    const budgetResponse = await app.request(
      `/materials/${projectId}/budget?allocatedBudget=1500`,
      {
        headers: { authorization: `Bearer ${token}` },
      },
    )
    expect(budgetResponse.status).toBe(200)
    const budget = (await budgetResponse.json()) as { data: { summary: { totalCost: number } } }
    expect(budget.data.summary.totalCost).toBeGreaterThan(0)
  })
})
