export interface PuzzleRecord {
  id: string
  projectId: string
  ownerId: string
  title: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedMinutes: number
  description: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface NewPuzzleInput {
  projectId: string
  ownerId: string
  title: string
  type: string
  difficulty: PuzzleRecord['difficulty']
  estimatedMinutes: number
  description: string
  order: number
}
