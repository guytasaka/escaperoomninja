import { AIProvider, type TextGenerationConfig, type TextGenerationResult } from './base'

export class MockTextProvider extends AIProvider {
  async generateText(config: TextGenerationConfig): Promise<TextGenerationResult> {
    return {
      content: `Concept draft for prompt: ${config.userPrompt}`,
      model: 'mock-text',
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    }
  }

  async *generateTextStream(config: TextGenerationConfig): AsyncGenerator<string> {
    const text = `Concept draft for prompt: ${config.userPrompt}`
    yield text
  }
}
