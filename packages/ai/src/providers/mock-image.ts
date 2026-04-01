import { type ImageGenerationConfig, type ImageGenerationResult, ImageProvider } from './base'

export class MockImageProvider extends ImageProvider {
  async generateImages(config: ImageGenerationConfig): Promise<ImageGenerationResult> {
    const count = config.count ?? 3
    const safePrompt = encodeURIComponent(config.prompt.toLowerCase().replaceAll(' ', '-'))

    return {
      urls: Array.from({ length: count }, (_, index) => {
        return `https://images.escaperoomninja.local/moodboard/${safePrompt}/${index + 1}.png`
      }),
      provider: 'mock-image',
    }
  }
}
