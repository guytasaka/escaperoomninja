import { randomUUID } from 'node:crypto'

import { Queue } from 'bullmq'
import IORedis from 'ioredis'

import { workersByAssetType } from '../workers'
import { GenerationEventBus } from './event-bus'
import { passesQualityGate } from './quality-gates'
import type { GenerationJobStore } from './store'
import type { GenerationAssetType, GenerationEvent, GenerationJobRecord } from './types'

export interface QueueAssetRequest {
  assetType: GenerationAssetType
  assetName: string
  maxAttempts?: number
}

export class GenerationQueueRuntime {
  private readonly eventBus = new GenerationEventBus()
  private readonly queue: Queue | null

  constructor(private readonly store: GenerationJobStore) {
    const redisUrl = process.env.REDIS_URL
    if (redisUrl) {
      const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
      this.queue = new Queue('generation-jobs', { connection })
      return
    }

    this.queue = null
  }

  async enqueue(projectId: string, requests: QueueAssetRequest[]): Promise<string> {
    const runId = randomUUID()
    const queuedJobs = await this.store.createMany(
      requests.map((request) => ({
        projectId,
        assetType: request.assetType,
        assetName: request.assetName,
        maxAttempts: request.maxAttempts ?? 2,
      })),
    )

    for (const job of queuedJobs) {
      this.publish(projectId, job)
      void this.processJob(job)
    }

    return runId
  }

  async list(projectId: string): Promise<GenerationJobRecord[]> {
    return await this.store.listByProject(projectId)
  }

  subscribe(projectId: string, listener: (event: GenerationEvent) => void): () => void {
    return this.eventBus.subscribe(projectId, listener)
  }

  private async processJob(job: GenerationJobRecord): Promise<void> {
    const worker = workersByAssetType[job.assetType]
    for (let attempt = 1; attempt <= job.maxAttempts; attempt += 1) {
      await this.update(job.projectId, job.id, {
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
            await this.update(job.projectId, job.id, {
              status: 'failed',
              error: quality.reason,
              outputUrl: null,
            })
            return
          }

          continue
        }

        await this.update(job.projectId, job.id, {
          status: 'complete',
          outputUrl: result.outputUrl,
          error: null,
        })
        return
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown generation error'
        if (attempt === job.maxAttempts) {
          await this.update(job.projectId, job.id, {
            status: 'failed',
            error: message,
            outputUrl: null,
          })
          return
        }
      }
    }
  }

  private async update(
    projectId: string,
    jobId: string,
    patch: Partial<Pick<GenerationJobRecord, 'status' | 'attempt' | 'outputUrl' | 'error'>>,
  ): Promise<void> {
    const updated = await this.store.update(projectId, jobId, patch)
    if (updated) {
      this.publish(projectId, updated)
    }
  }

  private publish(projectId: string, job: GenerationJobRecord): void {
    this.eventBus.publish({
      projectId,
      type: 'job-updated',
      job,
    })
  }
}
