import type { BudgetSummaryCard, MaterialItemCard } from '../types'

const renderItem = (item: MaterialItemCard): string => {
  const total = item.quantity * item.unitCost
  return `<li>${item.name} (${item.category}) x${item.quantity} @ ${item.unitCost} = ${total}</li>`
}

export const renderBudgetPage = (
  items: MaterialItemCard[],
  summary: BudgetSummaryCard | null,
): string => {
  const list = items.length
    ? `<ul>${items.map((item) => renderItem(item)).join('')}</ul>`
    : '<p>No materials yet.</p>'

  const summaryBlock = summary
    ? [
        '<section>',
        '<h2>Budget Summary</h2>',
        `<p>Total Cost: ${summary.totalCost}</p>`,
        `<p>Allocated Budget: ${summary.allocatedBudget}</p>`,
        `<p>Remaining Budget: ${summary.remainingBudget}</p>`,
        '<ul>',
        `<li>Props: ${summary.totalsByCategory.props}</li>`,
        `<li>Electronics: ${summary.totalsByCategory.electronics}</li>`,
        `<li>Decor: ${summary.totalsByCategory.decor}</li>`,
        `<li>Tools: ${summary.totalsByCategory.tools}</li>`,
        `<li>Misc: ${summary.totalsByCategory.misc}</li>`,
        '</ul>',
        '</section>',
      ].join('')
    : '<section><h2>Budget Summary</h2><p>No summary yet.</p></section>'

  return [
    '<main>',
    '<h1>Budget and Materials</h1>',
    '<button type="button">Generate Materials</button>',
    '<button type="button">Enrich Purchase Links</button>',
    '<section>',
    '<h2>Materials</h2>',
    list,
    '</section>',
    summaryBlock,
    '</main>',
  ].join('')
}
