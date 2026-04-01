import { randomUUID } from 'node:crypto'

import { and, asc, eq } from 'drizzle-orm'

import { type AppDb, generationJobs, withTransaction } from '@escaperoomninja/db'

import type { GenerationAssetType, GenerationJobRecord, GenerationStatus } from './types'

export interface NewGenerationJobInput {
  projectId: string
  assetType: GenerationAssetType
  assetName: string
  maxAttempts: number
}

export interface GenerationJobStore {
  createMany(input: NewGenerationJobInput[]): Promise<GenerationJobRecord[]>
  listByProject(projectId: string): Promise<GenerationJobRecord[]>
  update(
    projectId: string,
    jobId: string,
    patch: Partial<Pick<GenerationJobRecord, 'status' | 'attempt' | 'outputUrl' | 'error'>>,
  ): Promise<GenerationJobRecord | null>
}

export class InMemoryGenerationJobStore implements GenerationJobStore {
  private readonly jobsByProject = new Map<string, GenerationJobRecord[]>()

  async createMany(input: NewGenerationJobInput[]): Promise<GenerationJobRecord[]> {
    const created = input.map((job) => ({
      id: randomUUID(),
      projectId: job.projectId,
      assetType: job.assetType,
      assetName: job.assetName,
      status: 'queued' as const,
      attempt: 0,
      maxAttempts: job.maxAttempts,
      outputUrl: null,
      error: null,
      updatedAt: new Date(),
    }))

    for (const record of created) {
      const existing = this.jobsByProject.get(record.projectId) ?? []
      this.jobsByProject.set(record.projectId, [...existing, record])
    }

    return created
  }

  async listByProject(projectId: string): Promise<GenerationJobRecord[]> {
    return this.jobsByProject.get(projectId) ?? []
  }

  async update(
    projectId: string,
    jobId: string,
    patch: Partial<Pick<GenerationJobRecord, 'status' | 'attempt' | 'outputUrl' | 'error'>>,
  ): Promise<GenerationJobRecord | null> {
    const records = this.jobsByProject.get(projectId) ?? []
    const target = records.find((job) => job.id === jobId)
    if (!target) {
      return null
    }

    Object.assign(target, patch)
    target.updatedAt = new Date()
    return target
  }
}

export class DrizzleGenerationJobStore implements GenerationJobStore {
  constructor(private readonly db: AppDb) {}

  async createMany(input: NewGenerationJobInput[]): Promise<GenerationJobRecord[]> {
    if (input.length === 0) {
      return []
    }

    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(generationJobs)
        .values(
          input.map((job) => ({
            projectId: job.projectId,
            assetType: job.assetType,
            assetName: job.assetName,
            status: 'queued',
            attempt: 0,
            maxAttempts: job.maxAttempts,
            outputUrl: null,
            error: null,
            updatedAt: new Date(),
          })),
        )
        .returning()
    })

    return inserted.map((row) => mapGenerationJob(row))
  }

  async listByProject(projectId: string): Promise<GenerationJobRecord[]> {
    const rows = await this.db.query.generationJobs.findMany({
      where: eq(generationJobs.projectId, projectId),
      orderBy: asc(generationJobs.updatedAt),
    })

    return rows.map((row) => mapGenerationJob(row))
  }

  async update(
    projectId: string,
    jobId: string,
    patch: Partial<Pick<GenerationJobRecord, 'status' | 'attempt' | 'outputUrl' | 'error'>>,
  ): Promise<GenerationJobRecord | null> {
    const updated = await withTransaction(this.db, async (tx) => {
      return await tx
        .update(generationJobs)
        .set({
          ...patch,
          updatedAt: new Date(),
        })
        .where(and(eq(generationJobs.id, jobId), eq(generationJobs.projectId, projectId)))
        .returning()
    })

    const row = updated[0]
    if (!row) {
      return null
    }

    return mapGenerationJob(row)
  }
}

const mapGenerationJob = (row: typeof generationJobs.$inferSelect): GenerationJobRecord => {
  return {
    id: row.id,
    projectId: row.projectId,
    assetType: mapAssetType(row.assetType),
    assetName: row.assetName,
    status: mapStatus(row.status),
    attempt: row.attempt,
    maxAttempts: row.maxAttempts,
    outputUrl: row.outputUrl,
    error: row.error,
    updatedAt: row.updatedAt,
  }
}

const mapStatus = (value: string): GenerationStatus => {
  if (value === 'queued' || value === 'processing' || value === 'failed') {
    return value
  }

  return 'complete'
}

const mapAssetType = (value: string): GenerationAssetType => {
  if (
    value === 'text' ||
    value === 'image' ||
    value === 'audio' ||
    value === 'music' ||
    value === 'diagram' ||
    value === 'pdf' ||
    value === 'stl'
  ) {
    return value
  }

  return 'video'
}
