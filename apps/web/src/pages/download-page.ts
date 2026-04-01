import type { ExportPackageCard } from '../types'

export const renderDownloadPage = (pkg: ExportPackageCard | null): string => {
  if (!pkg) {
    return '<main><h1>Download Package</h1><p>No package available yet.</p></main>'
  }

  const files = pkg.manifest.files
    .map((file) => `<li>${file.assetName}: ${file.status}</li>`)
    .join('')

  return [
    '<main>',
    '<h1>Download Package</h1>',
    `<a href="${pkg.zipUrl}">Download ZIP</a>`,
    '<h2>Manifest</h2>',
    `<ul>${files}</ul>`,
    '</main>',
  ].join('')
}
