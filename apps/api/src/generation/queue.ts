import { randomUUID } from 'node:crypto'

import { Queue } from 'bullmq'
import IORedis from 'ioredis'

import { workersByAssetType } from '../workers'
import { GenerationEventBus } from './event-bus'
import { passesQualityGate } from './quality-gates'
import type { GenerationAssetType, GenerationEvent, GenerationJobRecord } from './types'

export interface QueueAssetRequest {
  assetType: GenerationAssetType
  assetName: string
  maxAttempts?: number
}

export class GenerationQueueRuntime {
  private readonly jobsByProject = new Map<string, GenerationJobRecord[]>()
  private readonly eventBus = new GenerationEventBus()
  private readonly queue: Queue | null

  constructor() {
    const redisUrl = process.env.REDIS_URL
    if (redisUrl) {
      const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
      this.queue = new Queue('generation-jobs', { connection })
      return
    }

    this.queue = null
  }

  enqueue(projectId: string, requests: QueueAssetRequest[]): string {
    const runId = randomUUID()
    const existing = this.jobsByProject.get(projectId) ?? []
    const queuedJobs: GenerationJobRecord[] = requests.map((request) => ({
      id: randomUUID(),
      projectId,
      assetType: request.assetType,
      assetName: request.assetName,
      status: 'queued',
      attempt: 0,
      maxAttempts: request.maxAttempts ?? 2,
      outputUrl: null,
      error: null,
      updatedAt: new Date(),
    }))

    this.jobsByProject.set(projectId, [...existing, ...queuedJobs])
    for (const job of queuedJobs) {
      this.publish(projectId, job)
      void this.processJob(job)
    }

    return runId
  }

  list(projectId: string): GenerationJobRecord[] {
    return this.jobsByProject.get(projectId) ?? []
  }

  subscribe(projectId: string, listener: (event: GenerationEvent) => void): () => void {
    return this.eventBus.subscribe(projectId, listener)
  }

  private async processJob(job: GenerationJobRecord): Promise<void> {
    const worker = workersByAssetType[job.assetType]
    for (let attempt = 1; attempt <= job.maxAttempts; attempt += 1) {
      this.update(job.projectId, job.id, {
        status: 'processing',
        attempt,
        error: null,
      })

      try {
        const result = await worker({
          projectId: job.projectId,
          assetName: job.assetName,
          assetType: job.assetType,
          attempt,
        })
        const quality = passesQualityGate(job.assetType, result)
        if (!quality.ok) {
          if (attempt === job.maxAttempts) {
            this.update(job.projectId, job.id, {
              status: 'failed',
              error: quality.reason,
              outputUrl: null,
            })
            return
          }

          continue
        }

        this.update(job.projectId, job.id, {
          status: 'complete',
          outputUrl: result.outputUrl,
          error: null,
        })
        return
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown generation error'
        if (attempt === job.maxAttempts) {
          this.update(job.projectId, job.id, {
            status: 'failed',
            error: message,
            outputUrl: null,
          })
          return
        }
      }
    }
  }

  private update(
    projectId: string,
    jobId: string,
    patch: Partial<Pick<GenerationJobRecord, 'status' | 'attempt' | 'outputUrl' | 'error'>>,
  ): void {
    const projectJobs = this.jobsByProject.get(projectId)
    if (!projectJobs) {
      return
    }

    const target = projectJobs.find((job) => job.id === jobId)
    if (!target) {
      return
    }

    Object.assign(target, patch)
    target.updatedAt = new Date()
    this.publish(projectId, target)
  }

  private publish(projectId: string, job: GenerationJobRecord): void {
    this.eventBus.publish({
      projectId,
      type: 'job-updated',
      job,
    })
  }
}
