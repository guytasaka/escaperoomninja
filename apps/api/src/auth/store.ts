import { randomUUID } from 'node:crypto'

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
