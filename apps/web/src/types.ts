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
