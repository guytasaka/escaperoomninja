import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  addCollaboratorComment,
  createCheckoutSession,
  createRevisionSnapshot,
  inviteCollaborator,
  listCollaborators,
  listRevisionSnapshots,
  packageProjectExport,
  restoreRevisionSnapshot,
} from './api'

describe('export/payment/collab/revision api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('handles checkout and export APIs', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { projectId: 'p1', sessionId: 'cs_1', checkoutUrl: 'https://checkout.test' },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              projectId: 'p1',
              zipUrl: 'https://downloads.test/package.zip',
              manifest: { generatedAt: new Date().toISOString(), files: [] },
            },
          }),
          { status: 200 },
        ),
      )

    const checkout = await createCheckoutSession('https://api.test', 'token', 'p1')
    expect(checkout.sessionId).toBe('cs_1')

    const pkg = await packageProjectExport('https://api.test', 'token', 'p1')
    expect(pkg.zipUrl).toContain('package.zip')
  })

  it('handles collaborator and revision APIs', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { collaborator: { id: 'c1', projectId: 'p1', email: 'a@b.com', role: 'editor' } },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              comment: { id: 'm1', projectId: 'p1', authorEmail: 'owner@x.com', content: 'ok' },
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: {
              collaborators: [{ id: 'c1', projectId: 'p1', email: 'a@b.com', role: 'editor' }],
              comments: [{ id: 'm1', projectId: 'p1', authorEmail: 'owner@x.com', content: 'ok' }],
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { snapshot: { id: 'r1', projectId: 'p1', label: 'A', payload: {} } },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { snapshots: [{ id: 'r1', projectId: 'p1', label: 'A', payload: {} }] },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { snapshot: { id: 'r1', projectId: 'p1', label: 'A', payload: {} } },
          }),
          { status: 200 },
        ),
      )

    const collaborator = await inviteCollaborator('https://api.test', 'token', {
      projectId: 'p1',
      email: 'a@b.com',
      role: 'editor',
    })
    expect(collaborator.role).toBe('editor')

    const comment = await addCollaboratorComment('https://api.test', 'token', 'p1', 'ok')
    expect(comment.content).toBe('ok')

    const list = await listCollaborators('https://api.test', 'token', 'p1')
    expect(list.collaborators.length).toBe(1)

    const snapshot = await createRevisionSnapshot('https://api.test', 'token', 'p1', 'A', {})
    expect(snapshot.id).toBe('r1')

    const snapshots = await listRevisionSnapshots('https://api.test', 'token', 'p1')
    expect(snapshots.length).toBe(1)

    const restored = await restoreRevisionSnapshot('https://api.test', 'token', 'p1', 'r1')
    expect(restored.id).toBe('r1')
  })
})
