export interface ProjectRecord {
  id: string
  ownerId: string
  name: string
  genre: string
  roomType: string
  status: 'draft' | 'active' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export interface NewProjectInput {
  ownerId: string
  name: string
  genre: string
  roomType: string
}

export interface UpdateProjectInput {
  name?: string
  genre?: string
  roomType?: string
  status?: ProjectRecord['status']
}
