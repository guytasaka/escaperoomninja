import { randomUUID } from 'node:crypto'

import type { CollaboratorComment, CollaboratorRecord } from './types'

export class InMemoryCollaboratorStore {
  private readonly collaboratorsByProject = new Map<string, CollaboratorRecord[]>()
  private readonly commentsByProject = new Map<string, CollaboratorComment[]>()

  async invite(
    projectId: string,
    email: string,
    role: CollaboratorRecord['role'],
  ): Promise<CollaboratorRecord> {
    const record: CollaboratorRecord = {
      id: randomUUID(),
      projectId,
      email,
      role,
      invitedAt: new Date(),
    }
    const existing = this.collaboratorsByProject.get(projectId) ?? []
    this.collaboratorsByProject.set(projectId, [...existing, record])
    return record
  }

  async list(projectId: string): Promise<CollaboratorRecord[]> {
    return this.collaboratorsByProject.get(projectId) ?? []
  }

  async addComment(
    projectId: string,
    authorEmail: string,
    content: string,
  ): Promise<CollaboratorComment> {
    const comment: CollaboratorComment = {
      id: randomUUID(),
      projectId,
      authorEmail,
      content,
      createdAt: new Date(),
    }
    const existing = this.commentsByProject.get(projectId) ?? []
    this.commentsByProject.set(projectId, [...existing, comment])
    return comment
  }

  async listComments(projectId: string): Promise<CollaboratorComment[]> {
    return this.commentsByProject.get(projectId) ?? []
  }
}
