import type { AssetWorker } from './types'

export const diagramGenerationWorker: AssetWorker = async (payload) => {
  if (payload.attempt === 1) {
    return {
      outputUrl: '',
      summary: 'Initial diagram render failed quality gate.',
    }
  }

  return {
    outputUrl: `https://assets.escaperoomninja.local/${payload.projectId}/diagrams/${payload.assetName}.svg`,
    summary: `Generated diagram asset ${payload.assetName} on attempt ${payload.attempt}.`,
  }
}
