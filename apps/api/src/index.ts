import { Hono } from 'hono'

import { AuthService } from './auth/service'
import { InMemoryAuthUserStore } from './auth/store'
import { createAuthRoutes } from './routes/auth'

const defaultSecret = process.env.AUTH_SECRET ?? 'local-dev-auth-secret-please-change'

export const createApp = (): Hono => {
  const app = new Hono()
  const authService = new AuthService(new InMemoryAuthUserStore(), defaultSecret)

  app.get('/health', (c) => {
    return c.json({ data: { ok: true } })
  })

  app.route('/auth', createAuthRoutes(authService))

  return app
}
