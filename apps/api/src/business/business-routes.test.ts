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
    body: JSON.stringify({ name: 'Business Room', genre: 'mystery', roomType: 'single-room' }),
  })
  return (await response.json()) as { data: { project: { id: string } } }
}

describe('business routes', () => {
  it('generates business planning document sections', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'business@example.com')
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    await app.request('/puzzles/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, count: 2 }),
    })
    await app.request('/materials/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })

    const response = await app.request('/business/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })

    expect(response.status).toBe(200)
    const payload = (await response.json()) as {
      data: {
        plan: { pricingStrategy: string; financialProjection: string; marketingPlan: string }
      }
    }
    expect(payload.data.plan.pricingStrategy).toContain('Set ticket pricing')
    expect(payload.data.plan.financialProjection).toContain('Break-even target')
    expect(payload.data.plan.marketingPlan).toContain('Launch campaign')
  })
})
