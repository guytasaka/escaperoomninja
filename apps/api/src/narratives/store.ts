import { randomUUID } from 'node:crypto'

import type { NarrativeCategory, NarrativeScript } from './types'

export interface NarrativeStore {
  replaceProject(
    projectId: string,
    ownerId: string,
    scripts: Array<{ category: NarrativeCategory; title: string; content: string }>,
  ): Promise<NarrativeScript[]>
  listByProject(projectId: string): Promise<NarrativeScript[]>
  update(scriptId: string, content: string): Promise<NarrativeScript | null>
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

  async update(scriptId: string, content: string): Promise<NarrativeScript | null> {
    const existing = this.scriptsById.get(scriptId)
    if (!existing) {
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
