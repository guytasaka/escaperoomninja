export const renderConceptPage = (input: {
  conceptText?: string
  moodBoardUrls?: string[]
}): string => {
  const concept = input.conceptText
    ? `<section><h2>Generated Concept</h2><p>${input.conceptText}</p></section>`
    : '<section><h2>Generated Concept</h2><p>No concept generated yet.</p></section>'

  const moodBoard = input.moodBoardUrls?.length
    ? [
        '<section><h2>Mood Board</h2><ul>',
        ...input.moodBoardUrls.map((url) => `<li><img alt="Mood board" src="${url}" /></li>`),
        '</ul></section>',
      ].join('')
    : '<section><h2>Mood Board</h2><p>No images yet.</p></section>'

  return [
    '<main>',
    '<h1>Concept Generator</h1>',
    '<form method="post" action="/concept/generate">',
    '<label>Prompt <textarea name="prompt" required></textarea></label>',
    '<button type="submit">Generate Concept</button>',
    '</form>',
    concept,
    moodBoard,
    '</main>',
  ].join('')
}
