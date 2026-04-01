import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'

import { type AppDb, projects, withTransaction } from '@escaperoomninja/db'

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

export class DrizzleProjectStore implements ProjectStore {
  constructor(private readonly db: AppDb) {}

  async create(input: NewProjectInput): Promise<ProjectRecord> {
    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(projects)
        .values({
          ownerId: input.ownerId,
          name: input.name,
          genre: input.genre,
          roomType: input.roomType,
          status: 'draft',
        })
        .returning()
    })

    const row = inserted[0]
    if (!row) {
      throw new Error('PROJECT_CREATE_FAILED')
    }

    return mapProject(row)
  }

  async listByOwner(ownerId: string): Promise<ProjectRecord[]> {
    const rows = await this.db.query.projects.findMany({
      where: eq(projects.ownerId, ownerId),
      orderBy: desc(projects.updatedAt),
    })

    return rows.map((row) => mapProject(row))
  }

  async findById(id: string): Promise<ProjectRecord | null> {
    const row = await this.db.query.projects.findFirst({
      where: eq(projects.id, id),
    })

    return row ? mapProject(row) : null
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectRecord | null> {
    const updated = await withTransaction(this.db, async (tx) => {
      return await tx
        .update(projects)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning()
    })

    const row = updated[0]
    return row ? mapProject(row) : null
  }
}

const mapProject = (row: typeof projects.$inferSelect): ProjectRecord => {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    genre: row.genre,
    roomType: row.roomType,
    status: row.status === 'active' || row.status === 'archived' ? row.status : 'draft',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
