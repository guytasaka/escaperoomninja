import type { GenerationJobCard } from '../types'

const renderJob = (job: GenerationJobCard): string => {
  const output = job.outputUrl ? `<a href="${job.outputUrl}">${job.assetName}</a>` : job.assetName
  return `<li>${job.assetType}: ${output} - ${job.status} (attempt ${job.attempt}/${job.maxAttempts})</li>`
}

export const renderGenerationDashboard = (jobs: GenerationJobCard[]): string => {
  const total = jobs.length
  const complete = jobs.filter((job) => job.status === 'complete').length
  const failed = jobs.filter((job) => job.status === 'failed').length
  const processing = jobs.filter((job) => job.status === 'processing').length

  const body = jobs.length
    ? `<ul>${jobs.map((job) => renderJob(job)).join('')}</ul>`
    : '<p>No generation jobs queued yet.</p>'

  return [
    '<main>',
    '<h1>Generation Dashboard</h1>',
    '<button type="button">Start Full Generation</button>',
    `<p>Total: ${total} | Complete: ${complete} | Processing: ${processing} | Failed: ${failed}</p>`,
    body,
    '</main>',
  ].join('')
}
