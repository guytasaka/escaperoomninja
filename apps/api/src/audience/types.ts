export interface AudienceProfile {
  projectId: string
  ownerId: string
  groupSize: number
  difficulty: 'easy' | 'medium' | 'hard'
  audienceType: 'friends' | 'family' | 'corporate' | 'enthusiasts'
  psychologyProfile: string
  recommendations: string[]
  updatedAt: Date
}
