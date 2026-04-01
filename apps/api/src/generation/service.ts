import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { GenerationQueueRuntime, QueueAssetRequest } from './queue'
import type { GenerationEvent, GenerationJobRecord } from './types'

const assetChecklist: QueueAssetRequest[] = [
  { assetType: 'text', assetName: 'master-plan' },
  { assetType: 'image', assetName: 'mood-board' },
  { assetType: 'audio', assetName: 'narration' },
  { assetType: 'music', assetName: 'ambient-track' },
  { assetType: 'diagram', assetName: 'puzzle-flow' },
  { assetType: 'pdf', assetName: 'print-pack' },
  { assetType: 'stl', assetName: '3d-part' },
  { assetType: 'video', assetName: 'intro-cut' },
]

export class GenerationService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly queueRuntime: GenerationQueueRuntime,
  ) {}

  async start(session: AuthSession, projectId: string): Promise<{ runId: string }> {
    await this.projectService.getById(session, projectId)
    const runId = await this.queueRuntime.enqueue(projectId, assetChecklist)
    return { runId }
  }

  async list(session: AuthSession, projectId: string): Promise<GenerationJobRecord[]> {
    await this.projectService.getById(session, projectId)
    return await this.queueRuntime.list(projectId)
  }

  subscribe(projectId: string, listener: (event: GenerationEvent) => void): () => void {
    return this.queueRuntime.subscribe(projectId, listener)
  }
}
