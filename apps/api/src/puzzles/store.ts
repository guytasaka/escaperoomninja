import { randomUUID } from 'node:crypto'
import { and, asc, eq } from 'drizzle-orm'

import { type AppDb, puzzles, withTransaction } from '@escaperoomninja/db'

import type { NewPuzzleInput, PuzzleRecord } from './types'

export interface PuzzleStore {
  createMany(input: NewPuzzleInput[]): Promise<PuzzleRecord[]>
  listByProject(projectId: string): Promise<PuzzleRecord[]>
  update(
    puzzleId: string,
    projectId: string,
    input: Partial<
      Pick<
        PuzzleRecord,
        'title' | 'type' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'
      >
    >,
  ): Promise<PuzzleRecord | null>
  replaceProject(projectId: string, input: NewPuzzleInput[]): Promise<PuzzleRecord[]>
}

export class InMemoryPuzzleStore implements PuzzleStore {
  private readonly puzzlesById = new Map<string, PuzzleRecord>()

  async createMany(input: NewPuzzleInput[]): Promise<PuzzleRecord[]> {
    const now = new Date()
    const created = input.map((item) => {
      const puzzle: PuzzleRecord = {
        id: randomUUID(),
        ...item,
        createdAt: now,
        updatedAt: now,
      }
      this.puzzlesById.set(puzzle.id, puzzle)
      return puzzle
    })

    return created
  }

  async replaceProject(projectId: string, input: NewPuzzleInput[]): Promise<PuzzleRecord[]> {
    for (const [id, puzzle] of this.puzzlesById.entries()) {
      if (puzzle.projectId === projectId) {
        this.puzzlesById.delete(id)
      }
    }

    return await this.createMany(input)
  }

  async listByProject(projectId: string): Promise<PuzzleRecord[]> {
    return Array.from(this.puzzlesById.values())
      .filter((puzzle) => puzzle.projectId === projectId)
      .sort((a, b) => a.order - b.order)
  }

  async update(
    puzzleId: string,
    projectId: string,
    input: Partial<
      Pick<
        PuzzleRecord,
        'title' | 'type' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'
      >
    >,
  ): Promise<PuzzleRecord | null> {
    const existing = this.puzzlesById.get(puzzleId)
    if (!existing || existing.projectId !== projectId) {
      return null
    }

    const updated: PuzzleRecord = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    }
    this.puzzlesById.set(puzzleId, updated)

    return updated
  }
}

export class DrizzlePuzzleStore implements PuzzleStore {
  constructor(private readonly db: AppDb) {}

  async createMany(input: NewPuzzleInput[]): Promise<PuzzleRecord[]> {
    if (input.length === 0) {
      return []
    }

    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(puzzles)
        .values(
          input.map((item) => ({
            projectId: item.projectId,
            ownerId: item.ownerId,
            title: item.title,
            type: item.type,
            difficulty: item.difficulty,
            estimatedMinutes: item.estimatedMinutes,
            description: item.description,
            order: item.order,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        )
        .returning()
    })

    return inserted.map((row) => mapPuzzle(row))
  }

  async replaceProject(projectId: string, input: NewPuzzleInput[]): Promise<PuzzleRecord[]> {
    return await withTransaction(this.db, async (tx) => {
      await tx.delete(puzzles).where(eq(puzzles.projectId, projectId))

      if (input.length === 0) {
        return []
      }

      const inserted = await tx
        .insert(puzzles)
        .values(
          input.map((item) => ({
            projectId: item.projectId,
            ownerId: item.ownerId,
            title: item.title,
            type: item.type,
            difficulty: item.difficulty,
            estimatedMinutes: item.estimatedMinutes,
            description: item.description,
            order: item.order,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        )
        .returning()

      return inserted.map((row) => mapPuzzle(row))
    })
  }

  async listByProject(projectId: string): Promise<PuzzleRecord[]> {
    const rows = await this.db.query.puzzles.findMany({
      where: eq(puzzles.projectId, projectId),
      orderBy: asc(puzzles.order),
    })

    return rows.map((row) => mapPuzzle(row))
  }

  async update(
    puzzleId: string,
    projectId: string,
    input: Partial<
      Pick<
        PuzzleRecord,
        'title' | 'type' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'
      >
    >,
  ): Promise<PuzzleRecord | null> {
    const updated = await withTransaction(this.db, async (tx) => {
      return await tx
        .update(puzzles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(and(eq(puzzles.id, puzzleId), eq(puzzles.projectId, projectId)))
        .returning()
    })

    const row = updated[0]
    return row ? mapPuzzle(row) : null
  }
}

const mapPuzzle = (row: typeof puzzles.$inferSelect): PuzzleRecord => {
  return {
    id: row.id,
    projectId: row.projectId,
    ownerId: row.ownerId,
    title: row.title,
    type: row.type,
    difficulty: row.difficulty === 'easy' || row.difficulty === 'hard' ? row.difficulty : 'medium',
    estimatedMinutes: row.estimatedMinutes,
    description: row.description,
    order: row.order,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
