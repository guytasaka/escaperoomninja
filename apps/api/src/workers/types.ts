import type { GeneratedAsset, GenerationAssetType } from '../generation/types'

export interface WorkerPayload {
  projectId: string
  assetName: string
  assetType: GenerationAssetType
  attempt: number
}

export type AssetWorker = (payload: WorkerPayload) => Promise<GeneratedAsset>
