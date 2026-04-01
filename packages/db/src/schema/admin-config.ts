import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const adminConfig = pgTable('admin_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  isSecret: boolean('is_secret').notNull().default(false),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type AdminConfigRow = typeof adminConfig.$inferSelect
export type NewAdminConfigRow = typeof adminConfig.$inferInsert
