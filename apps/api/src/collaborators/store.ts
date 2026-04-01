import { randomUUID } from 'node:crypto'
import { asc, eq } from 'drizzle-orm'

import {
  type AppDb,
  collaboratorComments,
  collaborators,
  withTransaction,
} from '@escaperoomninja/db'

import type { CollaboratorComment, CollaboratorRecord } from './types'

export interface CollaboratorStore {
  invite(
    projectId: string,
    email: string,
    role: CollaboratorRecord['role'],
  ): Promise<CollaboratorRecord>
  list(projectId: string): Promise<CollaboratorRecord[]>
  addComment(projectId: string, authorEmail: string, content: string): Promise<CollaboratorComment>
  listComments(projectId: string): Promise<CollaboratorComment[]>
}

export class InMemoryCollaboratorStore implements CollaboratorStore {
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

export class DrizzleCollaboratorStore implements CollaboratorStore {
  constructor(private readonly db: AppDb) {}

  async invite(
    projectId: string,
    email: string,
    role: CollaboratorRecord['role'],
  ): Promise<CollaboratorRecord> {
    const normalized = email.toLowerCase()
    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(collaborators)
        .values({
          projectId,
          email: normalized,
          role,
        })
        .returning()
    })

    const row = inserted[0]
    if (!row) {
      throw new Error('COLLABORATOR_INVITE_FAILED')
    }

    return {
      id: row.id,
      projectId: row.projectId,
      email: row.email,
      role: row.role === 'viewer' || row.role === 'editor' ? row.role : 'commenter',
      invitedAt: row.invitedAt,
    }
  }

  async list(projectId: string): Promise<CollaboratorRecord[]> {
    const rows = await this.db.query.collaborators.findMany({
      where: eq(collaborators.projectId, projectId),
      orderBy: asc(collaborators.invitedAt),
    })

    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      email: row.email,
      role: row.role === 'viewer' || row.role === 'editor' ? row.role : 'commenter',
      invitedAt: row.invitedAt,
    }))
  }

  async addComment(
    projectId: string,
    authorEmail: string,
    content: string,
  ): Promise<CollaboratorComment> {
    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(collaboratorComments)
        .values({
          projectId,
          authorEmail: authorEmail.toLowerCase(),
          content,
        })
        .returning()
    })

    const row = inserted[0]
    if (!row) {
      throw new Error('COLLABORATOR_COMMENT_CREATE_FAILED')
    }

    return {
      id: row.id,
      projectId: row.projectId,
      authorEmail: row.authorEmail,
      content: row.content,
      createdAt: row.createdAt,
    }
  }

  async listComments(projectId: string): Promise<CollaboratorComment[]> {
    const rows = await this.db.query.collaboratorComments.findMany({
      where: eq(collaboratorComments.projectId, projectId),
      orderBy: asc(collaboratorComments.createdAt),
    })

    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      authorEmail: row.authorEmail,
      content: row.content,
      createdAt: row.createdAt,
    }))
  }
}
