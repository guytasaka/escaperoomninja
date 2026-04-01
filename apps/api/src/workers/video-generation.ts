import type { AssetWorker } from './types'

export const videoGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/video/${payload.assetName}.mp4`,
    summary: `Generated video asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
