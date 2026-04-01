import type { AssetWorker } from './types'

export const stlGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/stl/${payload.assetName}.stl`,
    summary: `Generated stl asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
