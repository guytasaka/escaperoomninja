import type { AIProvider } from '@escaperoomninja/ai'

import type { AuthSession } from '../auth/types'
import type { MaterialsService } from '../materials/service'
import type { ProjectService } from '../projects/service'

export interface BusinessPlan {
  projectId: string
  pricingStrategy: string
  financialProjection: string
  marketingPlan: string
}

export class BusinessService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly materialsService: MaterialsService,
    private readonly textProvider: AIProvider,
    private readonly model: string,
  ) {}

  async generate(session: AuthSession, projectId: string): Promise<BusinessPlan> {
    const project = await this.projectService.getById(session, projectId)
    const budget = await this.materialsService.getBudgetSummary(session, projectId)

    const generated = await this.textProvider.generateText({
      model: this.model,
      systemPrompt:
        'You write concise business planning outputs for entertainment venues. Return practical strategy text.',
      userPrompt: [
        `Project: ${project.name}`,
        `Genre: ${project.genre}`,
        `Room Type: ${project.roomType}`,
        `Total Build Cost: ${budget.totalCost}`,
      ].join('\n'),
    })

    return {
      projectId,
      pricingStrategy: `Set ticket pricing with tiered slots. ${generated.content}`,
      financialProjection: `Break-even target within 4-6 months using group utilization forecasts. ${generated.content}`,
      marketingPlan: `Launch campaign with teaser reels, community events, and referral incentives. ${generated.content}`,
    }
  }
}
