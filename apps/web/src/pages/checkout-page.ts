import type { CheckoutSessionCard } from '../types'

export const renderCheckoutPage = (checkout: CheckoutSessionCard | null): string => {
  if (!checkout) {
    return '<main><h1>Checkout</h1><p>No checkout session yet.</p></main>'
  }

  return [
    '<main>',
    '<h1>Checkout</h1>',
    `<p>Session: ${checkout.sessionId}</p>`,
    `<a href="${checkout.checkoutUrl}">Open Stripe Checkout</a>`,
    '</main>',
  ].join('')
}
