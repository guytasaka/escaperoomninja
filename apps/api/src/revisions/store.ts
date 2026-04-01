import { randomUUID } from 'node:crypto'

import type { RevisionSnapshot } from './types'

export class InMemoryRevisionStore {
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
