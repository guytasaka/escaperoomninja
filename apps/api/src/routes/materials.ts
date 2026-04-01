import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { MaterialsService } from '../materials/service'
import { ProjectError } from '../projects/service'

const generateSchema = z.object({
  projectId: z.string().uuid(),
})

const updateSchema = z
  .object({
    quantity: z.number().int().min(1).optional(),
    unitCost: z.number().min(0).optional(),
    vendorUrl: z.string().url().nullable().optional(),
    alternatives: z.array(z.string()).optional(),
    threeDPrintable: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const createMaterialsRoutes = (
  authService: AuthService,
  materialsService: MaterialsService,
): Hono => {
  const materials = new Hono()

  materials.post('/generate', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const parsed = generateSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const items = await materialsService.generate(session, parsed.data.projectId)
      return c.json({ data: { items } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  materials.post('/enrich', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const parsed = generateSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const items = await materialsService.enrich(session, parsed.data.projectId)
      return c.json({ data: { items } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  materials.get('/:projectId', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const items = await materialsService.list(session, c.req.param('projectId'))
      return c.json({ data: { items } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  materials.patch('/:itemId', async (c) => {
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
      const item = await materialsService.update(
        session,
        projectId,
        c.req.param('itemId'),
        parsed.data,
      )
      if (!item) {
        return c.json({ error: { code: 'NOT_FOUND', message: 'Material item not found' } }, 404)
      }

      return c.json({ data: { item } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  materials.get('/:projectId/budget', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const allocatedBudget = Number(c.req.query('allocatedBudget') ?? '1200')
    try {
      const summary = await materialsService.getBudgetSummary(
        session,
        c.req.param('projectId'),
        allocatedBudget,
      )
      return c.json({ data: { summary } })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return materials
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
