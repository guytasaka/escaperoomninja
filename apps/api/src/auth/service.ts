import { compare, hash } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

import type { AuthUserStore } from './store'
import type { AuthSession, AuthUser } from './types'

const TOKEN_AUDIENCE = 'escaperoomninja'
const TOKEN_ISSUER = 'escaperoomninja-api'

export class AuthError extends Error {
  constructor(
    readonly code: 'EMAIL_EXISTS' | 'INVALID_CREDENTIALS' | 'UNAUTHORIZED' | 'INVALID_TOKEN',
    message: string,
  ) {
    super(message)
  }
}

export class AuthService {
  private readonly secret: Uint8Array

  constructor(
    private readonly userStore: AuthUserStore,
    authSecret: string,
  ) {
    this.secret = new TextEncoder().encode(authSecret)
  }

  async register(input: { email: string; password: string }): Promise<{
    user: AuthUser
    token: string
  }> {
    const existing = await this.userStore.findByEmail(input.email)
    if (existing) {
      throw new AuthError('EMAIL_EXISTS', 'A user already exists with this email')
    }

    const passwordHash = await hash(input.password, 12)
    const user = await this.userStore.create({
      email: input.email,
      passwordHash,
    })

    return {
      user,
      token: await this.signToken(user),
    }
  }

  async login(input: { email: string; password: string }): Promise<{
    user: AuthUser
    token: string
  }> {
    const user = await this.userStore.findByEmail(input.email)
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS', 'Email or password is invalid')
    }

    const isValid = await compare(input.password, user.passwordHash)
    if (!isValid) {
      throw new AuthError('INVALID_CREDENTIALS', 'Email or password is invalid')
    }

    return {
      user,
      token: await this.signToken(user),
    }
  }

  async getSession(token: string): Promise<AuthSession> {
    try {
      const verified = await jwtVerify(token, this.secret, {
        issuer: TOKEN_ISSUER,
        audience: TOKEN_AUDIENCE,
      })

      const { sub, email, role } = verified.payload
      if (typeof sub !== 'string' || typeof email !== 'string') {
        throw new AuthError('INVALID_TOKEN', 'Token payload is invalid')
      }

      const userRole = role === 'admin' ? 'admin' : 'user'

      return {
        userId: sub,
        email,
        role: userRole,
      }
    } catch {
      throw new AuthError('UNAUTHORIZED', 'Session token is invalid or expired')
    }
  }

  private async signToken(user: AuthUser): Promise<string> {
    return await new SignJWT({ email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuer(TOKEN_ISSUER)
      .setAudience(TOKEN_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(this.secret)
  }
}
