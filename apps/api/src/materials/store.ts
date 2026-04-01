import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'

import { type AppDb, materials, withTransaction } from '@escaperoomninja/db'

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
    projectId: string,
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
    projectId: string,
    input: Partial<
      Pick<MaterialItem, 'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'>
    >,
  ): Promise<MaterialItem | null> {
    const existing = this.itemsById.get(itemId)
    if (!existing || existing.projectId !== projectId) {
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

export class DrizzleMaterialStore implements MaterialStore {
  constructor(private readonly db: AppDb) {}

  async replaceProject(
    projectId: string,
    ownerId: string,
    items: Omit<MaterialItem, 'id' | 'ownerId' | 'updatedAt'>[],
  ): Promise<MaterialItem[]> {
    return await withTransaction(this.db, async (tx) => {
      await tx.delete(materials).where(eq(materials.projectId, projectId))

      if (items.length === 0) {
        return []
      }

      const inserted = await tx
        .insert(materials)
        .values(
          items.map((item) => ({
            projectId,
            ownerId,
            category: item.category,
            name: item.name,
            quantity: item.quantity,
            unitCost: item.unitCost,
            vendorUrl: item.vendorUrl,
            alternatives: item.alternatives,
            threeDPrintable: item.threeDPrintable,
            updatedAt: new Date(),
          })),
        )
        .returning()

      return inserted.map((row) => mapMaterial(row))
    })
  }

  async listByProject(projectId: string): Promise<MaterialItem[]> {
    const rows = await this.db.query.materials.findMany({
      where: eq(materials.projectId, projectId),
    })

    return rows.map((row) => mapMaterial(row))
  }

  async update(
    itemId: string,
    projectId: string,
    input: Partial<
      Pick<MaterialItem, 'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'>
    >,
  ): Promise<MaterialItem | null> {
    const updated = await withTransaction(this.db, async (tx) => {
      return await tx
        .update(materials)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(and(eq(materials.id, itemId), eq(materials.projectId, projectId)))
        .returning()
    })

    const row = updated[0]
    return row ? mapMaterial(row) : null
  }
}

const mapMaterial = (row: typeof materials.$inferSelect): MaterialItem => {
  return {
    id: row.id,
    projectId: row.projectId,
    ownerId: row.ownerId,
    category: mapCategory(row.category),
    name: row.name,
    quantity: row.quantity,
    unitCost: row.unitCost,
    vendorUrl: row.vendorUrl,
    alternatives: row.alternatives,
    threeDPrintable: row.threeDPrintable,
    updatedAt: row.updatedAt,
  }
}

const mapCategory = (value: string): MaterialItem['category'] => {
  if (value === 'props' || value === 'electronics' || value === 'decor' || value === 'tools') {
    return value
  }

  return 'misc'
}
