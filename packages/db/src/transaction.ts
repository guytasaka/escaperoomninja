import type { DbClient } from "./client";

type TransactionCallback<T> = (
  tx: Parameters<DbClient["db"]["transaction"]>[0] extends (
    tx: infer U,
    ...args: never[]
  ) => unknown
    ? U
    : never,
) => Promise<T>;

export async function withTransaction<T>(
  db: DbClient["db"],
  callback: TransactionCallback<T>,
): Promise<T> {
  return db.transaction(async (tx) => callback(tx));
}
