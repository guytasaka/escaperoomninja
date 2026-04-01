# Architecture Decisions

## Initial decisions

- Monorepo managed by Turborepo + pnpm
- Strict TypeScript baseline shared through `tsconfig.base.json`
- Biome for formatting and linting
- Local dependencies via Docker Compose: Postgres, Valkey, MinIO
- Runtime environment validation via Zod in `packages/shared`
