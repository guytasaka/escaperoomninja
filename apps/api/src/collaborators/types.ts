export interface CollaboratorRecord {
  id: string
  projectId: string
  email: string
  role: 'viewer' | 'commenter' | 'editor'
  invitedAt: Date
}

export interface CollaboratorComment {
  id: string
  projectId: string
  authorEmail: string
  content: string
  createdAt: Date
}
