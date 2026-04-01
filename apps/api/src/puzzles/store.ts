import { randomUUID } from 'node:crypto'

import type { NewPuzzleInput, PuzzleRecord } from './types'

export interface PuzzleStore {
  createMany(input: NewPuzzleInput[]): Promise<PuzzleRecord[]>
  listByProject(projectId: string): Promise<PuzzleRecord[]>
  update(
    puzzleId: string,
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
    input: Partial<
      Pick<
        PuzzleRecord,
        'title' | 'type' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'
      >
    >,
  ): Promise<PuzzleRecord | null> {
    const existing = this.puzzlesById.get(puzzleId)
    if (!existing) {
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
