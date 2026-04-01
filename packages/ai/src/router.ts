import type { AIProvider, ImageProvider } from './providers/base'
import { MockImageProvider } from './providers/mock-image'
import { MockTextProvider } from './providers/mock-text'
import { OpenAIImageProvider } from './providers/openai-image'
import { OpenRouterProvider } from './providers/openrouter'

export interface AIModelConfig {
  llmModel: string
  openRouterApiKey?: string
  openAiApiKey?: string
}

export class TaskRouter {
  constructor(private readonly config: AIModelConfig) {}

  getTextProvider(): AIProvider {
    if (this.config.openRouterApiKey) {
      return new OpenRouterProvider(this.config.openRouterApiKey)
    }

    return new MockTextProvider()
  }

  getTextModel(): string {
    return this.config.llmModel
  }

  getImageProvider(): ImageProvider {
    if (this.config.openAiApiKey) {
      return new OpenAIImageProvider(this.config.openAiApiKey)
    }

    return new MockImageProvider()
  }
}
