import { z } from 'zod'

import type {
  AudienceProfileCard,
  BudgetSummaryCard,
  BusinessPlanCard,
  MaterialItemCard,
  NarrativeScriptCard,
  ProjectCard,
  PuzzleAnalyticsCard,
  PuzzleCard,
  PuzzleFlowGraph,
  RoomLayoutCard,
  TtsPreviewCard,
} from '../types'

const projectSchema: z.ZodType<ProjectCard> = z.object({
  id: z.string(),
  name: z.string(),
  genre: z.string(),
  roomType: z.string(),
  status: z.enum(['draft', 'active', 'archived']),
  updatedAt: z.string(),
})

const projectListSchema = z.array(projectSchema)

const audienceProfileSchema: z.ZodType<AudienceProfileCard> = z.object({
  projectId: z.string(),
  groupSize: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  audienceType: z.enum(['friends', 'family', 'corporate', 'enthusiasts']),
  psychologyProfile: z.string(),
  recommendations: z.array(z.string()),
})

const puzzleSchema: z.ZodType<PuzzleCard> = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  type: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedMinutes: z.number(),
  description: z.string(),
  order: z.number(),
})

const puzzleListSchema = z.array(puzzleSchema)

const puzzleFlowSchema: z.ZodType<PuzzleFlowGraph> = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      order: z.number(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
    }),
  ),
})

const puzzleAnalyticsSchema: z.ZodType<PuzzleAnalyticsCard> = z.object({
  difficultyCurve: z.array(
    z.object({
      order: z.number(),
      difficultyScore: z.number(),
      title: z.string(),
    }),
  ),
  timingBlueprint: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      estimatedMinutes: z.number(),
      cumulativeMinutes: z.number(),
    }),
  ),
  totalMinutes: z.number(),
})

const narrativeScriptSchema: z.ZodType<NarrativeScriptCard> = z.object({
  id: z.string(),
  projectId: z.string(),
  category: z.enum(['intro', 'hint', 'gm', 'ending']),
  title: z.string(),
  content: z.string(),
})

const narrativeListSchema = z.array(narrativeScriptSchema)

const ttsPreviewSchema: z.ZodType<TtsPreviewCard> = z.object({
  audioUrl: z.string(),
  voice: z.string(),
  estimatedDurationSec: z.number(),
})

const roomLayoutSchema: z.ZodType<RoomLayoutCard> = z.object({
  projectId: z.string(),
  width: z.number(),
  height: z.number(),
  zones: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      color: z.string(),
    }),
  ),
  objects: z.array(
    z.object({
      id: z.string(),
      kind: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  ),
  overlays: z.object({
    lighting: z.boolean(),
    sound: z.boolean(),
    emergency: z.boolean(),
  }),
})

const materialItemSchema: z.ZodType<MaterialItemCard> = z.object({
  id: z.string(),
  projectId: z.string(),
  category: z.enum(['props', 'electronics', 'decor', 'tools', 'misc']),
  name: z.string(),
  quantity: z.number(),
  unitCost: z.number(),
  vendorUrl: z.string().url().nullable(),
  alternatives: z.array(z.string()),
  threeDPrintable: z.boolean(),
})

const materialListSchema = z.array(materialItemSchema)

const budgetSummarySchema: z.ZodType<BudgetSummaryCard> = z.object({
  projectId: z.string(),
  totalsByCategory: z.object({
    props: z.number(),
    electronics: z.number(),
    decor: z.number(),
    tools: z.number(),
    misc: z.number(),
  }),
  totalCost: z.number(),
  allocatedBudget: z.number(),
  remainingBudget: z.number(),
})

const businessPlanSchema: z.ZodType<BusinessPlanCard> = z.object({
  projectId: z.string(),
  pricingStrategy: z.string(),
  financialProjection: z.string(),
  marketingPlan: z.string(),
})

export interface CreateProjectInput {
  name: string
  genre: string
  roomType: string
}

export interface GenerateConceptInput {
  projectId: string
  prompt: string
}

export interface GenerateAudienceInput {
  projectId: string
  groupSize: number
  difficulty: AudienceProfileCard['difficulty']
  audienceType: AudienceProfileCard['audienceType']
}

export interface GeneratePuzzlesInput {
  projectId: string
  count: number
}

export interface GenerateNarrativeInput {
  projectId: string
  tone?: string
}

export const listProjects = async (apiUrl: string, token: string): Promise<ProjectCard[]> => {
  const response = await fetch(`${apiUrl}/projects`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { projects: unknown } }
  return projectListSchema.parse(payload.data.projects)
}

export const createProject = async (
  apiUrl: string,
  token: string,
  input: CreateProjectInput,
): Promise<ProjectCard> => {
  const response = await fetch(`${apiUrl}/projects`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { project: unknown } }
  return projectSchema.parse(payload.data.project)
}

export const generateConcept = async (
  apiUrl: string,
  token: string,
  input: GenerateConceptInput,
): Promise<string> => {
  const response = await fetch(`${apiUrl}/concept/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate concept: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { concept: string } }
  return payload.data.concept
}

export const generateMoodBoard = async (
  apiUrl: string,
  token: string,
  input: GenerateConceptInput,
): Promise<string[]> => {
  const response = await fetch(`${apiUrl}/concept/mood-board`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate mood board: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { images: string[] } }
  return payload.data.images
}

export const generateAudience = async (
  apiUrl: string,
  token: string,
  input: GenerateAudienceInput,
): Promise<AudienceProfileCard> => {
  const response = await fetch(`${apiUrl}/audience/recommendations`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate audience profile: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { profile: unknown } }
  return audienceProfileSchema.parse(payload.data.profile)
}

export const listPuzzles = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<PuzzleCard[]> => {
  const response = await fetch(`${apiUrl}/puzzles/${projectId}`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to list puzzles: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { puzzles: unknown } }
  return puzzleListSchema.parse(payload.data.puzzles)
}

export const generatePuzzles = async (
  apiUrl: string,
  token: string,
  input: GeneratePuzzlesInput,
): Promise<PuzzleCard[]> => {
  const response = await fetch(`${apiUrl}/puzzles/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate puzzles: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { puzzles: unknown } }
  return puzzleListSchema.parse(payload.data.puzzles)
}

export const updatePuzzle = async (
  apiUrl: string,
  token: string,
  projectId: string,
  puzzleId: string,
  input: Partial<
    Pick<PuzzleCard, 'title' | 'difficulty' | 'estimatedMinutes' | 'description' | 'order'>
  >,
): Promise<PuzzleCard> => {
  const response = await fetch(`${apiUrl}/puzzles/${puzzleId}?projectId=${projectId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to update puzzle: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { puzzle: unknown } }
  return puzzleSchema.parse(payload.data.puzzle)
}

export const getPuzzleFlow = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<PuzzleFlowGraph> => {
  const response = await fetch(`${apiUrl}/puzzles/${projectId}/flow`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to load puzzle flow: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { flow: unknown } }
  return puzzleFlowSchema.parse(payload.data.flow)
}

export const getPuzzleAnalytics = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<PuzzleAnalyticsCard> => {
  const response = await fetch(`${apiUrl}/puzzles/${projectId}/analytics`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to load puzzle analytics: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { analytics: unknown } }
  return puzzleAnalyticsSchema.parse(payload.data.analytics)
}

export const generateNarratives = async (
  apiUrl: string,
  token: string,
  input: GenerateNarrativeInput,
): Promise<NarrativeScriptCard[]> => {
  const response = await fetch(`${apiUrl}/narratives/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate narratives: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { scripts: unknown } }
  return narrativeListSchema.parse(payload.data.scripts)
}

export const listNarratives = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<NarrativeScriptCard[]> => {
  const response = await fetch(`${apiUrl}/narratives/${projectId}`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to list narratives: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { scripts: unknown } }
  return narrativeListSchema.parse(payload.data.scripts)
}

export const updateNarrativeScript = async (
  apiUrl: string,
  token: string,
  projectId: string,
  scriptId: string,
  content: string,
): Promise<NarrativeScriptCard> => {
  const response = await fetch(`${apiUrl}/narratives/${scriptId}?projectId=${projectId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update narrative script: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { script: unknown } }
  return narrativeScriptSchema.parse(payload.data.script)
}

export const previewNarrativeTts = async (
  apiUrl: string,
  token: string,
  projectId: string,
  text: string,
  voice: string,
): Promise<TtsPreviewCard> => {
  const response = await fetch(`${apiUrl}/preview/tts`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId, text, voice }),
  })

  if (!response.ok) {
    throw new Error(`Failed to preview TTS: ${response.status}`)
  }

  const payload = (await response.json()) as { data: unknown }
  return ttsPreviewSchema.parse(payload.data)
}

export const saveLayout = async (
  apiUrl: string,
  token: string,
  projectId: string,
  layout: Omit<RoomLayoutCard, 'projectId'>,
): Promise<RoomLayoutCard> => {
  const response = await fetch(`${apiUrl}/layouts/${projectId}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(layout),
  })

  if (!response.ok) {
    throw new Error(`Failed to save layout: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { layout: unknown } }
  return roomLayoutSchema.parse(payload.data.layout)
}

export const getLayout = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<RoomLayoutCard | null> => {
  const response = await fetch(`${apiUrl}/layouts/${projectId}`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to load layout: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { layout: unknown } }
  if (!payload.data.layout) {
    return null
  }

  return roomLayoutSchema.parse(payload.data.layout)
}

export const exportLayoutSvg = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<string> => {
  const response = await fetch(`${apiUrl}/layouts/${projectId}/export-svg`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to export layout SVG: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { svg: string } }
  return payload.data.svg
}

export const generateMaterials = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<MaterialItemCard[]> => {
  const response = await fetch(`${apiUrl}/materials/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate materials: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { items: unknown } }
  return materialListSchema.parse(payload.data.items)
}

export const enrichMaterials = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<MaterialItemCard[]> => {
  const response = await fetch(`${apiUrl}/materials/enrich`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to enrich materials: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { items: unknown } }
  return materialListSchema.parse(payload.data.items)
}

export const listMaterials = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<MaterialItemCard[]> => {
  const response = await fetch(`${apiUrl}/materials/${projectId}`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to list materials: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { items: unknown } }
  return materialListSchema.parse(payload.data.items)
}

export const updateMaterial = async (
  apiUrl: string,
  token: string,
  projectId: string,
  itemId: string,
  input: Partial<
    Pick<
      MaterialItemCard,
      'quantity' | 'unitCost' | 'vendorUrl' | 'alternatives' | 'threeDPrintable'
    >
  >,
): Promise<MaterialItemCard> => {
  const response = await fetch(`${apiUrl}/materials/${itemId}?projectId=${projectId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to update material: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { item: unknown } }
  return materialItemSchema.parse(payload.data.item)
}

export const getBudgetSummary = async (
  apiUrl: string,
  token: string,
  projectId: string,
  allocatedBudget = 1200,
): Promise<BudgetSummaryCard> => {
  const response = await fetch(
    `${apiUrl}/materials/${projectId}/budget?allocatedBudget=${allocatedBudget}`,
    {
      headers: { authorization: `Bearer ${token}` },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to load budget summary: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { summary: unknown } }
  return budgetSummarySchema.parse(payload.data.summary)
}

export const generateBusinessPlan = async (
  apiUrl: string,
  token: string,
  projectId: string,
): Promise<BusinessPlanCard> => {
  const response = await fetch(`${apiUrl}/business/generate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId }),
  })

  if (!response.ok) {
    throw new Error(`Failed to generate business plan: ${response.status}`)
  }

  const payload = (await response.json()) as { data: { plan: unknown } }
  return businessPlanSchema.parse(payload.data.plan)
}
