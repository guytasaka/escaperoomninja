# AGENTS.md
Agent operating guide for this repository.
## 1) Current Repo Reality
- This repository currently contains planning/reference docs, not an initialized monorepo.
- Primary sources used to derive this guide:
  - `escape-room-forge-COMPLETE.md`
  - `escape-room-forge-prd.md`
- Treat this file as the implementation contract until real code/config files exist.
## 2) Intended Stack (from docs)
- Monorepo: Turborepo
- Package manager: pnpm
- Frontend: Next.js App Router + Tailwind + shadcn/ui
- API: Hono
- Database: PostgreSQL + Drizzle ORM
- Jobs/queue: BullMQ + Redis/Valkey
- Storage: MinIO (S3-compatible)
- Testing: Vitest (unit/integration), Playwright (E2E)
- Lint/format: Biome
- Language: TypeScript across all packages/apps
## 3) Build, Lint, and Test Commands
Use these commands once the monorepo is scaffolded.
### 3.1 Bootstrap and local dev
```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm --filter db migrate
pnpm --filter db seed
pnpm dev
```
### 3.2 Root commands
```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm typecheck
```
### 3.3 Turborepo commands
```bash
pnpm turbo run dev --filter=web --filter=api
pnpm turbo run build
pnpm turbo run test
pnpm turbo run lint
pnpm turbo run typecheck
```
### 3.4 Package-scoped commands
```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter db migrate
pnpm --filter db seed
pnpm --filter shared test
pnpm --filter ai test
```
### 3.5 Single-test commands (prefer these)
Vitest single file:
```bash
pnpm --filter <pkg> vitest run src/path/to/file.test.ts
```
Vitest single test by name:
```bash
pnpm --filter <pkg> vitest run -t "test name fragment"
```
Vitest watch one file:
```bash
pnpm --filter <pkg> vitest src/path/to/file.test.ts
```
Playwright single spec:
```bash
pnpm --filter web playwright test tests/e2e/smoke.spec.ts
```
Playwright single test title:
```bash
pnpm --filter web playwright test -g "title fragment"
```
Playwright single browser project:
```bash
pnpm --filter web playwright test --project=chromium tests/e2e/smoke.spec.ts
```
### 3.6 Biome commands
```bash
pnpm biome check .
pnpm biome check . --write
pnpm biome format .
```
## 4) Coding Conventions for Agents
### 4.1 Architecture and boundaries
- Keep `apps/web` for UI and route-level composition; keep `apps/api` for transport/middleware.
- Keep business logic in service layers (`services/*`), not route handlers.
- Keep cross-app contracts in `packages/shared` (types/constants/validation).
- Keep provider adapters behind interfaces in `packages/ai`; do not leak vendor specifics upstream.
### 4.2 Imports and module structure
- Import order: external packages, internal aliases, relative imports.
- Prefer aliases over deep relative paths once aliases are configured.
- Use `import type` for type-only imports.
- Avoid circular dependencies across packages.
### 4.3 Formatting and linting
- Biome is the source of truth for style and linting.
- Run Biome on touched files before finalizing.
- Do not manually fight formatter output.
### 4.4 TypeScript and runtime validation
- Assume strict TypeScript mode.
- Avoid `any`; if unavoidable, isolate and document why.
- Prefer explicit return types on public functions and module boundaries.
- Use Zod (or equivalent schema layer) for request payload and env validation.
- Prefer discriminated unions for finite states (phase/status/job state).
### 4.5 Naming conventions
- `PascalCase`: React components, classes, interfaces/types.
- `camelCase`: variables, functions, methods, hooks.
- `UPPER_SNAKE_CASE`: environment constants.
- `kebab-case`: files/directories unless framework requires otherwise.
- Hook names must start with `use`.
### 4.6 API, DTOs, and error handling
- Validate params/body/query at API boundaries.
- Return consistent error envelopes from all routes.
- Use typed/domain errors in services; map to HTTP responses in handlers.
- Log actionable metadata only; never log secrets or full tokens.
- Retry only transient failures (network/provider/queue), with backoff and limits.
### 4.7 Async jobs and streaming
- Keep queue payloads serializable and version-tolerant.
- Design workers to be idempotent where feasible.
- Persist explicit status transitions (`queued`, `processing`, `complete`, `failed`, etc.).
- Use SSE for long-running generation progress; do not block request/response lifecycle.
### 4.8 Database and migrations
- Drizzle schema is source of truth.
- All schema changes must be migration-backed.
- Use transactions for multi-step writes requiring consistency.
- Preserve history via revision/version tables; avoid destructive overwrites.
### 4.9 Frontend expectations
- Follow Next.js App Router conventions.
- Keep client components minimal; prefer server-safe boundaries.
- Co-locate feature components by domain (builder, puzzles, narrative, layout, generation).
- Implement explicit loading/empty/error states.
- Maintain responsive behavior for dashboard, review, and download flows.
### 4.10 Testing expectations
- Unit: utilities, validators, adapters, quality-gate logic.
- Integration: API routes, workers, storage/queue integrations.
- E2E: auth, wizard progression, generation, and download critical path.
- Bug fixes should include a regression test when practical.
### 4.11 Security and configuration
- Never commit secrets; use `.env` and secure key storage.
- Sanitize user-editable rich text before render/export.
- Enforce auth and role checks in middleware for protected/admin routes.
- Keep provider API keys out of UI payloads, logs, and error messages.
## 5) Cursor and Copilot Rules Check
- `.cursor/rules/`: not found
- `.cursorrules`: not found
- `.github/copilot-instructions.md`: not found
- If added later, treat them as higher-priority instructions and merge into this guide.
## 6) Agent Delivery Checklist
- Run lint/format/typecheck for touched packages.
- Run targeted tests relevant to changed logic (use single-test commands above).
- Update docs/types/schemas together when contracts change.
- Keep changes scoped; avoid unrelated refactors.
- Call out required follow-ups (migrations, env vars, operational steps).
