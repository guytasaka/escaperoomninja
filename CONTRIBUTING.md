# Contributing

Thanks for contributing to Escape Room Ninja.

## Prerequisites

- Node.js 20+
- pnpm 10
- Docker (for local infrastructure)

## Local setup

```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm dev
```

## Development commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Pull requests

- Keep PRs focused and scoped.
- Update docs when behavior or contracts change.
- Ensure CI checks pass before requesting review:
  - `lint`
  - `typecheck`
  - `test`
  - `build`

## Project structure

- `apps/web`: frontend app
- `apps/api`: API app
- `packages/db`: Drizzle schema/client/migrations
- `packages/shared`: shared types/contracts
- `packages/ai`: AI provider abstractions
