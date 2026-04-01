import type { AssetWorker } from './types'

export const audioGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/audio/${payload.assetName}.mp3`,
    summary: `Generated audio asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
