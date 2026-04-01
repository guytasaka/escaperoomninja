import type { RevisionSnapshotCard } from '../types'

export const renderRevisionsPage = (snapshots: RevisionSnapshotCard[]): string => {
  const list = snapshots.length
    ? `<ul>${snapshots.map((item) => `<li>${item.label} (${item.id})</li>`).join('')}</ul>`
    : '<p>No revision snapshots yet.</p>'

  return ['<main>', '<h1>Revision History</h1>', list, '</main>'].join('')
}
