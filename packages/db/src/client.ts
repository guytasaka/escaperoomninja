import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DbClient = ReturnType<typeof createDbClient>;

export function createDbClient(connectionString: string) {
  const sql = postgres(connectionString, {
    max: 5,
    prepare: false,
  });

  const db = drizzle(sql, { schema });

  return {
    db,
    sql,
    close: async () => {
      await sql.end();
    },
  };
}
