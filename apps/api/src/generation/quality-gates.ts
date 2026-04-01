import type { GeneratedAsset, GenerationAssetType } from './types'

export const passesQualityGate = (
  assetType: GenerationAssetType,
  generated: GeneratedAsset,
): { ok: boolean; reason: string | null } => {
  if (!generated.outputUrl.trim()) {
    return { ok: false, reason: 'Missing output URL' }
  }

  if (assetType === 'text' && generated.summary.length < 20) {
    return { ok: false, reason: 'Text output too short' }
  }

  return { ok: true, reason: null }
}
