export type GenerationAssetType =
  | 'text'
  | 'image'
  | 'audio'
  | 'music'
  | 'diagram'
  | 'pdf'
  | 'stl'
  | 'video'

export type GenerationStatus = 'queued' | 'processing' | 'complete' | 'failed'

export interface GenerationJobRecord {
  id: string
  projectId: string
  assetType: GenerationAssetType
  assetName: string
  status: GenerationStatus
  attempt: number
  maxAttempts: number
  outputUrl: string | null
  error: string | null
  updatedAt: Date
}

export interface GenerationEvent {
  projectId: string
  type: 'job-updated'
  job: GenerationJobRecord
}

export interface GeneratedAsset {
  outputUrl: string
  summary: string
}
