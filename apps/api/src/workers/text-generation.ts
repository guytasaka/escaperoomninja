import type { AssetWorker } from './types'

export const textGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/text/${payload.assetName}.md`,
    summary: `Generated text asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
