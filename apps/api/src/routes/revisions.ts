import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import { ProjectError } from '../projects/service'
import type { RevisionService } from '../revisions/service'

const createSchema = z.object({
  projectId: z.string().uuid(),
  label: z.string().min(2),
  payload: z.record(z.unknown()),
})

export const createRevisionRoutes = (
  authService: AuthService,
  revisionService: RevisionService,
): Hono => {
  const revisions = new Hono()

  revisions.post('/snapshot', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    const parsed = createSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const snapshot = await revisionService.create(
        session,
        parsed.data.projectId,
        parsed.data.label,
        parsed.data.payload,
      )
      return c.json({ data: { snapshot } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  revisions.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    try {
      const snapshots = await revisionService.list(session, c.req.param('projectId'))
      return c.json({ data: { snapshots } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  revisions.post('/:projectId/restore/:revisionId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    try {
      const snapshot = await revisionService.restore(
        session,
        c.req.param('projectId'),
        c.req.param('revisionId'),
      )
      if (!snapshot) {
        return c.json({ error: { code: 'NOT_FOUND', message: 'Revision snapshot not found' } }, 404)
      }

      return c.json({ data: { snapshot } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return revisions
}

const authenticate = async (c: Context, authService: AuthService) => {
  const token = c.req.header('authorization')?.replace('Bearer ', '')
  if (!token)
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing Bearer token' } }, 401)

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
