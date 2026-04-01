import { randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'

import { type AppDb, revisions, withTransaction } from '@escaperoomninja/db'

import type { RevisionSnapshot } from './types'

export interface RevisionStore {
  create(
    projectId: string,
    label: string,
    payload: Record<string, unknown>,
  ): Promise<RevisionSnapshot>
  list(projectId: string): Promise<RevisionSnapshot[]>
  getById(projectId: string, revisionId: string): Promise<RevisionSnapshot | null>
}

export class InMemoryRevisionStore implements RevisionStore {
  private readonly revisionsByProject = new Map<string, RevisionSnapshot[]>()

  async create(
    projectId: string,
    label: string,
    payload: Record<string, unknown>,
  ): Promise<RevisionSnapshot> {
    const snapshot: RevisionSnapshot = {
      id: randomUUID(),
      projectId,
      label,
      payload,
      createdAt: new Date(),
    }
    const existing = this.revisionsByProject.get(projectId) ?? []
    this.revisionsByProject.set(projectId, [...existing, snapshot])
    return snapshot
  }

  async list(projectId: string): Promise<RevisionSnapshot[]> {
    return this.revisionsByProject.get(projectId) ?? []
  }

  async getById(projectId: string, revisionId: string): Promise<RevisionSnapshot | null> {
    const list = this.revisionsByProject.get(projectId) ?? []
    return list.find((item) => item.id === revisionId) ?? null
  }
}

export class DrizzleRevisionStore implements RevisionStore {
  constructor(private readonly db: AppDb) {}

  async create(
    projectId: string,
    label: string,
    payload: Record<string, unknown>,
  ): Promise<RevisionSnapshot> {
    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(revisions)
        .values({
          projectId,
          label,
          payload,
        })
        .returning()
    })

    const row = inserted[0]
    if (!row) {
      throw new Error('REVISION_CREATE_FAILED')
    }

    return {
      id: row.id,
      projectId: row.projectId,
      label: row.label,
      payload: row.payload,
      createdAt: row.createdAt,
    }
  }

  async list(projectId: string): Promise<RevisionSnapshot[]> {
    const rows = await this.db.query.revisions.findMany({
      where: eq(revisions.projectId, projectId),
      orderBy: desc(revisions.createdAt),
    })

    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      label: row.label,
      payload: row.payload,
      createdAt: row.createdAt,
    }))
  }

  async getById(projectId: string, revisionId: string): Promise<RevisionSnapshot | null> {
    const row = await this.db.query.revisions.findFirst({
      where: and(eq(revisions.id, revisionId), eq(revisions.projectId, projectId)),
    })

    if (!row) {
      return null
    }

    return {
      id: row.id,
      projectId: row.projectId,
      label: row.label,
      payload: row.payload,
      createdAt: row.createdAt,
    }
  }
}
