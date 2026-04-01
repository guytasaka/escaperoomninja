import { randomUUID } from 'node:crypto'

import type { MaterialItem } from './types'

export interface MaterialStore {
  replaceProject(
    projectId: string,
    ownerId: string,
    items: Omit<MaterialItem, 'id' | 'ownerId' | 'updatedAt'>[],
  ): Promise<MaterialItem[]>
  listByProject(projectId: string): Promise<MaterialItem[]>
  update(
    itemId: string,
    input: Partial<
      Pick<MaterialItem, 'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'>
    >,
  ): Promise<MaterialItem | null>
}

export class InMemoryMaterialStore implements MaterialStore {
  private readonly itemsById = new Map<string, MaterialItem>()

  async replaceProject(
    projectId: string,
    ownerId: string,
    items: Omit<MaterialItem, 'id' | 'ownerId' | 'updatedAt'>[],
  ): Promise<MaterialItem[]> {
    for (const [id, item] of this.itemsById.entries()) {
      if (item.projectId === projectId) {
        this.itemsById.delete(id)
      }
    }

    const now = new Date()
    const created = items.map((item) => {
      const record: MaterialItem = {
        ...item,
        id: randomUUID(),
        ownerId,
        updatedAt: now,
      }

      this.itemsById.set(record.id, record)
      return record
    })

    return created
  }

  async listByProject(projectId: string): Promise<MaterialItem[]> {
    return Array.from(this.itemsById.values()).filter((item) => item.projectId === projectId)
  }

  async update(
    itemId: string,
    input: Partial<
      Pick<MaterialItem, 'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'>
    >,
  ): Promise<MaterialItem | null> {
    const existing = this.itemsById.get(itemId)
    if (!existing) {
      return null
    }

    const updated: MaterialItem = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    }
    this.itemsById.set(itemId, updated)

    return updated
  }
}
