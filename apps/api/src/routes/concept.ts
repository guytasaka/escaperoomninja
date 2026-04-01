import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { ConceptService } from '../concept/service'
import { ProjectError, type ProjectService } from '../projects/service'

const conceptSchema = z.object({
  projectId: z.string().uuid(),
  prompt: z.string().min(8),
})

export const createConceptRoutes = (
  authService: AuthService,
  projectService: ProjectService,
  conceptService: ConceptService,
): Hono => {
  const concept = new Hono()

  concept.post('/generate', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = conceptSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid concept generation payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      const project = await projectService.getById(session, parsed.data.projectId)
      const conceptText = await conceptService.generateConcept({
        projectName: project.name,
        genre: project.genre,
        roomType: project.roomType,
        prompt: parsed.data.prompt,
      })

      return c.json({
        data: {
          concept: conceptText,
        },
      })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  concept.post('/mood-board', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const payload = await c.req.json()
    const parsed = conceptSchema.safeParse(payload)
    if (!parsed.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid mood board payload',
            details: parsed.error.flatten(),
          },
        },
        400,
      )
    }

    try {
      await projectService.getById(session, parsed.data.projectId)
      const images = await conceptService.generateMoodBoard(parsed.data.prompt)

      return c.json({
        data: {
          images,
        },
      })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return concept
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
