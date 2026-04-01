import type { RoomLayoutRecord } from './types'

export interface LayoutStore {
  save(layout: RoomLayoutRecord): Promise<RoomLayoutRecord>
  get(projectId: string): Promise<RoomLayoutRecord | null>
}

export class InMemoryLayoutStore implements LayoutStore {
  private readonly layoutsByProject = new Map<string, RoomLayoutRecord>()

  async save(layout: RoomLayoutRecord): Promise<RoomLayoutRecord> {
    this.layoutsByProject.set(layout.projectId, layout)
    return layout
  }

  async get(projectId: string): Promise<RoomLayoutRecord | null> {
    return this.layoutsByProject.get(projectId) ?? null
  }
}
