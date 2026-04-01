export interface ProjectCard {
  id: string
  name: string
  genre: string
  roomType: string
  status: 'draft' | 'active' | 'archived'
  updatedAt: string
}
