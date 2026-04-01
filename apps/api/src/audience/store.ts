import { eq } from 'drizzle-orm'

import { type AppDb, audienceProfiles, withTransaction } from '@escaperoomninja/db'

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

export class DrizzleAudienceStore implements AudienceStore {
  constructor(private readonly db: AppDb) {}

  async save(profile: AudienceProfile): Promise<AudienceProfile> {
    const saved = await withTransaction(this.db, async (tx) => {
      await tx.delete(audienceProfiles).where(eq(audienceProfiles.projectId, profile.projectId))

      return await tx
        .insert(audienceProfiles)
        .values({
          projectId: profile.projectId,
          ownerId: profile.ownerId,
          groupSize: profile.groupSize,
          difficulty: profile.difficulty,
          audienceType: profile.audienceType,
          psychologyProfile: profile.psychologyProfile,
          recommendations: profile.recommendations,
          updatedAt: profile.updatedAt,
        })
        .returning()
    })

    const row = saved[0]
    if (!row) {
      throw new Error('AUDIENCE_SAVE_FAILED')
    }

    return {
      projectId: row.projectId,
      ownerId: row.ownerId,
      groupSize: row.groupSize,
      difficulty:
        row.difficulty === 'easy' || row.difficulty === 'hard' ? row.difficulty : 'medium',
      audienceType: mapAudienceType(row.audienceType),
      psychologyProfile: row.psychologyProfile,
      recommendations: row.recommendations,
      updatedAt: row.updatedAt,
    }
  }

  async findByProjectId(projectId: string): Promise<AudienceProfile | null> {
    const row = await this.db.query.audienceProfiles.findFirst({
      where: eq(audienceProfiles.projectId, projectId),
    })

    if (!row) {
      return null
    }

    return {
      projectId: row.projectId,
      ownerId: row.ownerId,
      groupSize: row.groupSize,
      difficulty:
        row.difficulty === 'easy' || row.difficulty === 'hard' ? row.difficulty : 'medium',
      audienceType: mapAudienceType(row.audienceType),
      psychologyProfile: row.psychologyProfile,
      recommendations: row.recommendations,
      updatedAt: row.updatedAt,
    }
  }
}

const mapAudienceType = (value: string): AudienceProfile['audienceType'] => {
  if (value === 'friends' || value === 'family' || value === 'corporate') {
    return value
  }

  return 'enthusiasts'
}
