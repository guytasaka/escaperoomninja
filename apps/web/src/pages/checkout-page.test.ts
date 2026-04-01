import { describe, expect, it } from 'vitest'

import { renderCheckoutPage } from './checkout-page'

describe('checkout page', () => {
  it('renders empty state', () => {
    expect(renderCheckoutPage(null)).toContain('No checkout session yet.')
  })

  it('renders checkout link', () => {
    const html = renderCheckoutPage({
      projectId: 'p1',
      sessionId: 'cs_test_123',
      checkoutUrl: 'https://checkout.test/session',
    })
    expect(html).toContain('cs_test_123')
    expect(html).toContain('checkout.test/session')
  })
})
