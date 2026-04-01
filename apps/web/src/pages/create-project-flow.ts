import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(3),
  genre: z.string().min(2),
  roomType: z.string().min(2),
})

export type CreateProjectForm = z.infer<typeof createProjectSchema>

export const validateCreateProjectInput = (input: unknown): CreateProjectForm => {
  return createProjectSchema.parse(input)
}
