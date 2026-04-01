import type { AIProvider } from '@escaperoomninja/ai'

import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'
import type { PuzzleService } from '../puzzles/service'

import type { MaterialStore } from './store'
import type { BudgetSummary, MaterialItem } from './types'

export class MaterialsService {
  constructor(
    private readonly materialStore: MaterialStore,
    private readonly projectService: ProjectService,
    private readonly puzzleService: PuzzleService,
    private readonly textProvider: AIProvider,
    private readonly model: string,
  ) {}

  async generate(session: AuthSession, projectId: string): Promise<MaterialItem[]> {
    await this.projectService.getById(session, projectId)
    const puzzles = await this.puzzleService.list(session, projectId)

    const baseItems: Omit<MaterialItem, 'id' | 'ownerId' | 'updatedAt'>[] = puzzles.map(
      (puzzle, index) => ({
        projectId,
        category: index % 2 === 0 ? 'props' : 'electronics',
        name: `${puzzle.title} Kit`,
        quantity: 1,
        unitCost: 20 + index * 12,
        vendorUrl: null,
        alternatives: [],
        threeDPrintable: index % 3 === 0,
      }),
    )

    return await this.materialStore.replaceProject(projectId, session.userId, baseItems)
  }

  async enrich(session: AuthSession, projectId: string): Promise<MaterialItem[]> {
    const items = await this.list(session, projectId)

    for (const item of items) {
      const generated = await this.textProvider.generateText({
        model: this.model,
        systemPrompt:
          'You enrich a materials list with vendor hints and two fallback alternatives. Keep responses concise.',
        userPrompt: `Item: ${item.name}\nCategory: ${item.category}`,
      })

      const safeSlug = encodeURIComponent(item.name.toLowerCase().replaceAll(' ', '-'))
      await this.materialStore.update(item.id, {
        vendorUrl: `https://shop.escaperoomninja.local/items/${safeSlug}`,
        alternatives: generated.content
          .split(/\n|\./)
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .slice(0, 2),
      })
    }

    return await this.list(session, projectId)
  }

  async list(session: AuthSession, projectId: string): Promise<MaterialItem[]> {
    await this.projectService.getById(session, projectId)
    return await this.materialStore.listByProject(projectId)
  }

  async update(
    session: AuthSession,
    projectId: string,
    itemId: string,
    input: Partial<
      Pick<MaterialItem, 'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'>
    >,
  ): Promise<MaterialItem | null> {
    await this.projectService.getById(session, projectId)
    return await this.materialStore.update(itemId, input)
  }

  async getBudgetSummary(
    session: AuthSession,
    projectId: string,
    allocatedBudget = 1200,
  ): Promise<BudgetSummary> {
    const items = await this.list(session, projectId)

    const totalsByCategory: BudgetSummary['totalsByCategory'] = {
      props: 0,
      electronics: 0,
      decor: 0,
      tools: 0,
      misc: 0,
    }

    for (const item of items) {
      totalsByCategory[item.category] += item.quantity * item.unitCost
    }

    const totalCost = Object.values(totalsByCategory).reduce((sum, value) => sum + value, 0)

    return {
      projectId,
      totalsByCategory,
      totalCost,
      allocatedBudget,
      remainingBudget: allocatedBudget - totalCost,
    }
  }
}
