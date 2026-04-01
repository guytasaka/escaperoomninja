import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { LayoutService } from '../layout/service'
import { ProjectError } from '../projects/service'

const layoutSchema = z.object({
  width: z.number().int().min(200).max(3000),
  height: z.number().int().min(200).max(3000),
  zones: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      color: z.string(),
    }),
  ),
  objects: z.array(
    z.object({
      id: z.string(),
      kind: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  ),
  overlays: z.object({
    lighting: z.boolean(),
    sound: z.boolean(),
    emergency: z.boolean(),
  }),
})

export const createLayoutRoutes = (
  authService: AuthService,
  layoutService: LayoutService,
): Hono => {
  const layouts = new Hono()

  layouts.put('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const parsed = layoutSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const record = await layoutService.save(session, {
        projectId: c.req.param('projectId'),
        ...parsed.data,
      })
      return c.json({ data: { layout: record } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  layouts.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const layout = await layoutService.get(session, c.req.param('projectId'))
      return c.json({ data: { layout } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  layouts.get('/:projectId/export-svg', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const svg = await layoutService.exportSvg(session, c.req.param('projectId'))
      return c.json({ data: { svg } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return layouts
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
