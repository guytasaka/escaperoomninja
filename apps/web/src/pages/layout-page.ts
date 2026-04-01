import type { RoomLayoutCard } from '../types'

const renderZone = (zone: RoomLayoutCard['zones'][number]): string => {
  return `<li>${zone.name} (${zone.x},${zone.y}) ${zone.width}x${zone.height}</li>`
}

const renderObject = (obj: RoomLayoutCard['objects'][number]): string => {
  return `<li>${obj.label} (${obj.kind}) at ${obj.x},${obj.y}</li>`
}

export const renderLayoutPage = (
  layout: RoomLayoutCard | null,
  exportedSvg: string | null,
): string => {
  const layoutSection = layout
    ? [
        '<section>',
        '<h2>Canvas Model</h2>',
        `<p>Canvas: ${layout.width}x${layout.height}</p>`,
        '<h3>Zones</h3>',
        `<ul>${layout.zones.map((zone) => renderZone(zone)).join('')}</ul>`,
        '<h3>Objects</h3>',
        `<ul>${layout.objects.map((obj) => renderObject(obj)).join('')}</ul>`,
        `<p>Overlays: lighting=${layout.overlays.lighting}, sound=${layout.overlays.sound}, emergency=${layout.overlays.emergency}</p>`,
        '</section>',
      ].join('')
    : '<section><h2>Canvas Model</h2><p>No layout saved yet.</p></section>'

  const exportSection = exportedSvg
    ? `<section><h2>SVG Export</h2><pre>${exportedSvg}</pre></section>`
    : '<section><h2>SVG Export</h2><p>Not exported yet.</p></section>'

  return [
    '<main>',
    '<h1>Layout Designer</h1>',
    '<button type="button">Save Canvas Layout</button>',
    '<button type="button">Export SVG</button>',
    layoutSection,
    exportSection,
    '</main>',
  ].join('')
}
