import type { GenerationAssetType } from '../generation/types'

import { audioGenerationWorker } from './audio-generation'
import { diagramGenerationWorker } from './diagram-generation'
import { imageGenerationWorker } from './image-generation'
import { musicGenerationWorker } from './music-generation'
import { pdfGenerationWorker } from './pdf-generation'
import { stlGenerationWorker } from './stl-generation'
import { textGenerationWorker } from './text-generation'
import type { AssetWorker } from './types'
import { videoGenerationWorker } from './video-generation'

export const workersByAssetType: Record<GenerationAssetType, AssetWorker> = {
  text: textGenerationWorker,
  image: imageGenerationWorker,
  audio: audioGenerationWorker,
  music: musicGenerationWorker,
  diagram: diagramGenerationWorker,
  pdf: pdfGenerationWorker,
  stl: stlGenerationWorker,
  video: videoGenerationWorker,
}
