import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  AUTH_SECRET: z.string().min(16),
  OPENROUTER_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
})

export type AppEnv = z.infer<typeof envSchema>

export const parseEnv = (raw: Record<string, string | undefined>): AppEnv => {
  return envSchema.parse(raw)
}
