import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from './users'

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  genre: text('genre').notNull(),
  roomType: text('room_type').notNull(),
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ProjectRow = typeof projects.$inferSelect
export type NewProjectRow = typeof projects.$inferInsert
