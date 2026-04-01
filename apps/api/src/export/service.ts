import type { AuthSession } from '../auth/types'
import type { GenerationService } from '../generation/service'
import type { ProjectService } from '../projects/service'

export interface ExportPackage {
  projectId: string
  zipUrl: string
  manifest: {
    generatedAt: string
    files: Array<{ assetName: string; outputUrl: string | null; status: string }>
  }
}

export class ExportService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly generationService: GenerationService,
  ) {}

  async packageProject(session: AuthSession, projectId: string): Promise<ExportPackage> {
    await this.projectService.getById(session, projectId)
    const jobs = await this.generationService.list(session, projectId)

    const zipUrl = `https://downloads.escaperoomninja.local/${projectId}/escape-room-package.zip`

    return {
      projectId,
      zipUrl,
      manifest: {
        generatedAt: new Date().toISOString(),
        files: jobs.map((job) => ({
          assetName: job.assetName,
          outputUrl: job.outputUrl,
          status: job.status,
        })),
      },
    }
  }
}
