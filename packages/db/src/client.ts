import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema/index'

export type AppDb = PostgresJsDatabase<typeof schema>

export const createDbClient = (databaseUrl: string): AppDb => {
  const client = postgres(databaseUrl, {
    max: 10,
  })

  return drizzle(client, { schema })
}
