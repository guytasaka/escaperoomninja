import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { NarrativeService } from '../narratives/service'
import { ProjectError } from '../projects/service'

const generateSchema = z.object({
  projectId: z.string().uuid(),
  tone: z.string().min(2).optional(),
})

const updateSchema = z.object({
  content: z.string().min(4),
})

export const createNarrativeRoutes = (
  authService: AuthService,
  narrativeService: NarrativeService,
): Hono => {
  const narratives = new Hono()

  narratives.post('/generate', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const parsed = generateSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const scripts = await narrativeService.generate(session, parsed.data)
      return c.json({ data: { scripts } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  narratives.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const scripts = await narrativeService.list(session, c.req.param('projectId'))
      return c.json({ data: { scripts } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  narratives.patch('/:scriptId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const projectId = c.req.query('projectId')
    if (!projectId) {
      return c.json(
        { error: { code: 'VALIDATION_ERROR', message: 'projectId query parameter is required' } },
        400,
      )
    }

    const parsed = updateSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const script = await narrativeService.update(
        session,
        projectId,
        c.req.param('scriptId'),
        parsed.data.content,
      )
      if (!script) {
        return c.json({ error: { code: 'NOT_FOUND', message: 'Script not found' } }, 404)
      }

      return c.json({ data: { script } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return narratives
}

const authenticate = async (c: Context, authService: AuthService) => {
  const header = c.req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
  if (!token) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing Bearer token' } }, 401)
  }

  try {
    return await authService.getSession(token)
  } catch (error) {
    if (error instanceof AuthError) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: error.message } }, 401)
    }

    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } }, 500)
  }
}

const mapDomainError = (
  c: { json: (body: unknown, status?: number) => Response },
  error: unknown,
) => {
  if (error instanceof ProjectError) {
    return c.json(
      { error: { code: error.code, message: error.message } },
      error.code === 'NOT_FOUND' ? 404 : 403,
    )
  }

  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } }, 500)
}
