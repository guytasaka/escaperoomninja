import { integer, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'
import { users } from './users'

export const layouts = pgTable('layouts', {
  projectId: uuid('project_id')
    .primaryKey()
    .references(() => projects.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  zones: jsonb('zones').$type<Array<Record<string, unknown>>>().notNull(),
  objects: jsonb('objects').$type<Array<Record<string, unknown>>>().notNull(),
  overlays: jsonb('overlays').$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type LayoutRow = typeof layouts.$inferSelect
