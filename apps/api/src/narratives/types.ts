export type NarrativeCategory = 'intro' | 'hint' | 'gm' | 'ending'

export interface NarrativeScript {
  id: string
  projectId: string
  ownerId: string
  category: NarrativeCategory
  title: string
  content: string
  updatedAt: Date
}
