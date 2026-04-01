import type { BusinessPlanCard } from '../types'

export const renderBusinessPage = (plan: BusinessPlanCard | null): string => {
  const planSection = plan
    ? [
        '<section>',
        '<h2>Pricing Strategy</h2>',
        `<p>${plan.pricingStrategy}</p>`,
        '<h2>Financial Projection</h2>',
        `<p>${plan.financialProjection}</p>`,
        '<h2>Marketing Plan</h2>',
        `<p>${plan.marketingPlan}</p>`,
        '</section>',
      ].join('')
    : '<section><p>No business plan generated yet.</p></section>'

  return [
    '<main>',
    '<h1>Business Planning</h1>',
    '<button type="button">Generate Business Plan</button>',
    planSection,
    '</main>',
  ].join('')
}
