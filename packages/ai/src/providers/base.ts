export interface TextGenerationConfig {
  model: string
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface TextGenerationResult {
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

export interface ImageGenerationConfig {
  prompt: string
  width?: number
  height?: number
  style?: string
  count?: number
}

export interface ImageGenerationResult {
  urls: string[]
  provider: string
}

export abstract class AIProvider {
  abstract generateText(config: TextGenerationConfig): Promise<TextGenerationResult>
  abstract generateTextStream(config: TextGenerationConfig): AsyncGenerator<string>
}

export abstract class ImageProvider {
  abstract generateImages(config: ImageGenerationConfig): Promise<ImageGenerationResult>
}
