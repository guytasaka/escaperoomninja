import { TaskRouter } from '@escaperoomninja/ai'
import { Hono } from 'hono'

import { AudienceService } from './audience/service'
import { InMemoryAudienceStore } from './audience/store'
import { AuthService } from './auth/service'
import { InMemoryAuthUserStore } from './auth/store'
import { ConceptService } from './concept/service'
import { ProjectService } from './projects/service'
import { InMemoryProjectStore } from './projects/store'
import { PuzzleService } from './puzzles/service'
import { InMemoryPuzzleStore } from './puzzles/store'
import { createAudienceRoutes } from './routes/audience'
import { createAuthRoutes } from './routes/auth'
import { createConceptRoutes } from './routes/concept'
import { createProjectRoutes } from './routes/projects'
import { createPuzzleRoutes } from './routes/puzzles'

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
  const audienceService = new AudienceService(
    new InMemoryAudienceStore(),
    projectService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const puzzleService = new PuzzleService(
    new InMemoryPuzzleStore(),
    projectService,
    audienceService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )

  app.get('/health', (c) => {
    return c.json({ data: { ok: true } })
  })

  app.route('/auth', createAuthRoutes(authService))
  app.route('/projects', createProjectRoutes(authService, projectService))
  app.route('/concept', createConceptRoutes(authService, projectService, conceptService))
  app.route('/audience', createAudienceRoutes(authService, audienceService))
  app.route('/puzzles', createPuzzleRoutes(authService, puzzleService))

  return app
}
