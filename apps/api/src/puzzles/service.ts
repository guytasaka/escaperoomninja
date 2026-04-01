import type { AIProvider } from '@escaperoomninja/ai'

import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { AudienceService } from '../audience/service'
import type { PuzzleStore } from './store'
import type { NewPuzzleInput, PuzzleRecord } from './types'

export class PuzzleService {
  constructor(
    private readonly puzzleStore: PuzzleStore,
    private readonly projectService: ProjectService,
    private readonly audienceService: AudienceService,
    private readonly textProvider: AIProvider,
    private readonly model: string,
  ) {}

  async generate(
    session: AuthSession,
    input: { projectId: string; count: number },
  ): Promise<PuzzleRecord[]> {
    const project = await this.projectService.getById(session, input.projectId)
    const audience = await this.audienceService.getByProject(session, input.projectId)

    const generated = await this.textProvider.generateText({
      model: this.model,
      systemPrompt:
        'You are an escape room puzzle architect. Return practical puzzle concepts with clear objective and interaction style.',
      userPrompt: [
        `Project: ${project.name}`,
        `Genre: ${project.genre}`,
        `Room type: ${project.roomType}`,
        `Target count: ${input.count}`,
        audience
          ? `Audience: ${audience.audienceType}, difficulty ${audience.difficulty}, group ${audience.groupSize}`
          : 'Audience: not provided yet',
      ].join('\n'),
    })

    const lines = generated.content
      .split(/\n|\./)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const fallback = [
      'Cipher Lock Sequence',
      'Hidden Light Pattern',
      'Mechanical Relay Puzzle',
      'Artifact Ordering Challenge',
      'Audio Frequency Decoder',
    ]

    const source = lines.length ? lines : fallback

    const puzzleInputs: NewPuzzleInput[] = Array.from({ length: input.count }).map((_, index) => {
      const title = source[index % source.length] ?? `Puzzle ${index + 1}`
      return {
        projectId: project.id,
        ownerId: session.userId,
        title,
        type: index % 2 === 0 ? 'logic' : 'search',
        difficulty: audience?.difficulty ?? 'medium',
        estimatedMinutes: 8 + index * 3,
        description: `Solve ${title.toLowerCase()} to unlock the next stage.`,
        order: index + 1,
      }
    })

    return await this.puzzleStore.replaceProject(project.id, puzzleInputs)
  }

  async list(session: AuthSession, projectId: string): Promise<PuzzleRecord[]> {
    await this.projectService.getById(session, projectId)
    return await this.puzzleStore.listByProject(projectId)
  }

  async update(
    session: AuthSession,
    puzzleId: string,
    projectId: string,
    input: Partial<
      Pick<
        PuzzleRecord,
        'title' | 'type' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'
      >
    >,
  ): Promise<PuzzleRecord | null> {
    await this.projectService.getById(session, projectId)
    return await this.puzzleStore.update(puzzleId, input)
  }
}
