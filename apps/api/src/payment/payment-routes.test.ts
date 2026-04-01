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

describe('payment routes', () => {
  it('creates checkout and validates webhook signature', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, 'payments@example.com')

    const projectResponse = await app.request('/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Payment Room', genre: 'mystery', roomType: 'single-room' }),
    })
    const project = (await projectResponse.json()) as { data: { project: { id: string } } }

    const checkoutResponse = await app.request('/payments/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId: project.data.project.id }),
    })
    expect(checkoutResponse.status).toBe(200)

    const webhookFail = await app.request('/payments/webhook', { method: 'POST' })
    expect(webhookFail.status).toBe(400)

    const webhookPass = await app.request('/payments/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_valid_example' },
    })
    expect(webhookPass.status).toBe(200)
  })
})
