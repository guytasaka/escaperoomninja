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
