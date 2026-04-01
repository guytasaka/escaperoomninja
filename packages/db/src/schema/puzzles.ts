import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'
import { users } from './users'

export const puzzles = pgTable(
  'puzzles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    type: text('type').notNull(),
    difficulty: text('difficulty').notNull(),
    estimatedMinutes: integer('estimated_minutes').notNull(),
    description: text('description').notNull(),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('puzzles_project_id_idx').on(table.projectId),
  }),
)

export type PuzzleRow = typeof puzzles.$inferSelect
