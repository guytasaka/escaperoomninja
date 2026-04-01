import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import { ProjectError, type ProjectService } from '../projects/service'

const ttsSchema = z.object({
  projectId: z.string().uuid(),
  text: z.string().min(4),
  voice: z.string().min(2).default('neutral-guide'),
})

export const createPreviewRoutes = (
  authService: AuthService,
  projectService: ProjectService,
): Hono => {
  const preview = new Hono()

  preview.post('/tts', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) {
      return session
    }

    const parsed = ttsSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      await projectService.getById(session, parsed.data.projectId)
      const audioUrl = `https://audio.escaperoomninja.local/preview/${parsed.data.projectId}/${Date.now()}.mp3`
      const estimatedDurationSec = Math.max(3, Math.ceil(parsed.data.text.length / 18))

      return c.json({
        data: {
          audioUrl,
          voice: parsed.data.voice,
          estimatedDurationSec,
        },
      })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  return preview
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
