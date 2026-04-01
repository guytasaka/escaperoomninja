# Escape Room Ninja

Monorepo for Escape Room Forge, built with Turborepo and pnpm.

## Quick Start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start local infrastructure:

   ```bash
   docker compose up -d
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Run development:

   ```bash
   pnpm dev
   ```

## Workspace Layout

- `apps/web` - Next.js frontend placeholder
- `apps/api` - Hono API placeholder
- `packages/db` - Drizzle schema and migration package
- `packages/shared` - shared types/constants/utils
- `packages/ai` - AI provider abstraction package

## Common commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## API DB-mode test

```bash
DATABASE_URL="postgresql://forge:forge_dev@localhost:5432/escape_room_forge" pnpm test:db
```

## Contributor docs

- Contribution guide: `CONTRIBUTING.md`
- Agent operating guide: `AGENTS.md`
- Pull request template: `.github/pull_request_template.md`
