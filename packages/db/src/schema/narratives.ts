import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'
import { users } from './users'

export const narratives = pgTable(
  'narratives',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('narratives_project_id_idx').on(table.projectId),
  }),
)

export type NarrativeRow = typeof narratives.$inferSelect
