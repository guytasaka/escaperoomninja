import { z } from 'zod'

import type { ProjectCard } from '../types'

const projectSchema: z.ZodType<ProjectCard> = z.object({
  id: z.string(),
  name: z.string(),
  genre: z.string(),
  roomType: z.string(),
  status: z.enum(['draft', 'active', 'archived']),
  updatedAt: z.string(),
})

const projectListSchema = z.array(projectSchema)

export interface CreateProjectInput {
  name: string
  genre: string
  roomType: string
}

export interface GenerateConceptInput {
  projectId: string
  prompt: string
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
