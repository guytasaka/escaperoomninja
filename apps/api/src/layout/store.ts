import { eq } from 'drizzle-orm'

import { type AppDb, layouts, withTransaction } from '@escaperoomninja/db'

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

export class DrizzleLayoutStore implements LayoutStore {
  constructor(private readonly db: AppDb) {}

  async save(layout: RoomLayoutRecord): Promise<RoomLayoutRecord> {
    const saved = await withTransaction(this.db, async (tx) => {
      await tx.delete(layouts).where(eq(layouts.projectId, layout.projectId))

      return await tx
        .insert(layouts)
        .values({
          projectId: layout.projectId,
          ownerId: layout.ownerId,
          width: layout.width,
          height: layout.height,
          zones: layout.zones as unknown as Array<Record<string, unknown>>,
          objects: layout.objects as unknown as Array<Record<string, unknown>>,
          overlays: layout.overlays as unknown as Record<string, unknown>,
          updatedAt: layout.updatedAt,
        })
        .returning()
    })

    const row = saved[0]
    if (!row) {
      throw new Error('LAYOUT_SAVE_FAILED')
    }

    return {
      projectId: row.projectId,
      ownerId: row.ownerId,
      width: row.width,
      height: row.height,
      zones: row.zones as unknown as RoomLayoutRecord['zones'],
      objects: row.objects as unknown as RoomLayoutRecord['objects'],
      overlays: row.overlays as unknown as RoomLayoutRecord['overlays'],
      updatedAt: row.updatedAt,
    }
  }

  async get(projectId: string): Promise<RoomLayoutRecord | null> {
    const row = await this.db.query.layouts.findFirst({
      where: eq(layouts.projectId, projectId),
    })

    if (!row) {
      return null
    }

    return {
      projectId: row.projectId,
      ownerId: row.ownerId,
      width: row.width,
      height: row.height,
      zones: row.zones as unknown as RoomLayoutRecord['zones'],
      objects: row.objects as unknown as RoomLayoutRecord['objects'],
      overlays: row.overlays as unknown as RoomLayoutRecord['overlays'],
      updatedAt: row.updatedAt,
    }
  }
}
