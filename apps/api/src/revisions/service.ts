import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { RevisionStore } from './store'
import type { RevisionSnapshot } from './types'

export class RevisionService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly store: RevisionStore,
  ) {}

  async create(
    session: AuthSession,
    projectId: string,
    label: string,
    payload: Record<string, unknown>,
  ): Promise<RevisionSnapshot> {
    await this.projectService.getById(session, projectId)
    return await this.store.create(projectId, label, payload)
  }

  async list(session: AuthSession, projectId: string): Promise<RevisionSnapshot[]> {
    await this.projectService.getById(session, projectId)
    return await this.store.list(projectId)
  }

  async restore(
    session: AuthSession,
    projectId: string,
    revisionId: string,
  ): Promise<RevisionSnapshot | null> {
    await this.projectService.getById(session, projectId)
    return await this.store.getById(projectId, revisionId)
  }
}
