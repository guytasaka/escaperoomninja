import type { AIProvider } from '@escaperoomninja/ai'

import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { AudienceStore } from './store'
import type { AudienceProfile } from './types'

export class AudienceService {
  constructor(
    private readonly audienceStore: AudienceStore,
    private readonly projectService: ProjectService,
    private readonly textProvider: AIProvider,
    private readonly model: string,
  ) {}

  async generate(
    session: AuthSession,
    input: {
      projectId: string
      groupSize: number
      difficulty: AudienceProfile['difficulty']
      audienceType: AudienceProfile['audienceType']
    },
  ): Promise<AudienceProfile> {
    const project = await this.projectService.getById(session, input.projectId)

    const generated = await this.textProvider.generateText({
      model: this.model,
      systemPrompt:
        'You are an escape room audience strategist. Return concise player psychology and practical facilitation recommendations.',
      userPrompt: [
        `Project name: ${project.name}`,
        `Genre: ${project.genre}`,
        `Room type: ${project.roomType}`,
        `Group size: ${input.groupSize}`,
        `Difficulty: ${input.difficulty}`,
        `Audience type: ${input.audienceType}`,
      ].join('\n'),
    })

    const recommendations = generated.content
      .split(/\n|\./)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 4)

    const profile: AudienceProfile = {
      projectId: project.id,
      ownerId: session.userId,
      groupSize: input.groupSize,
      difficulty: input.difficulty,
      audienceType: input.audienceType,
      psychologyProfile: generated.content,
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              'Balance clue density to reduce frustration spikes.',
              'Use progressive hints to keep momentum for mixed-skill teams.',
            ],
      updatedAt: new Date(),
    }

    return await this.audienceStore.save(profile)
  }

  async getByProject(session: AuthSession, projectId: string): Promise<AudienceProfile | null> {
    await this.projectService.getById(session, projectId)
    return await this.audienceStore.findByProjectId(projectId)
  }
}
