export interface ProjectCard {
  id: string
  name: string
  genre: string
  roomType: string
  status: 'draft' | 'active' | 'archived'
  updatedAt: string
}

export interface AudienceProfileCard {
  projectId: string
  groupSize: number
  difficulty: 'easy' | 'medium' | 'hard'
  audienceType: 'friends' | 'family' | 'corporate' | 'enthusiasts'
  psychologyProfile: string
  recommendations: string[]
}

export interface PuzzleCard {
  id: string
  projectId: string
  title: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedMinutes: number
  description: string
  order: number
}

export interface PuzzleFlowNode {
  id: string
  label: string
  order: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface PuzzleFlowEdge {
  from: string
  to: string
}

export interface PuzzleFlowGraph {
  nodes: PuzzleFlowNode[]
  edges: PuzzleFlowEdge[]
}

export interface DifficultyCurvePoint {
  order: number
  difficultyScore: number
  title: string
}

export interface TimingBlueprintRow {
  order: number
  title: string
  estimatedMinutes: number
  cumulativeMinutes: number
}

export interface PuzzleAnalyticsCard {
  difficultyCurve: DifficultyCurvePoint[]
  timingBlueprint: TimingBlueprintRow[]
  totalMinutes: number
}

export type NarrativeCategory = 'intro' | 'hint' | 'gm' | 'ending'

export interface NarrativeScriptCard {
  id: string
  projectId: string
  category: NarrativeCategory
  title: string
  content: string
}

export interface TtsPreviewCard {
  audioUrl: string
  voice: string
  estimatedDurationSec: number
}

export interface LayoutZoneCard {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface LayoutObjectCard {
  id: string
  kind: string
  label: string
  x: number
  y: number
}

export interface RoomLayoutCard {
  projectId: string
  width: number
  height: number
  zones: LayoutZoneCard[]
  objects: LayoutObjectCard[]
  overlays: {
    lighting: boolean
    sound: boolean
    emergency: boolean
  }
}

export interface MaterialItemCard {
  id: string
  projectId: string
  category: 'props' | 'electronics' | 'decor' | 'tools' | 'misc'
  name: string
  quantity: number
  unitCost: number
  vendorUrl: string | null
  alternatives: string[]
  threeDPrintable: boolean
}

export interface BudgetSummaryCard {
  projectId: string
  totalsByCategory: Record<MaterialItemCard['category'], number>
  totalCost: number
  allocatedBudget: number
  remainingBudget: number
}

export interface BusinessPlanCard {
  projectId: string
  pricingStrategy: string
  financialProjection: string
  marketingPlan: string
}

export type GenerationAssetType =
  | 'text'
  | 'image'
  | 'audio'
  | 'music'
  | 'diagram'
  | 'pdf'
  | 'stl'
  | 'video'

export interface GenerationJobCard {
  id: string
  projectId: string
  assetType: GenerationAssetType
  assetName: string
  status: 'queued' | 'processing' | 'complete' | 'failed'
  attempt: number
  maxAttempts: number
  outputUrl: string | null
  error: string | null
}
