import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'

export const generationJobs = pgTable(
  'generation_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    assetType: text('asset_type').notNull(),
    assetName: text('asset_name').notNull(),
    status: text('status').notNull(),
    attempt: integer('attempt').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(2),
    outputUrl: text('output_url'),
    error: text('error'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('generation_jobs_project_id_idx').on(table.projectId),
  }),
)

export type GenerationJobRow = typeof generationJobs.$inferSelect
