# Escape Room Forge — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** March 2026

---

## 1. EXECUTIVE SUMMARY

Escape Room Forge is a SaaS platform that guides users through designing, planning, and producing a complete, launch-ready escape room — including all physical assets, media files, business documents, and marketing materials. The system acts as an AI-powered design partner that walks users through a structured creative process, generating professional-grade deliverables at each stage that culminate in a downloadable, branded ZIP package ready to build and launch.

Unlike template-based planning tools, Escape Room Forge actually **generates** the finished products: print-ready prop PDFs, voice/audio narration files, video intro sequences, room layout diagrams, puzzle flow charts, 3D-printable prop files (STL), branded marketing kits, and a complete business operations manual — all tailored to the user's specific room concept.

**Business Model:** One-time purchase per room plan ($1,000), with the platform generating a complete "business-in-a-box" deliverable package.

---

## 2. RECOMMENDED TECH STACK

### Guiding Principle: No Vendor Lock-In

Every layer uses open standards, self-hostable alternatives exist, and data is always exportable.

### 2.1 Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14+ (App Router) | React ecosystem, SSR/SSG flexibility, API routes built-in. Can be self-hosted via Node. Not locked to Vercel — deploys on any Docker host. |
| **UI Library** | shadcn/ui + Tailwind CSS | Copy-paste components (not a dependency), fully ownable. No vendor. |
| **State Management** | Zustand | Lightweight, no boilerplate, works with React Server Components. |
| **Rich Text Editing** | Tiptap (ProseMirror-based) | For editing generated scripts, narratives, and documents inline. Open source. |
| **Diagram Rendering** | React Flow (puzzle flow diagrams) + Konva.js (room layouts) | Both open source. React Flow for node-based flow charts, Konva for 2D canvas-based spatial layouts. |
| **3D Preview** | Three.js / React Three Fiber | For optional 3D room previews and STL preview rendering. Open source. |
| **PDF Viewer** | react-pdf | For previewing generated print-ready documents. |

### 2.2 Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Runtime** | Node.js 20+ | Matches frontend ecosystem, excellent async I/O for LLM streaming. |
| **Framework** | Hono | Ultra-lightweight, runs on any runtime (Node, Bun, Deno, Cloudflare Workers). Not locked to any platform. |
| **API Pattern** | REST + Server-Sent Events (SSE) | REST for CRUD, SSE for streaming LLM generation progress. WebSocket optional for real-time collaboration later. |
| **Job Queue** | BullMQ (Redis-backed) | For async media generation jobs (audio, video, images, 3D). Open source, self-hostable. |
| **File Storage** | MinIO (S3-compatible) | Self-hostable object storage. Same API as AWS S3, so can swap to S3, Backblaze B2, Cloudflare R2 without code changes. |
| **PDF Generation** | Puppeteer (HTML→PDF) + ReportLab (Python, for complex layouts) | Puppeteer for templated docs, ReportLab for precise print-ready props. |
| **DOCX Generation** | docx-js (Node) | Same library used in the existing Escape Room Forge documents. |
| **3D File Generation** | OpenSCAD (CLI) + Three.js (STL export) | OpenSCAD for parametric 3D models, Three.js for simpler geometry export. Both open source. |
| **Video Composition** | Remotion (React-based video) + FFmpeg | Remotion for compositing narration + images + text into videos. FFmpeg for encoding. Both open source. |
| **Audio Processing** | FFmpeg + Sox | Post-processing AI-generated audio (normalization, effects, ambient mixing). |
| **ZIP Packaging** | Archiver (Node) | Streaming ZIP creation with folder structure and manifest. |

### 2.3 Database

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Primary DB** | PostgreSQL 16+ | Industry standard, JSON support, full-text search, self-hostable everywhere. |
| **ORM** | Drizzle ORM | Type-safe, lightweight, SQL-first (not an abstraction leaking). |
| **Migrations** | Drizzle Kit | Declarative schema migrations. |
| **Cache / Queue Backend** | Redis (Valkey) | BullMQ backend, session cache, rate limiting. Valkey is the open-source Redis fork. |

### 2.4 AI / LLM Layer

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **LLM Router** | OpenRouter API | Single API for all text LLMs. Admin-configurable model per task. |
| **Orchestration LLM** | Claude (via OpenRouter) | Main creative/narrative/structural generation. Highest quality for complex prompts. |
| **Routine Tasks LLM** | Admin-configurable (e.g., GPT-4o-mini, Llama, Mistral via OpenRouter) | Formatting, extraction, summarization, simpler generation. |
| **Image Generation** | Admin-configurable: DALL-E 3 (OpenAI API), Flux (Replicate/fal.ai), Stable Diffusion (Replicate), Leonardo (API), Ideogram (API) | Abstracted behind a unified image generation interface. Admin picks provider. |
| **Voice / TTS** | Admin-configurable: ElevenLabs, OpenAI TTS, PlayHT, Fish Audio | For narration, character voices, hint audio. Admin picks provider. |
| **Music / Ambient** | Suno API or Udio API (admin-configurable) + royalty-free library fallback | Background music, ambient soundscapes, triggered audio. |
| **Video Generation** | Remotion compositing (primary) + optional AI video (Runway/Kling via API for cinematic intros) | Remotion handles most video needs; AI video is an optional premium enhancement. |
| **3D Model Generation** | OpenSCAD parametric templates + optional Meshy/Tripo3D API for complex props | Parametric templates cover most needs; AI 3D gen is experimental enhancement. |

### 2.5 Infrastructure

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Containerization** | Docker + Docker Compose | Standard. Works everywhere. |
| **Deployment** | Any VPS (Hetzner, DigitalOcean, Railway, Fly.io) or self-hosted | No platform lock-in. Single `docker-compose up` deployment. |
| **CDN** | Cloudflare (free tier) or any S3-fronting CDN | For serving generated assets. |
| **Auth** | Lucia Auth (open source) or Auth.js (NextAuth v5) | Self-hosted auth, no SaaS dependency. Supports email/password, OAuth, magic links. |
| **Payments** | Stripe | Industry standard for one-time purchases. Webhook-driven. |
| **Email** | Resend or any SMTP | Transactional emails (receipts, plan delivery). |
| **Monitoring** | OpenTelemetry + Grafana | Open-source observability stack. |

### 2.6 Development Tooling

| Tool | Purpose |
|------|---------|
| **TypeScript** | End-to-end type safety (frontend + backend) |
| **Monorepo** | Turborepo — shared types, utilities between packages |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **CI/CD** | GitHub Actions |
| **Code Quality** | Biome (lint + format, replaces ESLint + Prettier) |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Builder  │ │ Preview  │ │  Editor  │ │  Dashboard │ │
│  │  Wizard   │ │  Panel   │ │  Suite   │ │  & Admin   │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    API LAYER (Hono)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Project  │ │Generation│ │  Asset   │ │   Admin    │ │
│  │   API    │ │   API    │ │   API    │ │    API     │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
└───────┼────────────┼────────────┼──────────────┼────────┘
        │            │            │              │
        ▼            ▼            ▼              ▼
┌───────────────┐ ┌─────────────────────────────────────┐
│  PostgreSQL   │ │         JOB QUEUE (BullMQ)           │
│  ┌──────────┐ │ │  ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐ │
│  │ Projects │ │ │  │Text │ │Image│ │Audio│ │Video │ │
│  │ Puzzles  │ │ │  │ Gen │ │ Gen │ │ Gen │ │ Gen  │ │
│  │ Assets   │ │ │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬───┘ │
│  │ Users    │ │ │     │       │       │        │     │
│  └──────────┘ │ └─────┼───────┼───────┼────────┼─────┘
└───────────────┘       │       │       │        │
                        ▼       ▼       ▼        ▼
              ┌─────────────────────────────────────────┐
              │          AI PROVIDER LAYER               │
              │  ┌───────────┐ ┌─────────────────────┐ │
              │  │OpenRouter  │ │  Media Providers     │ │
              │  │(LLM tasks) │ │  (Image/Audio/Video) │ │
              │  └───────────┘ └─────────────────────┘ │
              └─────────────────────────────────────────┘
                        │       │       │        │
                        ▼       ▼       ▼        ▼
              ┌─────────────────────────────────────────┐
              │      ASSET PIPELINE & STORAGE            │
              │  ┌──────────┐ ┌──────────┐ ┌──────────┐│
              │  │  MinIO   │ │ Remotion │ │ OpenSCAD ││
              │  │(S3 store)│ │(video)   │ │(3D/STL)  ││
              │  └──────────┘ └──────────┘ └──────────┘│
              └─────────────────────────────────────────┘
```

### 3.2 AI Provider Abstraction Layer

The system uses a **provider adapter pattern** so any AI service can be swapped without code changes:

```
┌──────────────────────────────────────┐
│        AI Service Interface          │
│  generateText(prompt, config)        │
│  generateImage(prompt, config)       │
│  generateAudio(text, voice, config)  │
│  generateMusic(prompt, config)       │
│  generateVideo(config)               │
│  generate3D(prompt, config)          │
└───────────────┬──────────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│Adapter │ │Adapter │ │Adapter │  ... (one per provider)
│OpenAI  │ │Eleven  │ │Replicate│
│DALL-E  │ │Labs    │ │Flux    │
└────────┘ └────────┘ └────────┘
```

**Admin Configuration Table:**

| Task Category | Config Key | Example Value |
|--------------|-----------|---------------|
| Orchestration (narrative, creative) | `llm.orchestrator` | `anthropic/claude-sonnet-4` |
| Routine (formatting, extraction) | `llm.routine` | `openai/gpt-4o-mini` |
| Image Generation | `media.image` | `openai/dall-e-3` |
| Voice / TTS | `media.voice` | `elevenlabs` |
| Music / Ambient | `media.music` | `suno` |
| Video (AI cinematic) | `media.video_ai` | `runway` |
| 3D Model Generation | `media.3d` | `openscad` (or `meshy`) |

All configurable via admin panel. Changes take effect immediately for new generation jobs.

---

## 4. DATA MODEL

### 4.1 Core Entities

```sql
-- Users & Auth
users
  id              UUID PK
  email           VARCHAR UNIQUE
  name            VARCHAR
  role            ENUM('user', 'admin')
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Projects (one per escape room plan)
projects
  id              UUID PK
  user_id         UUID FK → users
  title           VARCHAR
  status          ENUM('draft', 'in_progress', 'generating', 'complete', 'archived')
  genre           VARCHAR  -- mystery, horror, heist, etc.
  room_type       VARCHAR  -- brick_and_mortar, popup, mobile, etc.
  difficulty      ENUM('beginner', 'intermediate', 'advanced', 'expert')
  group_size_min  INT
  group_size_max  INT
  duration_min    INT      -- in minutes
  budget_tier     INT      -- in dollars
  current_phase   VARCHAR  -- tracks wizard progress
  theme_data      JSONB    -- concept, story, hook, emotional arc
  settings        JSONB    -- genre-specific settings
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Puzzles
puzzles
  id              UUID PK
  project_id      UUID FK → projects
  name            VARCHAR
  puzzle_type     VARCHAR  -- from catalog
  difficulty      INT      -- 1-5
  est_solve_min   INT
  player_req      VARCHAR  -- solo, pair, team
  flow_position   JSONB    -- sequence order, parallel track, dependencies
  description     TEXT
  mechanism       TEXT
  solution        TEXT
  hints           JSONB    -- array of 3 hint tiers
  materials       JSONB    -- items, quantities, costs, links
  reset_procedure TEXT
  reset_time_min  INT
  failure_mode    TEXT
  narrative_tie   TEXT
  accessibility   TEXT
  sort_order      INT
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Narrative Elements
narratives
  id              UUID PK
  project_id      UUID FK → projects
  type            ENUM('intro_script', 'briefing', 'clue_text', 'hint_audio_script',
                       'mid_reveal', 'win_ending', 'loss_ending', 'gm_script',
                       'audio_cue', 'video_script', 'red_herring', 'ambient_desc')
  title           VARCHAR
  content         TEXT     -- the actual script/text
  production_notes TEXT
  linked_puzzle_id UUID FK → puzzles (nullable)
  sort_order      INT
  metadata        JSONB   -- voice direction, timing, triggers, etc.
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Room Layout
room_layouts
  id              UUID PK
  project_id      UUID FK → projects
  dimensions      JSONB    -- length, width, height
  zones           JSONB    -- array of zone definitions
  entry_point     JSONB
  exit_point      JSONB
  gm_monitoring   JSONB
  emergency_exit  JSONB
  lighting_plan   JSONB
  sound_plan      JSONB
  furniture       JSONB    -- placed items with positions
  layout_data     JSONB    -- canvas/diagram state for rendering
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Generated Assets
assets
  id              UUID PK
  project_id      UUID FK → projects
  type            ENUM('image', 'audio', 'video', 'pdf', 'stl', 'docx', 'svg',
                       'diagram', 'marketing', 'music', '3d_model')
  category        VARCHAR  -- 'prop_print', 'concept_art', 'narration', 'hint_audio',
                           -- 'intro_video', 'room_diagram', 'flow_diagram',
                           -- 'marketing_flyer', 'fact_sheet', 'stl_prop',
                           -- 'ambient_audio', 'music_track', etc.
  title           VARCHAR
  description     TEXT
  file_path       VARCHAR  -- path in MinIO/S3
  file_size       BIGINT
  mime_type       VARCHAR
  generation_meta JSONB    -- model used, prompt, params, cost
  linked_puzzle_id UUID FK → puzzles (nullable)
  linked_narrative_id UUID FK → narratives (nullable)
  status          ENUM('pending', 'generating', 'complete', 'failed', 'regenerating')
  version         INT DEFAULT 1
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Asset Version History (every regeneration is preserved)
asset_versions
  id              UUID PK
  asset_id        UUID FK → assets
  version         INT
  file_path       VARCHAR  -- path in MinIO/S3 (previous version's file)
  file_size       BIGINT
  generation_meta JSONB    -- model, prompt, params, cost for this version
  created_at      TIMESTAMP
  -- When an asset is regenerated, the current file_path/meta is copied here
  -- before overwriting. Users can browse all previous versions and restore any.

-- Content Snapshots (revision history for text content: puzzles, narratives, concept)
content_snapshots
  id              UUID PK
  project_id      UUID FK → projects
  entity_type     ENUM('puzzle', 'narrative', 'concept', 'layout', 'business_plan')
  entity_id       UUID     -- FK to the specific record
  snapshot_data   JSONB    -- full copy of the entity at this point in time
  change_source   ENUM('ai_generation', 'user_edit', 'regeneration', 'phase_completion')
  change_note     TEXT     -- optional user or system note ("Regenerated with darker tone")
  created_at      TIMESTAMP
  -- Every AI generation and significant user edit creates a snapshot.
  -- Users can view timeline, diff any two versions, and restore any snapshot.

-- Materials / Shopping List
materials
  id              UUID PK
  project_id      UUID FK → projects
  puzzle_id       UUID FK → puzzles (nullable)
  category        VARCHAR  -- locks, props, set_dressing, lighting, sound, tech, print, consumable
  item_name       VARCHAR
  quantity        INT
  unit_cost       DECIMAL
  total_cost      DECIMAL
  source          VARCHAR  -- suggested vendor
  purchase_url    VARCHAR  -- direct link
  notes           TEXT
  is_3d_printable BOOLEAN DEFAULT false
  stl_asset_id    UUID FK → assets (nullable)
  sort_order      INT

-- Business Plan Data
business_plans
  id              UUID PK
  project_id      UUID FK → projects
  pricing_strategy JSONB   -- per-player pricing, group rates, etc.
  financial_projections JSONB  -- revenue model, expenses, breakeven
  marketing_plan  JSONB    -- channels, timeline, budget
  operations_plan JSONB    -- scheduling, staffing, maintenance
  gm_training     JSONB    -- curriculum, scripts, protocols
  legal_checklist JSONB    -- waivers, insurance, permits
  upsell_strategy JSONB

-- Generation Jobs (async tracking)
generation_jobs
  id              UUID PK
  project_id      UUID FK → projects
  asset_id        UUID FK → assets (nullable)
  job_type        VARCHAR  -- text, image, audio, video, 3d, pdf, diagram
  status          ENUM('queued', 'processing', 'complete', 'failed', 'cancelled')
  provider        VARCHAR  -- which AI provider was used
  model           VARCHAR  -- specific model identifier
  prompt          TEXT
  config          JSONB    -- model-specific parameters
  result          JSONB    -- raw API response metadata
  cost_cents      INT      -- tracked cost per generation
  error           TEXT
  started_at      TIMESTAMP
  completed_at    TIMESTAMP
  created_at      TIMESTAMP

-- Admin Config
admin_config
  id              UUID PK
  key             VARCHAR UNIQUE -- e.g., 'llm.orchestrator', 'media.image'
  value           JSONB          -- provider, model, api_key ref, params
  updated_at      TIMESTAMP
  updated_by      UUID FK → users

-- Collaborator invites (view/comment only)
collaborators
  id              UUID PK
  project_id      UUID FK → projects
  email           VARCHAR
  name            VARCHAR
  access_level    ENUM('view', 'comment')
  invite_token    VARCHAR
  accepted_at     TIMESTAMP
  created_at      TIMESTAMP
```

### 4.2 Project Phase State Machine

```
CONCEPT → AUDIENCE → PUZZLES → NARRATIVE → LAYOUT → BUDGET → REVIEW → GENERATE → COMPLETE
   ↑         ↑          ↑          ↑          ↑        ↑        ↑
   └─────────┴──────────┴──────────┴──────────┴────────┴────────┘
                    (user can go back to any previous phase)
```

Each phase persists independently. User can jump between phases. Moving to GENERATE triggers the full asset pipeline. Moving to COMPLETE locks the project (creates the ZIP). User can unlock (back to REVIEW) to make changes.

---

## 5. USER EXPERIENCE FLOW

### 5.1 Builder Wizard — Phase-by-Phase

The guided tour walks the user through each phase. At every phase, the user can:
- Accept AI suggestions as-is
- Edit AI output before proceeding
- Regenerate with different direction
- Go back to any previous phase
- See live previews of what's been built so far

#### Phase 1: CONCEPT

**User provides:**
- Genre selection (with definitions shown)
- Room type selection (with definitions shown)
- Free-text concept description OR guided "What If" prompts
- Theme keywords, mood, inspiration references

**System generates:**
- Room concept statement (logline equivalent)
- Story synopsis (2–3 paragraphs)
- Theme mood board (4–6 AI-generated concept images)
- Hook statement ("the one thing players will tell friends about")
- Emotional arc description (start → middle → end feelings)

**Preview:** Mood board gallery + concept card

#### Phase 2: AUDIENCE

**User provides/adjusts:**
- Target group size (min–max)
- Difficulty level
- Target audience type (families, enthusiasts, corporate, etc.)
- Duration (default 60 min)

**System generates:**
- Player psychology profile for the concept
- Group dynamic recommendations
- Difficulty calibration targets (success rate, hint targets)
- Accessibility considerations specific to the room design

**Preview:** Audience profile card with recommendations

#### Phase 3: PUZZLES

**User involvement:** This is the most interactive phase. The system proposes an initial puzzle set based on concept, genre, difficulty, and group size, then the user iterates.

**System generates:**
- Recommended puzzle count and flow structure (linear/parallel/hybrid)
- Initial puzzle set (8–12 puzzles) with full spec sheets:
  - Name, type, difficulty, solve time, player requirement
  - Description, mechanism, solution
  - 3-tier hints
  - Materials needed with costs
  - Reset procedure
  - Narrative connection
- Puzzle flow diagram (interactive, editable)
- Difficulty curve visualization
- Timing blueprint
- Dependency map

**User can:**
- Add/remove/reorder puzzles
- Swap puzzle types from the complete catalog
- Edit any detail of any puzzle
- Ask the system to "make this harder/easier"
- Ask for alternative puzzles ("give me 3 options for the midpoint puzzle")
- Drag-and-drop puzzle flow editing

**Preview:** Interactive puzzle flow diagram + timeline + difficulty curve chart

#### Phase 4: NARRATIVE

**System generates based on puzzles and concept:**
- Intro briefing script (with voice direction notes)
- All clue text for every puzzle
- Red herring text and placement
- Progressive hint scripts (3 tiers × every puzzle)
- Mid-game narrative reveal script(s)
- Win ending script
- Loss ending script
- Game master hosting script
- Pre-game briefing script
- Post-game debrief script
- Audio cue scripts (triggered sounds with timing)
- Video scripts (intro, reveals, endings) with shot-by-shot breakdowns

**User can:** Edit every script inline, regenerate individual scripts, adjust tone/length

**Preview:** Script reader view, audio preview (TTS quick-preview)

#### Phase 5: LAYOUT

**System generates:**
- Room layout diagram (2D, top-down)
- Zone designations with puzzle placements
- Furniture and prop placement suggestions
- Entry/exit flow, GM monitoring positions
- Emergency exit compliance
- Lighting plan (ambient, accent, UV, dynamic)
- Sound plan (speaker placement, ambient sources, triggered cues)
- Sight line analysis

**User can:** Drag-and-drop elements on canvas, resize zones, adjust placements

**Preview:** Interactive 2D room layout canvas + 3D preview (optional)

#### Phase 6: BUDGET & MATERIALS

**System generates:**
- Complete materials shopping list with:
  - Item name, quantity, unit cost, total cost
  - Direct purchase links (Amazon, specialty suppliers)
  - Alternative/budget options
  - 3D-printable flag for applicable props
- Budget breakdown by category
- Budget vs. allocation comparison
- 3D printing plans (STL files) for printable props
- Parts list with BOM (bill of materials) for electronic components

**User can:** Adjust quantities, swap items, mark items as "already have," add custom items

**Preview:** Budget dashboard with category breakdown chart

#### Phase 7: REVIEW & EDIT

Full preview of everything generated. User reviews all sections in a unified view:
- Complete room design document
- All puzzles and their specs
- All narrative scripts
- Layout diagram
- Budget summary
- Business plan elements

**User can:** Edit anything, regenerate anything, add notes for collaborators

#### Phase 8: GENERATE ASSETS

User triggers the full asset generation pipeline. A progress dashboard shows each job:

**Text Documents:**
- [ ] Master Room Design Document (DOCX + PDF)
- [ ] Puzzle Specification Binder (PDF)
- [ ] Complete Solution Guide (PDF)
- [ ] Game Master Manual (DOCX + PDF)
- [ ] Player Waiver Template (PDF, fillable)
- [ ] Reset Checklist (PDF, printable)
- [ ] Emergency Procedures (PDF)
- [ ] Maintenance Schedule (PDF)

**Print-Ready Props:**
- [ ] Aged letters and documents (PDF, high-res)
- [ ] Cipher wheels and decoder tools (PDF, cut-lines included)
- [ ] Evidence cards and case files (PDF)
- [ ] Wanted posters, newspaper clippings (PDF)
- [ ] Room signage and labels (PDF)
- [ ] Player briefing cards (PDF)
- [ ] Map fragments and overlays (PDF)
- [ ] Custom puzzle-specific printed materials (PDF per puzzle)

**Diagrams:**
- [ ] Room layout diagram (SVG + PDF, to scale)
- [ ] Puzzle flow diagram (SVG + PDF)
- [ ] Wiring diagram for electronics (SVG + PDF)
- [ ] Difficulty curve chart (SVG + PDF)
- [ ] Timeline blueprint (SVG + PDF)
- [ ] Reset flow diagram (SVG + PDF)

**Audio:**
- [ ] Intro narration (MP3/WAV)
- [ ] Hint audio files (MP3 per puzzle per tier)
- [ ] Mid-game reveal narration (MP3/WAV)
- [ ] Win ending narration (MP3/WAV)
- [ ] Loss ending narration (MP3/WAV)
- [ ] Triggered sound effects (MP3 per cue)
- [ ] Background ambient loop (MP3, seamless)
- [ ] Background music track(s) (MP3)

**Video:**
- [ ] Intro video (MP4, composited from narration + images + text)
- [ ] Win ending video (MP4)
- [ ] Loss ending video (MP4)
- [ ] Mid-game reveal video(s) (MP4, if applicable)
- [ ] Marketing promo video / trailer (MP4)

**3D Printing Files:**
- [ ] STL files for each printable prop
- [ ] Print settings recommendation per file (layer height, infill, material)
- [ ] Assembly instructions (PDF per multi-part prop)

**Marketing Kit:**
- [ ] Room fact sheet (PDF, single page)
- [ ] Marketing one-pager (PDF, designed)
- [ ] Social media post copy (text file, platform-specific)
- [ ] Email announcement template (HTML)
- [ ] Google My Business listing copy (text)
- [ ] Review request template (text)
- [ ] Grand opening event plan (PDF)
- [ ] Photography shot list (PDF)
- [ ] Press release template (DOCX)

**Business Documents:**
- [ ] Financial projections spreadsheet (XLSX or PDF)
- [ ] Pricing strategy guide (PDF)
- [ ] 12-month marketing calendar (PDF)
- [ ] Upsell strategy guide (PDF)
- [ ] Scaling roadmap (PDF)
- [ ] GM training curriculum (PDF)
- [ ] Customer service scripts (PDF)

**Progress UI shows:** A real-time dashboard with each asset showing status (queued → generating → complete), estimated time, and preview-on-complete.

#### Phase 9: DOWNLOAD

**System produces:**
- Single branded ZIP file
- Detailed manifest (JSON + human-readable PDF index)
- Organized folder structure:

```
escape-room-forge-[room-name]/
├── 00-MANIFEST.pdf
├── 00-MANIFEST.json
├── 01-MASTER-PLAN/
│   ├── room-design-document.docx
│   ├── room-design-document.pdf
│   └── executive-summary.pdf
├── 02-PUZZLES/
│   ├── puzzle-specification-binder.pdf
│   ├── solution-guide.pdf
│   ├── puzzle-flow-diagram.svg
│   ├── puzzle-flow-diagram.pdf
│   ├── difficulty-curve.svg
│   └── individual-specs/
│       ├── P-001-bookshelf-cipher.pdf
│       ├── P-002-desk-drawer.pdf
│       └── ...
├── 03-NARRATIVE/
│   ├── scripts/
│   │   ├── intro-briefing.pdf
│   │   ├── player-briefing-card.pdf
│   │   ├── win-ending.pdf
│   │   ├── loss-ending.pdf
│   │   ├── mid-game-reveals/
│   │   └── gm-scripts/
│   ├── clue-text/
│   │   ├── P-001-clues.pdf
│   │   └── ...
│   └── hint-scripts/
│       ├── P-001-hints.pdf
│       └── ...
├── 04-ROOM-LAYOUT/
│   ├── room-layout-diagram.svg
│   ├── room-layout-diagram.pdf
│   ├── lighting-plan.pdf
│   ├── sound-plan.pdf
│   ├── wiring-diagram.svg
│   └── wiring-diagram.pdf
├── 05-PRINT-READY-PROPS/
│   ├── aged-letters/
│   ├── cipher-tools/
│   ├── evidence-cards/
│   ├── signage/
│   ├── maps-and-overlays/
│   └── puzzle-specific/
│       ├── P-001-bookshelf-cipher-printable.pdf
│       └── ...
├── 06-3D-PRINTING/
│   ├── stl-files/
│   │   ├── hidden-compartment-box.stl
│   │   └── ...
│   ├── print-settings.pdf
│   └── assembly-instructions/
├── 07-AUDIO/
│   ├── narration/
│   │   ├── intro-narration.mp3
│   │   ├── win-ending.mp3
│   │   ├── loss-ending.mp3
│   │   └── mid-game-reveals/
│   ├── hints/
│   │   ├── P-001-hint-1.mp3
│   │   ├── P-001-hint-2.mp3
│   │   ├── P-001-hint-3.mp3
│   │   └── ...
│   ├── sound-effects/
│   ├── ambient/
│   │   └── background-loop.mp3
│   └── music/
│       └── theme-track.mp3
├── 08-VIDEO/
│   ├── intro-video.mp4
│   ├── win-ending-video.mp4
│   ├── loss-ending-video.mp4
│   └── marketing-trailer.mp4
├── 09-MARKETING-KIT/
│   ├── fact-sheet.pdf
│   ├── marketing-one-pager.pdf
│   ├── social-media-copy.txt
│   ├── email-template.html
│   ├── google-my-business-listing.txt
│   ├── review-request-template.txt
│   ├── grand-opening-plan.pdf
│   ├── photography-shot-list.pdf
│   ├── press-release.docx
│   └── concept-art/
│       ├── room-concept-01.png
│       ├── room-concept-02.png
│       └── ...
├── 10-BUSINESS/
│   ├── financial-projections.pdf
│   ├── pricing-strategy.pdf
│   ├── marketing-calendar.pdf
│   ├── upsell-strategy.pdf
│   ├── scaling-roadmap.pdf
│   └── operations/
│       ├── gm-training-curriculum.pdf
│       ├── customer-service-scripts.pdf
│       ├── reset-checklist.pdf
│       ├── maintenance-schedule.pdf
│       ├── emergency-procedures.pdf
│       └── player-waiver-template.pdf
└── 11-REFERENCE/
    ├── complete-puzzle-catalog.pdf
    ├── shopping-list-with-links.pdf
    ├── parts-list-electronics.pdf
    └── best-practices-guide.pdf
```

---

## 6. AI GENERATION PIPELINE

### 6.1 Pipeline Architecture

Each generation task flows through a standardized pipeline:

```
User Action → API Request → Job Created (BullMQ) → Worker Picks Up
→ Prompt Constructed (from project data + system templates)
→ AI Provider Called (via adapter)
→ Result Processed (format conversion, quality check)
→ Asset Stored (MinIO) → DB Updated → SSE Notification → UI Updates
```

### 6.2 Prompt System

The system maintains a **prompt library** — version-controlled prompt templates for every generation task. Each prompt template:

- References project data dynamically (concept, genre, puzzles, etc.)
- Includes system context (the Escape Room Forge "voice" and expertise)
- Has quality criteria and output format specifications
- Is tagged with the recommended model tier (orchestrator vs. routine)

**Prompt template example (narrative intro script):**
```
SYSTEM: You are the Narrative & Clue Writer agent of Escape Room Forge.
You write immersive, compelling scripts for escape room experiences.

PROJECT CONTEXT:
- Room: {{project.title}}
- Genre: {{project.genre}}
- Theme: {{project.theme_data.concept}}
- Story: {{project.theme_data.synopsis}}
- Duration: {{project.duration_min}} minutes
- Audience: {{project.difficulty}} difficulty, groups of {{project.group_size_min}}-{{project.group_size_max}}

TASK: Write the intro briefing script that players hear/see before entering the room.

REQUIREMENTS:
- Maximum 90 seconds when read aloud (~200 words)
- Structure: Hook (1-2 sentences) → Setup (who/where/why) → Stakes → Goal → Launch line
- Tone: {{genre_tone_map[project.genre]}}
- Include production notes (voice direction, music cue, delivery method)
- Output format: JSON { script, production_notes, estimated_duration_seconds, tone_notes, music_cue }
```

### 6.3 Generation Task Types & Model Routing

| Task | Model Tier | Output | Processing |
|------|-----------|--------|------------|
| Room concept & story | Orchestrator | JSON → DB | Direct |
| Puzzle specifications | Orchestrator | JSON → DB | Direct |
| Narrative scripts | Orchestrator | JSON → DB | Direct |
| Hint text | Orchestrator | JSON → DB | Direct |
| Business documents | Orchestrator | JSON → DOCX/PDF pipeline | Template merge |
| Shopping list + links | Routine | JSON → DB | Web search enrichment |
| Clue text formatting | Routine | Text → PDF pipeline | Template merge |
| Concept art images | Image provider | PNG → MinIO | Direct store |
| Print-ready prop PDFs | Routine + PDF pipeline | Structured text → ReportLab → PDF | Multi-step |
| Room layout diagram | Routine + SVG renderer | JSON positions → SVG/PDF | Programmatic |
| Puzzle flow diagram | Routine + React Flow export | JSON graph → SVG/PDF | Programmatic |
| Wiring diagrams | Routine + SVG renderer | JSON components → SVG/PDF | Programmatic |
| Voice narration | TTS provider | Audio file → MP3/WAV | FFmpeg post-process |
| Hint audio | TTS provider | Audio per hint → MP3 | FFmpeg post-process |
| Ambient soundscape | Music provider | Audio file → MP3 | FFmpeg loop/normalize |
| Music track | Music provider | Audio file → MP3 | Direct store |
| Intro video | Remotion + assets | Images + audio + text → MP4 | Render pipeline |
| Marketing images | Image provider | PNG → MinIO | Direct store |
| STL 3D files | OpenSCAD / 3D provider | STL files → MinIO | Parametric or AI gen |
| Marketing copy | Routine | Text → formatted docs | Template merge |
| Financial projections | Routine | JSON → XLSX/PDF | Template merge |

### 6.4 Quality Gates

Before marking any asset as "complete," the system runs quality checks:

- **Text:** Word count within bounds, no placeholder text, JSON valid
- **Images:** Resolution meets minimum (1024×1024 for concept art, 300 DPI for print), no watermarks
- **Audio:** Duration within expected range, no silence > 2s, normalized loudness (-16 LUFS)
- **Video:** Resolution ≥ 1080p, audio synced, no encoding artifacts
- **PDF:** Page count expected, no blank pages, fonts embedded
- **STL:** Watertight mesh, no non-manifold edges, printable dimensions

Failed quality checks → auto-retry once → if still failed → mark for manual review by user.

---

## 7. ADMIN SYSTEM

### 7.1 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Model Configuration** | Set which AI model/provider is used for each task category. Test prompts against models. |
| **API Key Management** | Securely store and rotate API keys for all providers (encrypted at rest). |
| **Cost Tracking** | Per-project and aggregate cost tracking across all AI providers. |
| **Prompt Library** | View, edit, version, and A/B test prompt templates. |
| **Generation Queue** | Monitor all active/queued/failed generation jobs. Retry or cancel. |
| **User Management** | View users, projects, usage. Manual overrides if needed. |
| **System Health** | Queue depth, worker status, storage usage, API rate limit status. |
| **Feature Flags** | Toggle features (e.g., AI video generation, 3D printing) per tier. |

### 7.2 Cost Management

Each AI call logs its cost. The admin can set:
- **Per-project budget cap** (alert or hard-stop)
- **Per-task cost limits** (e.g., max $2 per image generation)
- **Provider fallback chain** (if primary provider fails or is over budget, fall back to cheaper alternative)

---

## 8. COLLABORATOR SYSTEM

The project owner (single user) can invite collaborators via email link:

- **View access:** Can see all project content, previews, and generated assets
- **Comment access:** Can view + leave comments/suggestions on any section
- Collaborators CANNOT edit directly — they leave notes that the owner reviews
- Collaborator comments are threaded per section/puzzle/script
- Owner sees a "suggestions" panel and can accept/dismiss each
- No additional login required — magic link access with project-scoped token

---

## 9. PERSISTENCE & RETURN FLOW

### 9.1 Auto-Save

Every change auto-saves to the database. No explicit "save" button needed. Changes are debounced (500ms) and saved via PATCH requests.

### 9.2 Project Dashboard

Users return to a dashboard showing all their projects with:
- Project card (title, genre, room type, status, last modified)
- Progress indicator (which phases are complete)
- Quick resume button (jumps to current phase)
- "Re-open" button for completed projects (unlocks for editing, reverts to REVIEW phase)

### 9.3 Revision System

The revision system ensures nothing is ever lost and users can freely experiment.

#### 9.3.1 Content Revision History

Every piece of generated or edited content maintains a full revision timeline:

- **Auto-snapshot triggers:**
  - Every AI generation or regeneration
  - Every significant user edit (debounced — not every keystroke, but every "meaningful change" detected after 10 seconds of inactivity or on explicit save)
  - Phase completion milestones
  - Before and after full asset generation

- **Per-entity revision browser:**
  - Each puzzle, narrative script, concept element, and layout has a "History" button
  - Opens a timeline sidebar showing all versions with timestamps and change source labels (AI Generated / User Edit / Regenerated / Restored)
  - Click any version to preview it
  - "Restore this version" copies it back as the current version (creating a new snapshot of what was replaced)
  - "Compare" mode shows a diff between any two versions (additions highlighted green, removals red)

- **"Revert to AI Original"** button on any manually edited content — restores the last AI-generated version without losing the user's edits (both are preserved in history)

#### 9.3.2 Asset Version History

Generated media assets (images, audio, video, PDFs, STLs) maintain version history:

- When a user regenerates an asset, the previous file is moved to `asset_versions` before the new one overwrites it
- Asset preview panel shows a version carousel — swipe/click through all previous generations
- "Use this version" restores any previous generation as the current asset
- Each version shows the prompt and model that created it, so users can see what changed
- Version storage is capped at 5 versions per asset (oldest auto-pruned, user warned)

#### 9.3.3 Project-Level Snapshots

Major milestones create a full project snapshot (all entities serialized):

- Completing any phase
- Before triggering full asset generation
- After full asset generation completes
- Manual "Save checkpoint" button available at any time

Users can browse project snapshots on the dashboard and restore the entire project to any checkpoint.

#### 9.3.4 Undo/Redo Within Sessions

- Standard undo/redo (Ctrl+Z / Ctrl+Shift+Z) works within all text editors (Tiptap)
- Puzzle flow diagram (React Flow) supports undo/redo for node moves, additions, deletions
- Room layout canvas (Konva.js) supports undo/redo for all placement actions
- Undo stack is per-session (cleared on page navigation, but the snapshot system preserves cross-session history)

#### 9.3.5 Side-by-Side Comparison

For creative decisions, users can:
- Generate 2–3 alternatives for any element ("Give me 3 options for this puzzle")
- View them side by side in a comparison panel
- Pick one, or cherry-pick elements from multiple options
- Unpicked alternatives are preserved in history and can be restored later

---

## 9A. PROGRESSIVE VISUALIZATION SYSTEM

The room comes alive visually as the user builds it. A persistent **Room Preview Panel** is available on the right side of every phase (collapsible on mobile), showing the room's current state and updating in real time as content is added.

### 9A.1 Preview Panel Behavior by Phase

| Phase | What the Preview Shows |
|-------|----------------------|
| **Concept** | Mood board images as they're generated. Genre/theme color palette applied to a placeholder room silhouette. |
| **Audience** | Mood board + overlay badges showing group size, difficulty rating, and target audience type on the room silhouette. |
| **Puzzles** | Interactive minimap of the puzzle flow diagram. Clicking a puzzle node shows its spec card. Difficulty curve chart below. As puzzles are added/removed, the flow diagram and curve update live. |
| **Narrative** | Room silhouette with "story pins" — clickable markers showing where each narrative beat occurs (intro, mid-reveal, ending). Clicking plays a quick TTS preview of the script. Audio waveform indicator for generated audio. |
| **Layout** | The Konva.js room canvas IS the preview — it's the primary workspace. But a small 3D perspective preview (React Three Fiber) appears in the panel showing a basic extruded floor plan with placed furniture as blocks. Updates live as the user drags items on the 2D canvas. |
| **Budget** | Budget donut chart showing allocation by category. Items turn green as they're sourced/linked. Total vs. budget bar indicator. |
| **Review** | Full scrollable preview of the entire room — concept art gallery, puzzle flow diagram, room layout, script excerpts, budget summary — all in one view. This IS the review phase workspace. |
| **Generate** | Asset generation progress dashboard — grid of asset cards, each showing status (queued / spinner / preview thumbnail on complete). As each asset finishes, its thumbnail/waveform/preview populates the card. The grid progressively fills in like a mosaic. |
| **Download** | ZIP contents explorer — folder tree on the left, file preview on the right. Click any file to preview it before downloading. |

### 9A.2 Quick TTS Preview

Available in the Narrative phase and Review phase:
- Any script or narrative element has a "Preview" (play button) icon
- Clicking it sends the text to the configured TTS provider for a quick low-quality preview (fastest/cheapest model)
- Audio plays inline with a waveform indicator
- This is a DRAFT preview — the final generation uses the full-quality voice/model
- Preview audio is cached per text hash (regenerates only if text changes)

### 9A.3 Room Visualization Progression

The system builds a **composite room visualization** that evolves across phases:

**Phase 1 (Concept):** Empty room outline + mood board images as background inspiration collage

**Phase 3 (Puzzles):** Room outline + labeled puzzle station markers appear at approximate positions (auto-placed, user can adjust later)

**Phase 5 (Layout):** Full 2D spatial layout with all elements placed. Optional 3D extrusion view shows:
- Walls and doorways
- Furniture as simplified block shapes
- Puzzle stations as labeled markers
- Lighting zones as colored overlays
- Sound source positions as speaker icons

**Phase 8 (Generate):** As concept art images generate, they populate a "room gallery" — giving the user a visual feel for what the finished room looks like before they build it physically.

### 9A.4 Generation Progress Visualization

The Generate phase (Phase 8) shows a **visual progress dashboard**, not just a checklist:

```
┌─────────────────────────────────────────────────────────────┐
│  GENERATING YOUR ESCAPE ROOM                    72% Complete │
│  ███████████████████████████░░░░░░░░░  43 of 60 assets      │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 📄 Docs  │ │ 🖼 Images│ │ 🔊 Audio │ │ 🎬 Video │       │
│  │ 12/15 ✓  │ │ 18/22 ✓  │ │ 8/14 ⏳  │ │ 1/5 ⏳   │       │
│  │ [======] │ │ [======] │ │ [====  ] │ │ [=     ] │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ 📐 Diagms│ │ 🖨 Props │ │ 🔧 3D    │                    │
│  │ 4/6 ✓    │ │ 0/8 queued│ │ 0/3 queued│                   │
│  │ [======] │ │ [      ] │ │ [      ] │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                              │
│  LATEST COMPLETED:                                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│  │thumb│ │thumb│ │wave │ │thumb│ │thumb│ │wave │        │
│  │img  │ │img  │ │audio│ │diagram│ │img │ │audio│        │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│  Concept  Evidence  Intro   Puzzle  Wanted   Hint          │
│  Art #3   Card      Narr.   Flow    Poster   P-001         │
│                                                              │
│  Click any asset to preview full size. ⟳ to regenerate.    │
└─────────────────────────────────────────────────────────────┘
```

Each asset card:
- Shows a spinner while generating
- Pops in a thumbnail/waveform preview on completion
- Click to view full-size preview in a modal
- "Regenerate" button on hover
- Shows the model/provider that generated it
- Red border + retry button if failed

---

## 10. PRINT-READY ASSET SPECIFICATIONS

### 10.1 Prop PDFs

All print-ready props are generated as high-resolution PDFs:

- **Resolution:** 300 DPI minimum
- **Color Space:** CMYK for print (RGB version also included for screen reference)
- **Bleed:** 3mm bleed on all sides for professional printing
- **Trim Marks:** Included as separate layer/option
- **Paper Size:** US Letter (8.5" × 11") with content sized appropriately
- **Font Embedding:** All fonts embedded in PDF
- **Aging/Distress Effects:** Applied digitally (tea stain, burn edges, fold marks, etc.)

### 10.2 Prop Categories & Generation Approach

| Prop Type | Generation Method | Output |
|-----------|------------------|--------|
| Aged letters / documents | LLM writes content → HTML template → Puppeteer → PDF with aging filters | PDF |
| Cipher wheels | Parametric SVG generation based on cipher type | PDF with cut lines |
| Evidence cards | LLM writes content → designed card template → PDF | PDF sheet (multiple cards) |
| Newspaper clippings | LLM writes article → newspaper column template → aged PDF | PDF |
| Wanted posters | LLM writes copy + image gen for portrait → poster template → PDF | PDF |
| Maps and floor plans | Programmatic SVG from layout data → aged/themed overlay → PDF | PDF |
| Photographs (in-world) | Image generation with specific style/era → print-ready PDF | PDF |
| Labels and signage | LLM writes text → themed label template → PDF | PDF sheet |
| Puzzle-specific printables | Per puzzle type (crosswords, coded messages, etc.) → programmatic generation | PDF |

### 10.3 3D Printing Specifications

| Attribute | Standard |
|-----------|----------|
| File Format | STL (binary) + STEP (for editing) |
| Units | Millimeters |
| Wall Thickness | Minimum 1.5mm |
| Mesh Quality | Watertight, manifold, < 500K triangles |
| Print Settings Doc | Layer height, infill %, material rec, support needs, estimated time, estimated filament |
| Assembly Guide | Multi-part props include assembly PDF with exploded view diagrams |

**3D-printable prop examples:**
- Hidden compartment boxes with sliding/rotating mechanisms
- Custom lock housings themed to the room
- Puzzle piece fragments
- Themed key shapes
- Decorative elements (emblems, runes, symbols)
- Display stands for props
- Cable management and sensor housings

---

## 11. NON-FUNCTIONAL REQUIREMENTS

### 11.1 Performance

| Metric | Target |
|--------|--------|
| Page load (initial) | < 2 seconds |
| Phase transition | < 500ms |
| Text generation (streaming) | First token < 2s, full response < 30s |
| Image generation | < 60s (with progress indicator) |
| Audio generation (per file) | < 30s |
| Video generation | < 5 minutes (with progress bar) |
| ZIP packaging | < 2 minutes for full project |
| Auto-save | < 200ms perceived, debounced 500ms |

### 11.2 Scalability

- Stateless API servers (horizontally scalable)
- BullMQ workers independently scalable (add workers per task type)
- MinIO supports clustering for storage
- PostgreSQL read replicas if needed
- Redis cluster for queue scaling

### 11.3 Security

- All API keys encrypted at rest (AES-256)
- User data isolated per account (row-level security)
- Generated assets are private per user (signed URLs with expiry)
- CSRF, XSS, SQL injection protections standard
- Rate limiting on all AI generation endpoints
- SOC 2 considerations for future enterprise tier

### 11.4 Data Export

Users can always:
- Download the full ZIP of any completed project
- Export raw project data as JSON
- Delete their account and all associated data (GDPR compliance)

---

## 12. MONETIZATION

### 12.1 Pricing Model

| Tier | Price | Includes |
|------|-------|----------|
| **Single Room Plan** | $1,000 | Full guided build + all asset generation for one room |
| **Additional Room** | $750 | Discounted for returning customers |
| **Room Refresh** | $250 | Re-open a completed project, regenerate updated assets |
| **Enterprise / Franchise** | Custom | Multiple rooms, custom branding, API access, bulk pricing |

### 12.2 Cost Structure Per Room (Estimated AI Costs)

| Category | Est. API Cost |
|----------|--------------|
| Text generation (all LLM calls) | $5–$15 |
| Image generation (concept art, props, marketing — ~30 images) | $10–$30 |
| Voice/TTS (all narration + hints — ~30 audio files) | $10–$25 |
| Music generation (2–3 tracks) | $5–$10 |
| Video composition (3–5 videos) | $5–$15 |
| 3D model generation (3–8 STLs) | $5–$15 |
| **Total per room** | **$40–$110** |

**Margin:** ~89–96% gross margin per room plan.

---

## 13. DEVELOPMENT PHASES

### Phase 1: Foundation (Weeks 1–3)
- Monorepo setup, CI/CD, Docker compose
- Database schema, migrations, seed data
- Auth (Lucia), user management
- Project CRUD, phase state machine
- Admin panel (model config, API key management)
- OpenRouter integration with provider abstraction layer
- Basic frontend shell with wizard navigation

### Phase 2: Builder Core (Weeks 4–7)
- Phase 1–3 of wizard (Concept, Audience, Puzzles)
- LLM integration for concept and puzzle generation
- Interactive puzzle flow diagram (React Flow)
- Puzzle catalog UI with filtering/search
- Inline editing for all generated content
- Preview panels for each phase

### Phase 3: Narrative & Layout (Weeks 8–10)
- Phase 4–5 of wizard (Narrative, Layout)
- All script generation (intro, hints, GM, endings, audio/video scripts)
- Room layout canvas (Konva.js)
- Lighting and sound plan visualization
- Diagram generation (SVG pipeline)

### Phase 4: Media Generation (Weeks 11–14)
- Image generation pipeline (concept art, props, marketing)
- TTS/voice pipeline (all narration and hint audio)
- Music generation pipeline
- Video composition pipeline (Remotion)
- Print-ready prop PDF pipeline (ReportLab + templates)
- 3D model generation pipeline (OpenSCAD + optional AI)
- Quality gate system

### Phase 5: Business & Assembly (Weeks 15–17)
- Phase 6–7 of wizard (Budget, Review)
- Materials list with purchase links (web search enrichment)
- Business plan document generation
- Marketing kit generation
- Financial projections template
- ZIP packaging with manifest
- Stripe payment integration

### Phase 6: Polish & Launch (Weeks 18–20)
- End-to-end testing (full room generation)
- Performance optimization
- Error handling and retry logic
- User onboarding flow
- Documentation
- Beta testing with real users
- Launch

**Total estimated timeline: 20 weeks (5 months)**

---

## 14. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI generation quality inconsistent | High | High | Quality gates, regeneration, human review step, prompt iteration |
| API cost overrun per project | Medium | High | Budget caps, cost tracking, fallback to cheaper models |
| Long generation times frustrate users | Medium | Medium | Progressive generation, streaming updates, async with notifications |
| 3D model quality insufficient | High | Medium | Parametric templates as primary, AI 3D as optional enhancement |
| Provider API downtime | Medium | High | Fallback providers configured per task, graceful degradation |
| Print-ready quality issues | Medium | High | 300 DPI enforcement, CMYK conversion, sample print testing |
| Scope creep on media features | High | High | Clear MVP scope per phase, feature flags to gate experimental features |

---

## 15. SUCCESS METRICS

| Metric | Target (6 months post-launch) |
|--------|------------------------------|
| Rooms fully generated | 100+ |
| Average generation completion rate | > 85% (users who start → finish) |
| Average time to complete a room plan | < 8 hours (across multiple sessions) |
| User satisfaction (post-generation survey) | > 4.2 / 5.0 |
| Asset quality rating (user feedback) | > 4.0 / 5.0 |
| Gross margin per room | > 85% |
| Monthly recurring projects | 20+ |

---

*Escape Room Forge PRD v1.0*
