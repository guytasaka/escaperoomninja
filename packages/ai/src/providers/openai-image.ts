import { type ImageGenerationConfig, type ImageGenerationResult, ImageProvider } from './base'

export class OpenAIImageProvider extends ImageProvider {
  constructor(
    private readonly apiKey: string,
    private readonly fetchFn: typeof fetch = fetch,
    private readonly apiUrl = 'https://api.openai.com/v1/images/generations',
  ) {
    super()
  }

  async generateImages(config: ImageGenerationConfig): Promise<ImageGenerationResult> {
    const response = await this.fetchFn(this.apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: config.prompt,
        n: config.count ?? 1,
        size: `${config.width ?? 1024}x${config.height ?? 1024}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI image request failed: ${response.status}`)
    }

    const payload = (await response.json()) as { data?: Array<{ url?: string }> }
    const urls = (payload.data ?? [])
      .map((item) => item.url)
      .filter((item): item is string => Boolean(item))

    return {
      urls,
      provider: 'openai-image',
    }
  }
}
