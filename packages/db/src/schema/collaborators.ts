import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { projects } from './projects'

export const collaborators = pgTable(
  'collaborators',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role').notNull(),
    invitedAt: timestamp('invited_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('collaborators_project_id_idx').on(table.projectId),
  }),
)

export const collaboratorComments = pgTable(
  'collaborator_comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    authorEmail: text('author_email').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdIndex: index('collaborator_comments_project_id_idx').on(table.projectId),
  }),
)

export type CollaboratorRow = typeof collaborators.$inferSelect
export type CollaboratorCommentRow = typeof collaboratorComments.$inferSelect
