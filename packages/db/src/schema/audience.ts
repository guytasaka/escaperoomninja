import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'
import { users } from './users'

export const audienceProfiles = pgTable('audience_profiles', {
  projectId: uuid('project_id')
    .primaryKey()
    .references(() => projects.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  groupSize: integer('group_size').notNull(),
  difficulty: text('difficulty').notNull(),
  audienceType: text('audience_type').notNull(),
  psychologyProfile: text('psychology_profile').notNull(),
  recommendations: jsonb('recommendations').$type<string[]>().notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type AudienceProfileRow = typeof audienceProfiles.$inferSelect
