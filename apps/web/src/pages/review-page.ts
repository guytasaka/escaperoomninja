export const renderReviewPage = (state: {
  loading: boolean
  error: string | null
  sections: string[]
}): string => {
  if (state.loading) {
    return '<main class="container mobile-stack"><h1>Project Review</h1><p>Loading review data...</p></main>'
  }

  if (state.error) {
    return `<main class="container mobile-stack"><h1>Project Review</h1><p>Error: ${state.error}</p></main>`
  }

  const sections = state.sections.length
    ? `<ul>${state.sections.map((s) => `<li>${s}</li>`).join('')}</ul>`
    : '<p>No review sections available.</p>'

  return [
    '<main class="container mobile-stack">',
    '<h1>Project Review</h1>',
    sections,
    '</main>',
  ].join('')
}
