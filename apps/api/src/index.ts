import { Hono } from 'hono'

import { AuthService } from './auth/service'
import { InMemoryAuthUserStore } from './auth/store'
import { ProjectService } from './projects/service'
import { InMemoryProjectStore } from './projects/store'
import { createAuthRoutes } from './routes/auth'
import { createProjectRoutes } from './routes/projects'

const defaultSecret = process.env.AUTH_SECRET ?? 'local-dev-auth-secret-please-change'

export const createApp = (): Hono => {
  const app = new Hono()
  const authService = new AuthService(new InMemoryAuthUserStore(), defaultSecret)
  const projectService = new ProjectService(new InMemoryProjectStore())

  app.get('/health', (c) => {
    return c.json({ data: { ok: true } })
  })

  app.route('/auth', createAuthRoutes(authService))
  app.route('/projects', createProjectRoutes(authService, projectService))

  return app
}
