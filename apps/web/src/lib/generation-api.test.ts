import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildGenerationStreamUrl, listGenerationJobs, startGeneration } from './api'

describe('generation api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts generation run and lists jobs', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { runId: 'run-1' } }), { status: 202 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              jobs: [
                {
                  id: 'j1',
                  projectId: 'p1',
                  assetType: 'text',
                  assetName: 'master-plan',
                  status: 'complete',
                  attempt: 1,
                  maxAttempts: 2,
                  outputUrl: 'https://assets.test/master-plan.md',
                  error: null,
                },
              ],
            },
          }),
          { status: 200 },
        ),
      )

    const started = await startGeneration('https://api.test', 'token', 'p1')
    expect(started.runId).toBe('run-1')

    const jobs = await listGenerationJobs('https://api.test', 'token', 'p1')
    expect(jobs.length).toBe(1)
    expect(jobs[0]?.status).toBe('complete')
  })

  it('builds generation stream url', () => {
    const url = buildGenerationStreamUrl('https://api.test', 'p1')
    expect(url).toBe('https://api.test/generation/p1/stream')
  })
})
