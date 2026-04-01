import { randomUUID } from 'node:crypto'

import type { NewProjectInput, ProjectRecord, UpdateProjectInput } from './types'

export interface ProjectStore {
  create(input: NewProjectInput): Promise<ProjectRecord>
  listByOwner(ownerId: string): Promise<ProjectRecord[]>
  findById(id: string): Promise<ProjectRecord | null>
  update(id: string, input: UpdateProjectInput): Promise<ProjectRecord | null>
}

export class InMemoryProjectStore implements ProjectStore {
  private readonly projects = new Map<string, ProjectRecord>()

  async create(input: NewProjectInput): Promise<ProjectRecord> {
    const now = new Date()
    const project: ProjectRecord = {
      id: randomUUID(),
      ownerId: input.ownerId,
      name: input.name,
      genre: input.genre,
      roomType: input.roomType,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    }

    this.projects.set(project.id, project)
    return project
  }

  async listByOwner(ownerId: string): Promise<ProjectRecord[]> {
    return Array.from(this.projects.values())
      .filter((project) => project.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async findById(id: string): Promise<ProjectRecord | null> {
    return this.projects.get(id) ?? null
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectRecord | null> {
    const existing = this.projects.get(id)
    if (!existing) {
      return null
    }

    const updated: ProjectRecord = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    }

    this.projects.set(id, updated)
    return updated
  }
}
