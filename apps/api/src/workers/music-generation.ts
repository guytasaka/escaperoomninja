import type { AssetWorker } from './types'

export const musicGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/music/${payload.assetName}.mp3`,
    summary: `Generated music asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
