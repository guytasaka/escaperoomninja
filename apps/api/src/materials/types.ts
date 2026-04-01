export interface MaterialItem {
  id: string
  projectId: string
  ownerId: string
  category: 'props' | 'electronics' | 'decor' | 'tools' | 'misc'
  name: string
  quantity: number
  unitCost: number
  vendorUrl: string | null
  alternatives: string[]
  threeDPrintable: boolean
  updatedAt: Date
}

export interface BudgetSummary {
  projectId: string
  totalsByCategory: Record<MaterialItem['category'], number>
  totalCost: number
  allocatedBudget: number
  remainingBudget: number
}
