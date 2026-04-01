import type { AuthSession } from '../auth/types'

import type { ProjectStore } from './store'
import type { ProjectRecord, UpdateProjectInput } from './types'

export class ProjectError extends Error {
  constructor(
    readonly code: 'NOT_FOUND' | 'FORBIDDEN',
    message: string,
  ) {
    super(message)
  }
}

export class ProjectService {
  constructor(private readonly projectStore: ProjectStore) {}

  async create(
    session: AuthSession,
    input: { name: string; genre: string; roomType: string },
  ): Promise<ProjectRecord> {
    return await this.projectStore.create({
      ownerId: session.userId,
      name: input.name,
      genre: input.genre,
      roomType: input.roomType,
    })
  }

  async list(session: AuthSession): Promise<ProjectRecord[]> {
    return await this.projectStore.listByOwner(session.userId)
  }

  async getById(session: AuthSession, projectId: string): Promise<ProjectRecord> {
    const project = await this.projectStore.findById(projectId)
    if (!project) {
      throw new ProjectError('NOT_FOUND', 'Project not found')
    }

    if (project.ownerId !== session.userId) {
      throw new ProjectError('FORBIDDEN', 'Project is not accessible to this user')
    }

    return project
  }

  async update(
    session: AuthSession,
    projectId: string,
    input: UpdateProjectInput,
  ): Promise<ProjectRecord> {
    await this.getById(session, projectId)
    const updated = await this.projectStore.update(projectId, input)
    if (!updated) {
      throw new ProjectError('NOT_FOUND', 'Project not found')
    }

    return updated
  }
}
