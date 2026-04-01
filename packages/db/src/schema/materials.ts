import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'
import { users } from './users'

export const materials = pgTable(
  'materials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    unitCost: integer('unit_cost').notNull(),
    vendorUrl: text('vendor_url'),
    alternatives: jsonb('alternatives').$type<string[]>().notNull().default([]),
    threeDPrintable: boolean('three_d_printable').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('materials_project_id_idx').on(table.projectId),
  }),
)

export type MaterialRow = typeof materials.$inferSelect
