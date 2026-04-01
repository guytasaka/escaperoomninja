import type { AssetWorker } from './types'

export const imageGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/images/${payload.assetName}.png`,
    summary: `Generated image asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
