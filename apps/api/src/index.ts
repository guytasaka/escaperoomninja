import { TaskRouter } from '@escaperoomninja/ai'
import { Hono } from 'hono'

import { AuthService } from './auth/service'
import { InMemoryAuthUserStore } from './auth/store'
import { ConceptService } from './concept/service'
import { ProjectService } from './projects/service'
import { InMemoryProjectStore } from './projects/store'
import { createAuthRoutes } from './routes/auth'
import { createConceptRoutes } from './routes/concept'
import { createProjectRoutes } from './routes/projects'

const defaultSecret = process.env.AUTH_SECRET ?? 'local-dev-auth-secret-please-change'
const defaultModel = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'

export const createApp = (): Hono => {
  const app = new Hono()
  const authService = new AuthService(new InMemoryAuthUserStore(), defaultSecret)
  const projectService = new ProjectService(new InMemoryProjectStore())
  const taskRouter = new TaskRouter({
    llmModel: defaultModel,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    openAiApiKey: process.env.OPENAI_API_KEY,
  })
  const conceptService = new ConceptService(
    taskRouter.getTextProvider(),
    taskRouter.getImageProvider(),
    taskRouter.getTextModel(),
  )

  app.get('/health', (c) => {
    return c.json({ data: { ok: true } })
  })

  app.route('/auth', createAuthRoutes(authService))
  app.route('/projects', createProjectRoutes(authService, projectService))
  app.route('/concept', createConceptRoutes(authService, projectService, conceptService))

  return app
}
