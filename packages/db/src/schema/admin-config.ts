import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const adminConfig = pgTable("admin_config", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminConfigRow = typeof adminConfig.$inferSelect;
export type NewAdminConfigRow = typeof adminConfig.$inferInsert;
