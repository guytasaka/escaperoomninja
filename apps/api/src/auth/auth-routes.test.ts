import { describe, expect, it } from 'vitest'

import { createApp } from '../index'

describe('auth routes', () => {
  it('registers, logs in, and resolves session', async () => {
    const app = createApp()

    const registerResponse = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@example.com',
        password: 'supersecret123',
      }),
    })

    expect(registerResponse.status).toBe(201)
    const registerJson = (await registerResponse.json()) as {
      data: { token: string; user: { email: string } }
    }
    expect(registerJson.data.user.email).toBe('owner@example.com')

    const loginResponse = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@example.com',
        password: 'supersecret123',
      }),
    })

    expect(loginResponse.status).toBe(200)
    const loginJson = (await loginResponse.json()) as { data: { token: string } }

    const sessionResponse = await app.request('/auth/session', {
      headers: { authorization: `Bearer ${loginJson.data.token}` },
    })
    expect(sessionResponse.status).toBe(200)

    const sessionJson = (await sessionResponse.json()) as {
      data: { session: { email: string } }
    }
    expect(sessionJson.data.session.email).toBe('owner@example.com')
  })

  it('rejects invalid credentials', async () => {
    const app = createApp()

    await app.request('/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@example.com',
        password: 'supersecret123',
      }),
    })

    const loginResponse = await app.request('/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@example.com',
        password: 'wrong-password',
      }),
    })

    expect(loginResponse.status).toBe(401)
  })
})
