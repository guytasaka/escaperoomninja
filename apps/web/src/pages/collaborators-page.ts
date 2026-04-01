import type { CollaboratorCard, CollaboratorCommentCard } from '../types'

export const renderCollaboratorsPage = (
  collaborators: CollaboratorCard[],
  comments: CollaboratorCommentCard[],
): string => {
  const collaboratorList = collaborators.length
    ? `<ul>${collaborators.map((c) => `<li>${c.email} (${c.role})</li>`).join('')}</ul>`
    : '<p>No collaborators yet.</p>'

  const commentList = comments.length
    ? `<ul>${comments.map((c) => `<li>${c.authorEmail}: ${c.content}</li>`).join('')}</ul>`
    : '<p>No comments yet.</p>'

  return [
    '<main>',
    '<h1>Collaborators</h1>',
    collaboratorList,
    '<h2>Comments</h2>',
    commentList,
    '</main>',
  ].join('')
}
