import type { AIProvider, ImageProvider } from '@escaperoomninja/ai'

export class ConceptService {
  constructor(
    private readonly textProvider: AIProvider,
    private readonly imageProvider: ImageProvider,
    private readonly model: string,
  ) {}

  async generateConcept(input: {
    projectName: string
    genre: string
    roomType: string
    prompt: string
  }): Promise<string> {
    const result = await this.textProvider.generateText({
      model: this.model,
      systemPrompt:
        'You are an escape room creative director. Produce concise concept briefs with atmosphere and player objective.',
      userPrompt: [
        `Project: ${input.projectName}`,
        `Genre: ${input.genre}`,
        `Room Type: ${input.roomType}`,
        `Prompt: ${input.prompt}`,
      ].join('\n'),
    })

    return result.content
  }

  async generateMoodBoard(prompt: string): Promise<string[]> {
    const result = await this.imageProvider.generateImages({
      prompt,
      count: 3,
      width: 1024,
      height: 1024,
    })

    return result.urls
  }
}
