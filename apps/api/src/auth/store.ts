import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'

import { type AppDb, users, withTransaction } from '@escaperoomninja/db'

import type { AuthRole, AuthUser } from './types'

export interface AuthUserStore {
  findByEmail(email: string): Promise<AuthUser | null>
  findById(id: string): Promise<AuthUser | null>
  create(input: { email: string; passwordHash: string; role?: AuthRole }): Promise<AuthUser>
}

export class InMemoryAuthUserStore implements AuthUserStore {
  private usersById = new Map<string, AuthUser>()
  private usersByEmail = new Map<string, AuthUser>()

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.usersByEmail.get(email.toLowerCase()) ?? null
  }

  async findById(id: string): Promise<AuthUser | null> {
    return this.usersById.get(id) ?? null
  }

  async create(input: {
    email: string
    passwordHash: string
    role?: AuthRole
  }): Promise<AuthUser> {
    const normalizedEmail = input.email.toLowerCase()
    if (this.usersByEmail.has(normalizedEmail)) {
      throw new Error('EMAIL_EXISTS')
    }

    const user: AuthUser = {
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      role: input.role ?? 'user',
      createdAt: new Date(),
    }

    this.usersById.set(user.id, user)
    this.usersByEmail.set(user.email, user)

    return user
  }
}

export class DrizzleAuthUserStore implements AuthUserStore {
  constructor(private readonly db: AppDb) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const normalized = email.toLowerCase()
    const row = await this.db.query.users.findFirst({
      where: eq(users.email, normalized),
    })

    if (!row) {
      return null
    }

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role === 'admin' ? 'admin' : 'user',
      createdAt: row.createdAt,
    }
  }

  async findById(id: string): Promise<AuthUser | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!row) {
      return null
    }

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role === 'admin' ? 'admin' : 'user',
      createdAt: row.createdAt,
    }
  }

  async create(input: { email: string; passwordHash: string; role?: AuthRole }): Promise<AuthUser> {
    const normalized = input.email.toLowerCase()
    const inserted = await withTransaction(this.db, async (tx) => {
      return await tx
        .insert(users)
        .values({
          email: normalized,
          passwordHash: input.passwordHash,
          role: input.role ?? 'user',
        })
        .returning()
    })

    const row = inserted[0]
    if (!row) {
      throw new Error('USER_CREATE_FAILED')
    }

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role === 'admin' ? 'admin' : 'user',
      createdAt: row.createdAt,
    }
  }
}
