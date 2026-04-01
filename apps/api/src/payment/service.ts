import type { AuthSession } from '../auth/types'
import type { ProjectService } from '../projects/service'

export interface CheckoutSession {
  projectId: string
  checkoutUrl: string
  sessionId: string
}

export class PaymentService {
  constructor(private readonly projectService: ProjectService) {}

  async createCheckout(session: AuthSession, projectId: string): Promise<CheckoutSession> {
    await this.projectService.getById(session, projectId)
    const sessionId = `cs_test_${projectId.slice(0, 8)}_${Date.now()}`
    return {
      projectId,
      sessionId,
      checkoutUrl: `https://checkout.stripe.test/session/${sessionId}`,
    }
  }

  async verifyWebhook(signature: string | undefined): Promise<boolean> {
    return Boolean(signature && signature.length > 8)
  }
}
