import type { PuzzleCard } from '../types'

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
