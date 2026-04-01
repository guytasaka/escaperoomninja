import { randomUUID } from 'node:crypto'
import { and, asc, eq } from 'drizzle-orm'

import { type AppDb, narratives, withTransaction } from '@escaperoomninja/db'

import type { NarrativeCategory, NarrativeScript } from './types'

export interface NarrativeStore {
  replaceProject(
    projectId: string,
    ownerId: string,
    scripts: Array<{ category: NarrativeCategory; title: string; content: string }>,
  ): Promise<NarrativeScript[]>
  listByProject(projectId: string): Promise<NarrativeScript[]>
  update(scriptId: string, projectId: string, content: string): Promise<NarrativeScript | null>
}

export class InMemoryNarrativeStore implements NarrativeStore {
  private readonly scriptsById = new Map<string, NarrativeScript>()

  async replaceProject(
    projectId: string,
    ownerId: string,
    scripts: Array<{ category: NarrativeCategory; title: string; content: string }>,
  ): Promise<NarrativeScript[]> {
    for (const [id, script] of this.scriptsById.entries()) {
      if (script.projectId === projectId) {
        this.scriptsById.delete(id)
      }
    }

    const now = new Date()
    const created = scripts.map((script) => {
      const record: NarrativeScript = {
        id: randomUUID(),
        projectId,
        ownerId,
        category: script.category,
        title: script.title,
        content: script.content,
        updatedAt: now,
      }

      this.scriptsById.set(record.id, record)
      return record
    })

    return created
  }

  async listByProject(projectId: string): Promise<NarrativeScript[]> {
    return Array.from(this.scriptsById.values())
      .filter((script) => script.projectId === projectId)
      .sort((a, b) => a.category.localeCompare(b.category))
  }

  async update(
    scriptId: string,
    projectId: string,
    content: string,
  ): Promise<NarrativeScript | null> {
    const existing = this.scriptsById.get(scriptId)
    if (!existing || existing.projectId !== projectId) {
      return null
    }

    const updated: NarrativeScript = {
      ...existing,
      content,
      updatedAt: new Date(),
    }

    this.scriptsById.set(scriptId, updated)
    return updated
  }
}

export class DrizzleNarrativeStore implements NarrativeStore {
  constructor(private readonly db: AppDb) {}

  async replaceProject(
    projectId: string,
    ownerId: string,
    scripts: Array<{ category: NarrativeCategory; title: string; content: string }>,
  ): Promise<NarrativeScript[]> {
    const inserted = await withTransaction(this.db, async (tx) => {
      await tx.delete(narratives).where(eq(narratives.projectId, projectId))

      if (scripts.length === 0) {
        return []
      }

      return await tx
        .insert(narratives)
        .values(
          scripts.map((script) => ({
            projectId,
            ownerId,
            category: script.category,
            title: script.title,
            content: script.content,
            updatedAt: new Date(),
          })),
        )
        .returning()
    })

    return inserted.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      ownerId: row.ownerId,
      category: mapCategory(row.category),
      title: row.title,
      content: row.content,
      updatedAt: row.updatedAt,
    }))
  }

  async listByProject(projectId: string): Promise<NarrativeScript[]> {
    const rows = await this.db.query.narratives.findMany({
      where: eq(narratives.projectId, projectId),
      orderBy: asc(narratives.category),
    })

    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      ownerId: row.ownerId,
      category: mapCategory(row.category),
      title: row.title,
      content: row.content,
      updatedAt: row.updatedAt,
    }))
  }

  async update(
    scriptId: string,
    projectId: string,
    content: string,
  ): Promise<NarrativeScript | null> {
    const updated = await withTransaction(this.db, async (tx) => {
      return await tx
        .update(narratives)
        .set({
          content,
          updatedAt: new Date(),
        })
        .where(and(eq(narratives.id, scriptId), eq(narratives.projectId, projectId)))
        .returning()
    })

    const row = updated[0]
    if (!row) {
      return null
    }

    return {
      id: row.id,
      projectId: row.projectId,
      ownerId: row.ownerId,
      category: mapCategory(row.category),
      title: row.title,
      content: row.content,
      updatedAt: row.updatedAt,
    }
  }
}

const mapCategory = (value: string): NarrativeCategory => {
  if (value === 'intro' || value === 'hint' || value === 'gm') {
    return value
  }

  return 'ending'
}
