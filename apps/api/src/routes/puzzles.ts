import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import { ProjectError } from '../projects/service'
import type { PuzzleService } from '../puzzles/service'

const generatePuzzleSchema = z.object({
  projectId: z.string().uuid(),
  count: z.number().int().min(1).max(10).default(4),
})

const updatePuzzleSchema = z
  .object({
    title: z.string().min(2).optional(),
    type: z.string().min(2).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    estimatedMinutes: z.number().int().min(1).max(90).optional(),
    description: z.string().min(4).optional(),
    order: z.number().int().min(1).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const createPuzzleRoutes = (
  authService: AuthService,
  puzzleService: PuzzleService,
): Hono => {
  const puzzles = new Hono()

  puzzles.post('/generate', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = generatePuzzleSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid puzzle generation payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const generated = await puzzleService.generate(session, parsed.data)
      return c.json({ data: { puzzles: generated } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  puzzles.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const list = await puzzleService.list(session, c.req.param('projectId'))
      return c.json({ data: { puzzles: list } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  puzzles.patch('/:puzzleId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const projectId = c.req.query('projectId')
    if (!projectId) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'projectId query parameter is required',
          },
        },
        400,
      )
    }

    const payload = await c.req.json()
    const parsed = updatePuzzleSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid puzzle patch payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const updated = await puzzleService.update(
        session,
        c.req.param('puzzleId'),
        projectId,
        parsed.data,
      )
      if (!updated) {
        return c.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'Puzzle not found',
            },
          },
          404,
        )
      }

      return c.json({ data: { puzzle: updated } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return puzzles
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
