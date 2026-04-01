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

export abstract class AIProvider {
  abstract generateText(config: TextGenerationConfig): Promise<TextGenerationResult>
  abstract generateTextStream(config: TextGenerationConfig): AsyncGenerator<string>
}
