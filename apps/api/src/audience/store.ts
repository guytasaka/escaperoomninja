import type { AudienceProfile } from './types'

export interface AudienceStore {
  save(profile: AudienceProfile): Promise<AudienceProfile>
  findByProjectId(projectId: string): Promise<AudienceProfile | null>
}

export class InMemoryAudienceStore implements AudienceStore {
  private readonly profilesByProjectId = new Map<string, AudienceProfile>()

  async save(profile: AudienceProfile): Promise<AudienceProfile> {
    this.profilesByProjectId.set(profile.projectId, profile)
    return profile
  }

  async findByProjectId(projectId: string): Promise<AudienceProfile | null> {
    return this.profilesByProjectId.get(projectId) ?? null
  }
}
