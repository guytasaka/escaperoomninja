import type { AppDb } from './client'

export const withTransaction = async <T>(
  db: AppDb,
  callback: (tx: AppDb) => Promise<T>,
): Promise<T> => {
  return await db.transaction(async (tx) => {
    return await callback(tx as AppDb)
  })
}
