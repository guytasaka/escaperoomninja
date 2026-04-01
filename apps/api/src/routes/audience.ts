import { type Context, Hono } from 'hono'
import { z } from 'zod'

import type { AudienceService } from '../audience/service'
import { AuthError, type AuthService } from '../auth/service'
import { ProjectError } from '../projects/service'

const generateAudienceSchema = z.object({
  projectId: z.string().uuid(),
  groupSize: z.number().int().min(2).max(12),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  audienceType: z.enum(['friends', 'family', 'corporate', 'enthusiasts']),
})

export const createAudienceRoutes = (
  authService: AuthService,
  audienceService: AudienceService,
): Hono => {
  const audience = new Hono()

  audience.post('/recommendations', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = generateAudienceSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid audience payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const profile = await audienceService.generate(session, parsed.data)
      return c.json({ data: { profile } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  audience.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const profile = await audienceService.getByProject(session, c.req.param('projectId'))
      return c.json({ data: { profile } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return audience
}

const authenticate = async (c: Context, authService: AuthService) => {
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
    return await authService.getSession(token)
  } catch (error) {
    if (error instanceof AuthError) {
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
}

const mapDomainError = (
  c: { json: (body: unknown, status?: number) => Response },
  error: unknown,
) => {
  if (error instanceof ProjectError) {
    const status = error.code === 'NOT_FOUND' ? 404 : 403
    return c.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      status,
    )
  }

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
