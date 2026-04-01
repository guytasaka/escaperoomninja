import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { ExportService } from '../export/service'
import { ProjectError } from '../projects/service'

const packageSchema = z.object({
  projectId: z.string().uuid(),
})

export const createExportRoutes = (
  authService: AuthService,
  exportService: ExportService,
): Hono => {
  const exportRoutes = new Hono()

  exportRoutes.post('/package', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    const parsed = packageSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const result = await exportService.packageProject(session, parsed.data.projectId)
      return c.json({ data: result })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return exportRoutes
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
