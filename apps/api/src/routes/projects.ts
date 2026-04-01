import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import { ProjectError, type ProjectService } from '../projects/service'

const createProjectSchema = z.object({
  name: z.string().min(3),
  genre: z.string().min(2),
  roomType: z.string().min(2),
})

const updateProjectSchema = z
  .object({
    name: z.string().min(3).optional(),
    genre: z.string().min(2).optional(),
    roomType: z.string().min(2).optional(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required')

export const createProjectRoutes = (
  authService: AuthService,
  projectService: ProjectService,
): Hono => {
  const projects = new Hono()

  projects.post('/', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = createProjectSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    const project = await projectService.create(session, parsed.data)
    return c.json({ data: { project } }, 201)
  })

  projects.get('/', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const projectList = await projectService.list(session)
    return c.json({ data: { projects: projectList } })
  })

  projects.get('/:id', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    try {
      const project = await projectService.getById(session, c.req.param('id'))
      return c.json({ data: { project } })
    } catch (error) {
      return mapProjectError(c, error)
    }
  })

  projects.patch('/:id', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = updateProjectSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project patch payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const project = await projectService.update(session, c.req.param('id'), parsed.data)
      return c.json({ data: { project } })
    } catch (error) {
      return mapProjectError(c, error)
    }
  })

  return projects
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

const mapProjectError = (
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
