import type { AIProvider } from '@escaperoomninja/ai'

import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

import type { NarrativeStore } from './store'
import type { NarrativeCategory, NarrativeScript } from './types'

const categories: Array<{ category: NarrativeCategory; title: string }> = [
  { category: 'intro', title: 'Intro Script' },
  { category: 'hint', title: 'Hint Ladder' },
  { category: 'gm', title: 'Game Master Guide' },
  { category: 'ending', title: 'Ending Script' },
]

export class NarrativeService {
  constructor(
    private readonly narrativeStore: NarrativeStore,
    private readonly projectService: ProjectService,
    private readonly textProvider: AIProvider,
    private readonly model: string,
  ) {}

  async generate(
    session: AuthSession,
    input: { projectId: string; tone?: string },
  ): Promise<NarrativeScript[]> {
    const project = await this.projectService.getById(session, input.projectId)
    const generated = await this.textProvider.generateText({
      model: this.model,
      systemPrompt:
        'You are an escape room narrative writer. Create concise, practical scripts for operation and immersive storytelling.',
      userPrompt: [
        `Project: ${project.name}`,
        `Genre: ${project.genre}`,
        `Room type: ${project.roomType}`,
        `Tone: ${input.tone ?? 'cinematic and clear'}`,
      ].join('\n'),
    })

    const scripts = categories.map((item) => ({
      category: item.category,
      title: item.title,
      content: `${item.title}: ${generated.content}`,
    }))

    return await this.narrativeStore.replaceProject(project.id, session.userId, scripts)
  }

  async list(session: AuthSession, projectId: string): Promise<NarrativeScript[]> {
    await this.projectService.getById(session, projectId)
    return await this.narrativeStore.listByProject(projectId)
  }

  async update(
    session: AuthSession,
    projectId: string,
    scriptId: string,
    content: string,
  ): Promise<NarrativeScript | null> {
    await this.projectService.getById(session, projectId)
    return await this.narrativeStore.update(scriptId, projectId, content)
  }
}
