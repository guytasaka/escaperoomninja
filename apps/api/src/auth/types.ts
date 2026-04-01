export type AuthRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  email: string
  passwordHash: string
  role: AuthRole
  createdAt: Date
}

export interface AuthSession {
  userId: string
  email: string
  role: AuthRole
}
