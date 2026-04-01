import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { CollaboratorStore } from './store'
import type { CollaboratorComment, CollaboratorRecord } from './types'

export class CollaboratorService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly store: CollaboratorStore,
  ) {}

  async invite(
    session: AuthSession,
    projectId: string,
    email: string,
    role: CollaboratorRecord['role'],
  ): Promise<CollaboratorRecord> {
    await this.projectService.getById(session, projectId)
    return await this.store.invite(projectId, email, role)
  }

  async list(session: AuthSession, projectId: string): Promise<CollaboratorRecord[]> {
    await this.projectService.getById(session, projectId)
    return await this.store.list(projectId)
  }

  async addComment(
    session: AuthSession,
    projectId: string,
    content: string,
  ): Promise<CollaboratorComment> {
    await this.projectService.getById(session, projectId)
    return await this.store.addComment(projectId, session.email, content)
  }

  async listComments(session: AuthSession, projectId: string): Promise<CollaboratorComment[]> {
    await this.projectService.getById(session, projectId)
    return await this.store.listComments(projectId)
  }
}
