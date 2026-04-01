import type { NarrativeScriptCard, TtsPreviewCard } from '../types'

const renderScriptTab = (script: NarrativeScriptCard): string => {
  return [
    '<article>',
    `<h3>${script.title}</h3>`,
    `<p>Category: ${script.category}</p>`,
    `<textarea rows="6">${script.content}</textarea>`,
    '<button type="button">Save Script</button>',
    '</article>',
  ].join('')
}

export const renderNarrativePage = (
  scripts: NarrativeScriptCard[],
  preview: TtsPreviewCard | null,
): string => {
  const tabs = scripts.length
    ? scripts.map((script) => renderScriptTab(script)).join('')
    : '<p>No scripts generated yet.</p>'

  const previewSection = preview
    ? `<section><h2>Audio Preview</h2><p>Voice: ${preview.voice}</p><p>Duration: ${preview.estimatedDurationSec}s</p><audio src="${preview.audioUrl}" controls></audio></section>`
    : '<section><h2>Audio Preview</h2><p>No preview yet.</p></section>'

  return [
    '<main>',
    '<h1>Narrative Studio</h1>',
    '<button type="button">Generate Narrative Scripts</button>',
    '<section>',
    '<h2>Scripts</h2>',
    tabs,
    '</section>',
    '<section>',
    '<h2>Quick TTS Preview</h2>',
    '<button type="button">Preview Selected Script</button>',
    '</section>',
    previewSection,
    '</main>',
  ].join('')
}
