import { TaskRouter } from '@escaperoomninja/ai'
import { createDbClient } from '@escaperoomninja/db'
import { Hono } from 'hono'

import { AudienceService } from './audience/service'
import { DrizzleAudienceStore, InMemoryAudienceStore } from './audience/store'
import { AuthService } from './auth/service'
import { DrizzleAuthUserStore, InMemoryAuthUserStore } from './auth/store'
import { BusinessService } from './business/service'
import { CollaboratorService } from './collaborators/service'
import { DrizzleCollaboratorStore, InMemoryCollaboratorStore } from './collaborators/store'
import { ConceptService } from './concept/service'
import { ExportService } from './export/service'
import { GenerationQueueRuntime } from './generation/queue'
import { GenerationService } from './generation/service'
import { DrizzleGenerationJobStore, InMemoryGenerationJobStore } from './generation/store'
import { LayoutService } from './layout/service'
import { DrizzleLayoutStore, InMemoryLayoutStore } from './layout/store'
import { MaterialsService } from './materials/service'
import { DrizzleMaterialStore, InMemoryMaterialStore } from './materials/store'
import { NarrativeService } from './narratives/service'
import { DrizzleNarrativeStore, InMemoryNarrativeStore } from './narratives/store'
import { PaymentService } from './payment/service'
import { ProjectService } from './projects/service'
import { DrizzleProjectStore, InMemoryProjectStore } from './projects/store'
import { PuzzleService } from './puzzles/service'
import { DrizzlePuzzleStore, InMemoryPuzzleStore } from './puzzles/store'
import { RevisionService } from './revisions/service'
import { DrizzleRevisionStore, InMemoryRevisionStore } from './revisions/store'
import { createAudienceRoutes } from './routes/audience'
import { createAuthRoutes } from './routes/auth'
import { createBusinessRoutes } from './routes/business'
import { createCollaboratorRoutes } from './routes/collaborators'
import { createConceptRoutes } from './routes/concept'
import { createExportRoutes } from './routes/export'
import { createGenerationRoutes } from './routes/generation'
import { createLayoutRoutes } from './routes/layouts'
import { createMaterialsRoutes } from './routes/materials'
import { createNarrativeRoutes } from './routes/narratives'
import { createPaymentRoutes } from './routes/payments'
import { createPreviewRoutes } from './routes/preview'
import { createProjectRoutes } from './routes/projects'
import { createPuzzleRoutes } from './routes/puzzles'
import { createRevisionRoutes } from './routes/revisions'

const defaultSecret = process.env.AUTH_SECRET ?? 'local-dev-auth-secret-please-change'
const defaultModel = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'

export const createApp = (): Hono => {
  const app = new Hono()
  const db = process.env.DATABASE_URL ? createDbClient(process.env.DATABASE_URL) : null
  const authStore = db ? new DrizzleAuthUserStore(db) : new InMemoryAuthUserStore()
  const projectStore = db ? new DrizzleProjectStore(db) : new InMemoryProjectStore()
  const collaboratorStore = db ? new DrizzleCollaboratorStore(db) : new InMemoryCollaboratorStore()
  const revisionStore = db ? new DrizzleRevisionStore(db) : new InMemoryRevisionStore()
  const layoutStore = db ? new DrizzleLayoutStore(db) : new InMemoryLayoutStore()
  const narrativeStore = db ? new DrizzleNarrativeStore(db) : new InMemoryNarrativeStore()
  const puzzleStore = db ? new DrizzlePuzzleStore(db) : new InMemoryPuzzleStore()
  const materialStore = db ? new DrizzleMaterialStore(db) : new InMemoryMaterialStore()
  const audienceStore = db ? new DrizzleAudienceStore(db) : new InMemoryAudienceStore()
  const generationJobStore = db
    ? new DrizzleGenerationJobStore(db)
    : new InMemoryGenerationJobStore()
  const authService = new AuthService(authStore, defaultSecret)
  const projectService = new ProjectService(projectStore)
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
    audienceStore,
    projectService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const puzzleService = new PuzzleService(
    puzzleStore,
    projectService,
    audienceService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const narrativeService = new NarrativeService(
    narrativeStore,
    projectService,
    taskRouter.getTextProvider(),
    taskRouter.getTextModel(),
  )
  const layoutService = new LayoutService(layoutStore, projectService)
  const generationQueue = new GenerationQueueRuntime(generationJobStore)
  const generationService = new GenerationService(projectService, generationQueue)
  const materialsService = new MaterialsService(
    materialStore,
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
  const exportService = new ExportService(projectService, generationService)
  const paymentService = new PaymentService(projectService)
  const collaboratorService = new CollaboratorService(projectService, collaboratorStore)
  const revisionService = new RevisionService(projectService, revisionStore)

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
  app.route('/payments', createPaymentRoutes(authService, paymentService))
  app.route('/export', createExportRoutes(authService, exportService))
  app.route('/collaborators', createCollaboratorRoutes(authService, collaboratorService))
  app.route('/revisions', createRevisionRoutes(authService, revisionService))
  app.route('/narratives', createNarrativeRoutes(authService, narrativeService))
  app.route('/preview', createPreviewRoutes(authService, projectService))
  app.route('/layouts', createLayoutRoutes(authService, layoutService))

  return app
}
