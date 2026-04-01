import { TaskRouter } from '@escaperoomninja/ai'
import { Hono } from 'hono'

import { AudienceService } from './audience/service'
import { InMemoryAudienceStore } from './audience/store'
import { AuthService } from './auth/service'
import { InMemoryAuthUserStore } from './auth/store'
import { BusinessService } from './business/service'
import { ConceptService } from './concept/service'
import { GenerationQueueRuntime } from './generation/queue'
import { GenerationService } from './generation/service'
import { LayoutService } from './layout/service'
import { InMemoryLayoutStore } from './layout/store'
import { MaterialsService } from './materials/service'
import { InMemoryMaterialStore } from './materials/store'
import { NarrativeService } from './narratives/service'
import { InMemoryNarrativeStore } from './narratives/store'
import { ProjectService } from './projects/service'
import { InMemoryProjectStore } from './projects/store'
import { PuzzleService } from './puzzles/service'
import { InMemoryPuzzleStore } from './puzzles/store'
import { createAudienceRoutes } from './routes/audience'
import { createAuthRoutes } from './routes/auth'
import { createBusinessRoutes } from './routes/business'
import { createConceptRoutes } from './routes/concept'
import { createGenerationRoutes } from './routes/generation'
import { createLayoutRoutes } from './routes/layouts'
import { createMaterialsRoutes } from './routes/materials'
import { createNarrativeRoutes } from './routes/narratives'
import { createPreviewRoutes } from './routes/preview'
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
  const narrativeService = new NarrativeService(
    new InMemoryNarrativeStore(),
    projectService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const layoutService = new LayoutService(new InMemoryLayoutStore(), projectService)
  const generationQueue = new GenerationQueueRuntime()
  const generationService = new GenerationService(projectService, generationQueue)
  const materialsService = new MaterialsService(
    new InMemoryMaterialStore(),
    projectService,
    puzzleService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const businessService = new BusinessService(
    projectService,
    materialsService,
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
  app.route('/generation', createGenerationRoutes(authService, generationService))
  app.route('/materials', createMaterialsRoutes(authService, materialsService))
  app.route('/business', createBusinessRoutes(authService, businessService))
  app.route('/narratives', createNarrativeRoutes(authService, narrativeService))
  app.route('/preview', createPreviewRoutes(authService, projectService))
  app.route('/layouts', createLayoutRoutes(authService, layoutService))

  return app
}
