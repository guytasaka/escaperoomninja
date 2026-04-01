export interface RevisionSnapshot {
  id: string
  projectId: string
  label: string
  payload: Record<string, unknown>
  createdAt: Date
}
