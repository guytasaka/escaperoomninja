import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { CollaboratorService } from '../collaborators/service'
import { ProjectError } from '../projects/service'

const inviteSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['viewer', 'commenter', 'editor']),
})

const commentSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(2),
})

export const createCollaboratorRoutes = (
  authService: AuthService,
  collaboratorService: CollaboratorService,
): Hono => {
  const collaborators = new Hono()

  collaborators.post('/invite', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    const parsed = inviteSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const collaborator = await collaboratorService.invite(
        session,
        parsed.data.projectId,
        parsed.data.email,
        parsed.data.role,
      )
      return c.json({ data: { collaborator } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  collaborators.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    try {
      const list = await collaboratorService.list(session, c.req.param('projectId'))
      const comments = await collaboratorService.listComments(session, c.req.param('projectId'))
      return c.json({ data: { collaborators: list, comments } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  collaborators.post('/comment', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    const parsed = commentSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const comment = await collaboratorService.addComment(
        session,
        parsed.data.projectId,
        parsed.data.content,
      )
      return c.json({ data: { comment } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return collaborators
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
