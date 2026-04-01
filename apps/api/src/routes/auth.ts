import { Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const createAuthRoutes = (authService: AuthService): Hono => {
  const auth = new Hono()

  auth.post('/register', async (c) => {
    const payload = await c.req.json()
    const parsed = credentialsSchema.safeParse(payload)

    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid register payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const result = await authService.register(parsed.data)
      return c.json(
        {
          data: {
            token: result.token,
            user: {
              id: result.user.id,
              email: result.user.email,
              role: result.user.role,
            },
          },
        },
        201,
      )
    } catch (error) {
      return mapAuthError(c, error)
    }
  })

  auth.post('/login', async (c) => {
    const payload = await c.req.json()
    const parsed = credentialsSchema.safeParse(payload)

    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid login payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const result = await authService.login(parsed.data)
      return c.json({
        data: {
          token: result.token,
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
          },
        },
      })
    } catch (error) {
      return mapAuthError(c, error)
    }
  })

  auth.get('/session', async (c) => {
    const header = c.req.header('authorization')
    const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null

    if (!token) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing Bearer token',
          },
        },
        401,
      )
    }

    try {
      const session = await authService.getSession(token)
      return c.json({
        data: {
          session,
        },
      })
    } catch (error) {
      return mapAuthError(c, error)
    }
  })

  return auth
}

const mapAuthError = (
  c: { json: (body: unknown, status?: number) => Response },
  error: unknown,
) => {
  if (!(error instanceof AuthError)) {
    return c.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unexpected error',
        },
      },
      500,
    )
  }

  if (error.code === 'EMAIL_EXISTS') {
    return c.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      409,
    )
  }

  if (error.code === 'INVALID_CREDENTIALS') {
    return c.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      401,
    )
  }

  return c.json(
    {
      error: {
        code: 'UNAUTHORIZED',
        message: error.message,
      },
    },
    401,
  )
}
