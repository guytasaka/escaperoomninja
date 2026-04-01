import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import postgres from 'postgres'
import { beforeAll, describe, expect, it } from 'vitest'

import { createApp } from '../index'

const databaseUrl = process.env.DATABASE_URL
const describeDb = databaseUrl ? describe : describe.skip

const currentDir = dirname(fileURLToPath(import.meta.url))
const drizzleDir = join(currentDir, '../../../../packages/db/drizzle')

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random()}@example.com`

const registerAndGetToken = async (app: ReturnType<typeof createApp>, email: string) => {
  const response = await app.request('/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'supersecret123' }),
  })
  expect(response.status).toBe(201)
  const payload = (await response.json()) as { data: { token: string } }
  return payload.data.token
}

const createProject = async (app: ReturnType<typeof createApp>, token: string) => {
  const response = await app.request('/projects', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'DB Integration Room',
      genre: 'mystery',
      roomType: 'single-room',
    }),
  })
  expect(response.status).toBe(201)
  return (await response.json()) as { data: { project: { id: string } } }
}

describeDb('db mode integration', () => {
  beforeAll(async () => {
    const sql = postgres(databaseUrl as string, { max: 1, onnotice: () => undefined })
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`

    const files = (await readdir(drizzleDir)).filter((file) => file.endsWith('.sql')).sort()
    for (const file of files) {
      const sqlText = await readFile(join(drizzleDir, file), 'utf8')
      await sql.unsafe(sqlText)
    }

    await sql.end()
  })

  it('persists audience profile and generation jobs via drizzle stores', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, uniqueEmail('dbmode'))
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    const audienceResponse = await app.request('/audience/recommendations', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        projectId,
        groupSize: 4,
        difficulty: 'medium',
        audienceType: 'friends',
      }),
    })
    expect(audienceResponse.status).toBe(200)

    const audienceGetResponse = await app.request(`/audience/${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    expect(audienceGetResponse.status).toBe(200)

    const startResponse = await app.request('/generation/start', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId }),
    })
    expect(startResponse.status).toBe(202)

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const listResponse = await app.request(`/generation/${projectId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      const listed = (await listResponse.json()) as {
        data: { jobs: Array<{ status: string }> }
      }

      if (
        listed.data.jobs.length === 8 &&
        listed.data.jobs.every((job) => job.status === 'complete')
      ) {
        expect(listed.data.jobs.length).toBe(8)
        return
      }

      await sleep(50)
    }

    throw new Error('Timed out waiting for generation jobs to complete in db mode')
  })

  it('persists puzzle, material, layout, narrative, collaborator, and revision data across app instances', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, uniqueEmail('dbmode-persistence'))
    const project = await createProject(app, token)
    const projectId = project.data.project.id

    const authHeaders = { authorization: `Bearer ${token}` }
    const jsonHeaders = { ...authHeaders, 'content-type': 'application/json' }

    const puzzlesResponse = await app.request('/puzzles/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId, count: 2 }),
    })
    expect(puzzlesResponse.status).toBe(200)

    const materialsResponse = await app.request('/materials/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId }),
    })
    expect(materialsResponse.status).toBe(200)

    const layoutResponse = await app.request(`/layouts/${projectId}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({
        width: 800,
        height: 600,
        zones: [
          { id: 'zone-a', name: 'Start', x: 10, y: 10, width: 200, height: 180, color: '#93c5fd' },
        ],
        objects: [{ id: 'obj-a', kind: 'prop', label: 'Key Chest', x: 120, y: 120 }],
        overlays: { lighting: true, sound: true, emergency: false },
      }),
    })
    expect(layoutResponse.status).toBe(200)

    const narrativesResponse = await app.request('/narratives/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId, tone: 'dramatic' }),
    })
    expect(narrativesResponse.status).toBe(200)

    const collaboratorInviteResponse = await app.request('/collaborators/invite', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId, email: 'teammate-db@example.com', role: 'commenter' }),
    })
    expect(collaboratorInviteResponse.status).toBe(200)

    const collaboratorCommentResponse = await app.request('/collaborators/comment', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId, content: 'Keep final puzzle hint concise.' }),
    })
    expect(collaboratorCommentResponse.status).toBe(200)

    const revisionResponse = await app.request('/revisions/snapshot', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId, label: 'db-checkpoint', payload: { phase: 'review' } }),
    })
    expect(revisionResponse.status).toBe(200)

    const appReloaded = createApp()

    const listPuzzlesResponse = await appReloaded.request(`/puzzles/${projectId}`, {
      headers: authHeaders,
    })
    expect(listPuzzlesResponse.status).toBe(200)
    const listedPuzzles = (await listPuzzlesResponse.json()) as {
      data: { puzzles: Array<{ id: string }> }
    }
    expect(listedPuzzles.data.puzzles.length).toBe(2)

    const listMaterialsResponse = await appReloaded.request(`/materials/${projectId}`, {
      headers: authHeaders,
    })
    expect(listMaterialsResponse.status).toBe(200)
    const listedMaterials = (await listMaterialsResponse.json()) as {
      data: { items: Array<{ id: string }> }
    }
    expect(listedMaterials.data.items.length).toBeGreaterThan(0)

    const getLayoutResponse = await appReloaded.request(`/layouts/${projectId}`, {
      headers: authHeaders,
    })
    expect(getLayoutResponse.status).toBe(200)
    const layoutPayload = (await getLayoutResponse.json()) as {
      data: { layout: { width: number } | null }
    }
    expect(layoutPayload.data.layout?.width).toBe(800)

    const listNarrativesResponse = await appReloaded.request(`/narratives/${projectId}`, {
      headers: authHeaders,
    })
    expect(listNarrativesResponse.status).toBe(200)
    const narrativePayload = (await listNarrativesResponse.json()) as {
      data: { scripts: Array<{ id: string }> }
    }
    expect(narrativePayload.data.scripts.length).toBe(4)

    const listCollaboratorsResponse = await appReloaded.request(`/collaborators/${projectId}`, {
      headers: authHeaders,
    })
    expect(listCollaboratorsResponse.status).toBe(200)
    const collaboratorsPayload = (await listCollaboratorsResponse.json()) as {
      data: { collaborators: Array<{ id: string }>; comments: Array<{ id: string }> }
    }
    expect(collaboratorsPayload.data.collaborators.length).toBe(1)
    expect(collaboratorsPayload.data.comments.length).toBe(1)

    const listRevisionsResponse = await appReloaded.request(`/revisions/${projectId}`, {
      headers: authHeaders,
    })
    expect(listRevisionsResponse.status).toBe(200)
    const revisionsPayload = (await listRevisionsResponse.json()) as {
      data: { snapshots: Array<{ id: string }> }
    }
    expect(revisionsPayload.data.snapshots.length).toBe(1)
  })

  it('rejects cross-project updates for puzzle, material, and narrative records', async () => {
    const app = createApp()
    const token = await registerAndGetToken(app, uniqueEmail('dbmode-cross-project'))
    const projectA = await createProject(app, token)
    const projectB = await createProject(app, token)
    const projectAId = projectA.data.project.id
    const projectBId = projectB.data.project.id

    const authHeaders = { authorization: `Bearer ${token}` }
    const jsonHeaders = { ...authHeaders, 'content-type': 'application/json' }

    const puzzlesResponse = await app.request('/puzzles/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId: projectAId, count: 1 }),
    })
    expect(puzzlesResponse.status).toBe(200)
    const puzzlesPayload = (await puzzlesResponse.json()) as {
      data: { puzzles: Array<{ id: string; title: string }> }
    }
    const puzzleId = puzzlesPayload.data.puzzles[0]?.id
    expect(puzzleId).toBeDefined()

    const materialsResponse = await app.request('/materials/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId: projectAId }),
    })
    expect(materialsResponse.status).toBe(200)
    const materialsPayload = (await materialsResponse.json()) as {
      data: { items: Array<{ id: string; quantity: number }> }
    }
    const materialId = materialsPayload.data.items[0]?.id
    expect(materialId).toBeDefined()

    const narrativesResponse = await app.request('/narratives/generate', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ projectId: projectAId, tone: 'cinematic' }),
    })
    expect(narrativesResponse.status).toBe(200)
    const narrativesPayload = (await narrativesResponse.json()) as {
      data: { scripts: Array<{ id: string; content: string }> }
    }
    const narrativeId = narrativesPayload.data.scripts[0]?.id
    expect(narrativeId).toBeDefined()

    const puzzlePatchResponse = await app.request(`/puzzles/${puzzleId}?projectId=${projectBId}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify({ title: 'Should not update' }),
    })
    expect(puzzlePatchResponse.status).toBe(404)

    const materialPatchResponse = await app.request(
      `/materials/${materialId}?projectId=${projectBId}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ quantity: 99 }),
      },
    )
    expect(materialPatchResponse.status).toBe(404)

    const narrativePatchResponse = await app.request(
      `/narratives/${narrativeId}?projectId=${projectBId}`,
      {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ content: 'Should not update' }),
      },
    )
    expect(narrativePatchResponse.status).toBe(404)

    const puzzleListResponse = await app.request(`/puzzles/${projectAId}`, { headers: authHeaders })
    const puzzleListPayload = (await puzzleListResponse.json()) as {
      data: { puzzles: Array<{ title: string }> }
    }
    expect(puzzleListPayload.data.puzzles[0]?.title).not.toBe('Should not update')

    const materialListResponse = await app.request(`/materials/${projectAId}`, {
      headers: authHeaders,
    })
    const materialListPayload = (await materialListResponse.json()) as {
      data: { items: Array<{ quantity: number }> }
    }
    expect(materialListPayload.data.items[0]?.quantity).not.toBe(99)

    const narrativeListResponse = await app.request(`/narratives/${projectAId}`, {
      headers: authHeaders,
    })
    const narrativeListPayload = (await narrativeListResponse.json()) as {
      data: { scripts: Array<{ content: string }> }
    }
    expect(narrativeListPayload.data.scripts[0]?.content).not.toBe('Should not update')
  })

  it('enforces auth duplicate-email and project ownership rules in db mode', async () => {
    const app = createApp()
    const duplicateEmail = `dbmode-dup-${Date.now()}@example.com`

    const firstRegister = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: duplicateEmail, password: 'supersecret123' }),
    })
    expect(firstRegister.status).toBe(201)

    const secondRegister = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: duplicateEmail, password: 'supersecret123' }),
    })
    expect(secondRegister.status).toBe(409)

    const ownerToken = await registerAndGetToken(app, `dbmode-owner-${Date.now()}@example.com`)
    const viewerToken = await registerAndGetToken(app, `dbmode-viewer-${Date.now()}@example.com`)

    const ownerProject = await createProject(app, ownerToken)
    const projectId = ownerProject.data.project.id

    const appReloaded = createApp()

    const ownerRead = await appReloaded.request(`/projects/${projectId}`, {
      headers: { authorization: `Bearer ${ownerToken}` },
    })
    expect(ownerRead.status).toBe(200)

    const ownerPatch = await appReloaded.request(`/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({ status: 'active' }),
    })
    expect(ownerPatch.status).toBe(200)

    const forbiddenRead = await appReloaded.request(`/projects/${projectId}`, {
      headers: { authorization: `Bearer ${viewerToken}` },
    })
    expect(forbiddenRead.status).toBe(403)

    const forbiddenPatch = await appReloaded.request(`/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${viewerToken}`,
      },
      body: JSON.stringify({ name: 'Should Not Patch' }),
    })
    expect(forbiddenPatch.status).toBe(403)
  })
})
