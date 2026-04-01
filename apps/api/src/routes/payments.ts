import { type Context, Hono } from 'hono'
import { z } from 'zod'

import { AuthError, type AuthService } from '../auth/service'
import type { PaymentService } from '../payment/service'
import { ProjectError } from '../projects/service'

const checkoutSchema = z.object({
  projectId: z.string().uuid(),
})

export const createPaymentRoutes = (
  authService: AuthService,
  paymentService: PaymentService,
): Hono => {
  const payments = new Hono()

  payments.post('/checkout', async (c) => {
    const session = await authenticate(c, authService)
    if (session instanceof Response) return session

    const parsed = checkoutSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return c.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, 400)
    }

    try {
      const checkout = await paymentService.createCheckout(session, parsed.data.projectId)
      return c.json({ data: checkout })
    } catch (error) {
      return mapDomainError(c, error)
    }
  })

  payments.post('/webhook', async (c) => {
    const signature = c.req.header('stripe-signature')
    const isValid = await paymentService.verifyWebhook(signature)
    if (!isValid) {
      return c.json(
        { error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } },
        400,
      )
    }

    return c.json({ data: { received: true } })
  })

  return payments
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
