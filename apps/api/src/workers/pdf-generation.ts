import type { AssetWorker } from './types'

export const pdfGenerationWorker: AssetWorker = async (payload) => {
  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/pdf/${payload.assetName}.pdf`,
    summary: `Generated pdf asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
