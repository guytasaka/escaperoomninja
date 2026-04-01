import type { PuzzleAnalyticsCard, PuzzleCard, PuzzleFlowGraph } from '../types'

const renderPuzzleCard = (puzzle: PuzzleCard): string => {
  return [
    '<article>',
    `<h3>${puzzle.order}. ${puzzle.title}</h3>`,
    `<p>Type: ${puzzle.type}</p>`,
    `<p>Difficulty: ${puzzle.difficulty}</p>`,
    `<p>Estimated Minutes: ${puzzle.estimatedMinutes}</p>`,
    `<p>${puzzle.description}</p>`,
    '</article>',
  ].join('')
}

export const renderPuzzlePage = (puzzles: PuzzleCard[]): string => {
  const list = puzzles.length
    ? puzzles.map((puzzle) => renderPuzzleCard(puzzle)).join('')
    : '<p>No puzzles generated yet.</p>'

  return [
    '<main>',
    '<h1>Puzzle Design</h1>',
    '<form method="post" action="/puzzles/generate">',
    '<label>Puzzle Count <input type="number" name="count" min="1" max="10" value="4" /></label>',
    '<button type="submit">Generate Puzzle Set</button>',
    '</form>',
    `<section>${list}</section>`,
    '</main>',
  ].join('')
}

export const renderPuzzleFlowDiagram = (flow: PuzzleFlowGraph): string => {
  if (!flow.nodes.length) {
    return '<section><h2>Puzzle Flow Diagram</h2><p>No flow graph available yet.</p></section>'
  }

  const nodeList = flow.nodes
    .map((node) => `<li>${node.order}. ${node.label} (${node.difficulty})</li>`)
    .join('')
  const edgeList = flow.edges.length
    ? flow.edges.map((edge) => `<li>${edge.from} -> ${edge.to}</li>`).join('')
    : '<li>No transitions yet</li>'

  return [
    '<section>',
    '<h2>Puzzle Flow Diagram</h2>',
    '<h3>Nodes</h3>',
    `<ul>${nodeList}</ul>`,
    '<h3>Edges</h3>',
    `<ul>${edgeList}</ul>`,
    '</section>',
  ].join('')
}

export const renderDifficultyTimingView = (analytics: PuzzleAnalyticsCard): string => {
  const difficultyItems = analytics.difficultyCurve
    .map(
      (point) =>
        `<li>P${point.order}: ${point.title} - difficulty score ${point.difficultyScore}</li>`,
    )
    .join('')

  const timingRows = analytics.timingBlueprint
    .map(
      (row) =>
        `<tr><td>${row.order}</td><td>${row.title}</td><td>${row.estimatedMinutes}</td><td>${row.cumulativeMinutes}</td></tr>`,
    )
    .join('')

  return [
    '<section>',
    '<h2>Difficulty Curve</h2>',
    `<ul>${difficultyItems}</ul>`,
    '<h2>Timing Blueprint</h2>',
    '<table>',
    '<thead><tr><th>Order</th><th>Puzzle</th><th>Minutes</th><th>Cumulative</th></tr></thead>',
    `<tbody>${timingRows}</tbody>`,
    '</table>',
    `<p>Total Estimated Runtime: ${analytics.totalMinutes} minutes</p>`,
    '</section>',
  ].join('')
}
