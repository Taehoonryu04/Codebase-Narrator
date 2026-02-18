# CLAUDE.md

AI-powered GitHub repository analyzer generating comprehensive codebase insights. Portfolio project targeting Big Tech internships (2027).

**Current Phase:** Phase 6 🚧 IN PROGRESS (Production Readiness). Phase 5 ✅ COMPLETE.

**🔒 Claude Code Usage Rules** (Efficiency & Control)

- Language: Use English only.
- Style: Short, direct, technical language. No greetings, filler, or emojis.
- Smart Exploration:
    - Do NOT scan the entire project by default.
    - Based on the goal, infer which files are likely relevant and explore only those.
    - If the initial inference is insufficient, explore additional files incrementally.
- Planning & Implementation Strategy:
    - For **new major features or architectural changes**: Provide a Plan first and wait for my "implement" or "go ahead" command.
    - For **debugging, minor tweaks, or follow-up tasks**: Implement immediately. **Do NOT explain or list plans**—focus strictly on delivering the code to save tokens.
    - If uncertain whether a task is "major," ask before implementing.
- Response Format:
    - Focus on Problem → Inference → Plan/Code.
    - Explain what and where, not why, unless asked.
    - Use "diff" format for code changes to minimize token output.
- Development Philosophy:
    - Treat existing code as correct unless it directly blocks the implementation of the requested feature or a bug is explicitly reported.
    - Do not refactor or "improve" unrelated code.
    - Treat multiple features as independent.
- Action Guidance: Clearly and concisely state any required user actions (e.g., "Run npm install").

## Quick Start

```bash
npm run dev              # http://localhost:3000
npm run build            # Production build
npm start                # Production server
```

## Environment Variables

Required in `.env.local` (never commit this file):

```bash
# Phase 1: Core Analysis
GEMINI_API_KEY=xxx                    # Required: https://aistudio.google.com/app/apikey
GITHUB_TOKEN=xxx                       # Optional: increases rate limits (5000/hr vs 60/hr)

# Phase 2: Authentication & Database
DATABASE_URL=postgresql://...          # PostgreSQL connection string
NEXTAUTH_SECRET=xxx                    # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000     # Change for production
GITHUB_CLIENT_ID=xxx                   # GitHub OAuth app credentials
GITHUB_CLIENT_SECRET=xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Phase 3: RAG & Chat
SUPABASE_SERVICE_ROLE_KEY=xxx          # For server-side vector operations
```

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion
- **AI:** Google Gemini 2.5 Flash (use `gemini-2.5-flash` model ID)
- **APIs:** GitHub REST API (@octokit/rest), Google Generative AI SDK
- **Auth:** NextAuth.js v5, GitHub OAuth
- **Database:** PostgreSQL, Prisma ORM, Supabase
- **Validation:** Zod for runtime type safety

## Architecture

### Project Structure

```
lib/
├── ai/
│   ├── gemini.ts         # AI integration
│   ├── embeddings.ts     # Gemini embedding generation
│   └── rag.ts            # RAG pipeline: chunk, embed, retrieve
├── auth/                 # NextAuth configuration
├── db/                   # Prisma client
├── supabase/             # Supabase client (server/client)
├── github.ts             # GitHub API wrapper
├── rate-limit.ts         # Per-user rate limiting
├── validation.ts         # Zod schemas
└── types/                # Shared TypeScript types

app/
├── page.tsx              # Landing page
├── analyze/page.tsx      # Analysis page
├── auth/                 # Auth callback pages
├── history/page.tsx      # User analysis history
├── chat/page.tsx         # Codebase chat interface
├── profile/page.tsx      # User profile, usage dashboard, account deletion
└── api/
    ├── analyze/          # Repository analysis endpoint
    ├── auth/             # NextAuth routes
    ├── history/          # User history CRUD
    ├── chat/route.ts     # RAG-powered chat — POST /api/chat
    ├── rate-limit/       # Rate limit status endpoint
    └── user/route.ts     # DELETE /api/user — account deletion

components/
├── analyze/              # Analysis feature components
├── auth/                 # Auth UI components
├── history/              # History UI components
├── navigation/           # Nav (History + Chat links for authed users)
└── main/
    ├── hero.tsx          # Full-viewport hero with FloatingPaths background
    └── landing-sections.tsx  # Scroll-animated landing sections
```

### Key Design Patterns

1. **Separation of Concerns**: `lib/` = business logic, `components/` = UI, `app/` = routes
2. **Type Safety**: Zod schemas + TypeScript, no `any` types
3. **Error Handling**: Specific error codes (400, 404, 429, 500) with user-friendly messages
4. **API Layer**: Each integration (GitHub, Gemini) has its own wrapper with error handling

### Analysis Data Flow

```
User Input (GitHub URL) → Validation (Zod)
  ↓
POST /api/analyze
  ↓
1. Parse GitHub URL (owner/repo)
2. Fetch repo metadata + file tree (Git Tree API, recursive)
3. Filter files (max depth 10, exclude node_modules/dist/.next/etc)
4. Adaptive score + sort ALL files before slicing to maxFiles budget
5. Fetch file contents (batched: 20 files, priority-sorted)
6. Send to Gemini with structured prompt
7. Parse JSON response
  ↓
Return AnalysisResult → Display with animations
```

## Database Schema (Prisma)

```prisma
User         # NextAuth users (GitHub OAuth)
Account      # OAuth accounts
Session      # User sessions
Analysis     # User's analysis history (userId + repoFullName unique)
RateLimit    # Per-user rate limit counters (analysisCount, chatCount, windowStart)
```

Run `npx prisma migrate dev` after schema changes.

## Critical Implementation Notes

**GitHub API:**
- Git Tree API with `recursive: "1"` fetches all files in one request (efficient)
- Rate limits: 60/hr (no token) vs 5,000/hr (with token)
- Files >1MB won't return content
- Truncate files to first 600 lines for AI processing (`buildCodebaseTextBlock` default)

**Gemini AI:**
- Use `gemini-2.5-flash` model (older 1.5 models deprecated → 404)
- Structured JSON prompt with repo metadata, file structure, contents
- May wrap JSON in markdown code blocks (regex handles both formats)
- Free tier: monitor usage at https://ai.dev/rate-limit

**RAG & Vector Search (Phase 3):**
- `pgvector` extension enabled in Supabase
- Chunk file contents (~2000 chars with 200-char overlap) → `lib/ai/rag.ts:chunkFile()`
- Embedding model: `gemini-embedding-001` with `outputDimensionality: 768` (MRL truncation) → `lib/ai/embeddings.ts`
  - NOTE: `text-embedding-004` is deprecated (404). Use `gemini-embedding-001` only.
  - NOTE: Do NOT use `apiVersion: "v1"` — default v1beta works for this model.
  - Sequential embedding: BATCH_SIZE=1, BATCH_DELAY_MS=200 (~5 req/s, within 1500 RPM free-tier limit)
- `code_embeddings` table in Supabase: `vector(768)`, `hnsw` index (ivfflat also works at 768 dims)
- Also has `content_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED` + GIN index for FTS (Phase 4.2)
- Vector search RPC: `match_code_chunks(query_embedding, match_user_id, match_repo, match_count)`
- Keyword search RPC: `keyword_search_code_chunks(match_user_id, match_repo, keyword_query, match_count)` — uses `websearch_to_tsquery` + `ts_rank`
- Migration SQL: `supabase/migrations/001_hybrid_search.sql`
- Embeddings stored fire-and-forget after analysis in `POST /api/analyze` (step 10, authenticated users only)
- **Atomic swap re-embedding** (`lib/ai/rag.ts:storeEmbeddings`): new batch inserted with UUID `batch_id`, old batch deleted only after new batch is fully committed — old embeddings remain searchable throughout; no race condition when navigating to chat immediately after analysis
- **Embedding job tracking**: `embedding_jobs` table (migration `supabase/migrations/004_embedding_jobs.sql`) — `status` (in_progress/completed/failed), `total_chunks`, `embedded_chunks`, `batch_id`; progress updated every 10 chunks
- **Embedding status API**: `GET /api/embeddings/status?repo=owner/repo` (`app/api/embeddings/status/route.ts`) — returns `{ status, progressPct, totalChunks, embeddedChunks, ... }`; chat page polls every 2s while in_progress
- **Chat UI progress banner**: animated blue banner + progress bar shown when `embeddingStatus.status === "in_progress"`; empty state message changes to "Your codebase is being indexed"
- At chat time: embed user query → `searchSimilarChunks()` → `buildRagContext()` → inject top-k chunks as context
- Cascade deletion: embeddings deleted when analysis is deleted via `DELETE /api/history/[id]` (service-role client, deletes by `user_id + repo_full_name`)

**Rate Limiting (Phase 3):**
- `RateLimit` table: one row per user, 24-hour rolling window
- Limits: 5 analyses/day, 50 chat messages/day
- `checkAndIncrementAnalysis` / `checkAndIncrementChat` in `lib/rate-limit.ts`
- Return 429 with `Retry-After` header; analysis enforced in `POST /api/analyze`
- `GET /api/rate-limit` returns read-only status for frontend display

**Next.js:**
- Server logs in terminal, client logs in browser console
- API routes are server-only (no `window`, `localStorage`)

**Chat API (Phase 3 + 4.3 + 5.1):**
- `POST /api/chat` in `app/api/chat/route.ts`
- Flow: auth check → Zod validate (`chatRequestSchema`) → `checkAndIncrementChat` (429 if over limit) → `searchSimilarChunks(userId, repoFullName, message, 8)` → `buildRagContext(chunks)` → Gemini `generateContentStream` → SSE stream to client
- Response format: `text/event-stream` SSE. Events: `{"type":"chunk","text":"..."}` per delta, `{"type":"done","sources":[...]}` at end, `{"type":"error","message":"..."}` on failure
- **Phase 5-1:** `sources` in `done` event is now `SourceChunk[]` (not `string[]`) — each chunk carries `filePath`, `chunkIndex`, `content`, `startLine`, `endLine`, `rrfScore`, `matchedBy`
- Pre-stream errors (auth, validation, rate limit, no embeddings) still return normal `NextResponse.json(...)` with appropriate status codes
- Conversation history passed as `history: [{role, content}][]` in request body (max 50 turns)
- If no embeddings found for repo → returns plain JSON (non-streaming) asking user to run analysis first
- Requires authentication (401 if unauthenticated — embeddings are user-scoped)

**Layout Architecture:**
- `app/layout.tsx`: `<html className="h-full">` + `<body className="h-full flex flex-col">` + `<div className="flex-1 overflow-auto min-h-0">` wrapping `{children}`
- This lets chat page use `h-full flex flex-col overflow-hidden` for fixed viewport layout
- Other pages (history, analyze) scroll normally within the overflow-auto wrapper

**Chat Page (`app/chat/page.tsx`):**
- Fixed viewport layout — messages scroll internally, input bar always visible at bottom
- URL param: `?repo=owner/repo` pre-selects a repository; falls back to selector from history
- Repo selector shown in header when user has multiple analyzed repos
- **Streaming UX (Phase 4.3):** Typewriter buffer renders AI response character-by-character at ~60fps
  - `bufferRef` accumulates SSE chunks (no re-renders on arrival)
  - `setInterval(16ms)` dequeues chars: 1 char normally, 3 at >80 buffered, 6 at >200 (catch-up)
  - `displayedRef` tracks typed content so finalization reads it synchronously (avoids nested-setter double-render bug)
  - 3-dot bounce shown until first char arrives, then live streaming bubble with blinking cursor
  - `streamDoneRef` signals typewriter to finalize after buffer drains; typewriter owns `setSending(false)`
- **Markdown + Mermaid rendering (Phase 5-2):** Completed model messages render via `<MessageContent>` (`components/chat/MessageContent.tsx`) using `react-markdown` + `remark-gfm`. Mermaid code blocks render as interactive SVG diagrams via `<MermaidDiagram>` (`components/chat/MermaidDiagram.tsx`). Streaming bubble stays plain text. Diagrams have Download SVG + fullscreen expand. Parse failures show amber fallback with raw source.
- **Source chips (Phase 5-1):** Clickable chips below each AI message — deduplicated by `filePath` (best RRF chunk per file), show `path/file.ts:startLine`, labeled with `matchedBy` badge (vector/keyword/both)
  - Clicking a chip opens a `SourceViewerModal` (Framer Motion `AnimatePresence`) showing the raw code snippet, line range, match method color-coded (violet=both, blue=vector, amber=keyword), and RRF score
  - `activeSource: SourceChunk | null` state drives modal; `sourcesRef` is now `SourceChunk[]`
- Rate limit display: remaining chat messages today (from `GET /api/rate-limit`)

**Landing Page (`app/page.tsx`):**
- `<Hero>` (full-viewport, FloatingPaths background, letter-by-letter animation)
- `<LandingSections>` (`components/main/landing-sections.tsx`) — 6 scroll-reveal sections: access tiers, how it works, stats bar, chat preview, analysis outputs, CTA/footer
- All sections use `useInView` with `once: true` — fade/slide up on scroll

**Component Patterns:**
- File references use markdown links: `[file.ts:42](src/file.ts#L42)`
- Emoji prefixes in logs: 📥 🔍 ✅ ❌
- Tailwind v4 with dark mode, glassmorphism effects
- Framer Motion for animations (use sparingly)
- `Reveal` wrapper component in `landing-sections.tsx` for scroll-triggered animations

## Development Workflow

- Prefer editing existing files over creating new ones
- API routes: validate with Zod first, log with emoji prefixes, return typed `NextResponse.json()`
- Styling: mobile-first, use existing Tailwind classes
- Git: only commit when asked, stage specific files (avoid `git add -A`), never skip hooks or force push to main

## Phase Roadmap

**Completed:** Phase 1 (MVP), Phase 2 (Auth + History), Phase 3 (RAG + Chat + Rate limiting), Phase 4 (Engine Refinement)
- TODO: set RATE_LIMITS to `analysis: 5, chat: 50` in `lib/rate-limit.ts` before production (currently 9999 for dev)

### Phase 4: Engine Refinement ✅ COMPLETE
- [x] **Adaptive Scanner** — `lib/github.ts`
  - `scoreFile(path, primaryLanguage)` scores every file before the `maxFiles` slice
  - Tiers: manifests(5) → entry points(10+depth) → src dirs(20+depth) → UI resources(30) → config(40) → XML(45) → fallback(50+depth×2) → docs(60) → tests(70) → generated(90)
  - Language bonus: −5 for files matching repo's primary language inside src dirs
  - `maxDepth` raised from 5 → 10 (fixes Java/Android deep package paths, e.g. depth 8)
  - Mid-path test dirs caught: `/(^|\/)tests?|__tests__|specs?|androidTest\//` (was only catching root-level)
  - `.xml` added to filter + scored (layout/30, generic/45) — fixes Android res/layout, Maven, Spring
- [x] **Hybrid Search** — `lib/ai/rag.ts`
  - `searchSimilarChunks()` now runs vector + keyword search in parallel, fuses via Reciprocal Rank Fusion (k=60)
  - Keyword search uses PostgreSQL FTS: `content_tsv` (generated `tsvector`) + GIN index + `keyword_search_code_chunks` RPC
  - `reciprocalRankFusion()` deduplicates by `filePath::chunkIndex`, sums `1/(60+rank+1)` scores across both lists
  - Fetches `topK*2` candidates per method before fusion to ensure quality top-K
  - Keyword failure degrades gracefully to pure vector (warn + continue); vector failure throws
  - Migration: `supabase/migrations/001_hybrid_search.sql` (run once in Supabase SQL Editor)
- [x] **Chat Streaming** — `app/api/chat/route.ts` + `app/chat/page.tsx`

### Phase 5: Reliability & Architectural Insights ✅ COMPLETE

- [x] **Source Traceability** — `SourceChunk` type in `lib/ai/rag.ts` (extends `CodeChunk` with `startLine`, `endLine`, `rrfScore`, `matchedBy`); `done` SSE event emits `SourceChunk[]`; chat page shows clickable source chips + `SourceViewerModal`. Migration: `002_add_line_numbers.sql`.
- [x] **Architectural Visualizer** — `components/chat/MermaidDiagram.tsx` + `MessageContent.tsx`; mermaid v11 via `next/dynamic`; `sanitizeMermaid()` pre-processor fixes common AI syntax violations; completed messages render markdown+diagrams, streaming stays plain text.
- [x] **Performance & Cost Monitoring** — `lib/usage.ts` (`estimateCost`, `logUsage`, `checkAnonAnalysisLimit`); `usage_logs` Supabase table (migration `003_usage_logs.sql`); stats returned in analyze response + chat `done` event; stats bar in `AnalysisResult.tsx` header; guest capped at 1 analysis/day by IP.
- [x] **Embedding Reliability** — Atomic swap in `storeEmbeddings()` (UUID `batch_id`); `embedding_jobs` table tracks progress; `GET /api/embeddings/status` polled every 2s by chat UI; progress banner shown while indexing. Migration: `004_embedding_jobs.sql`.
- [x] **AI Code Health Audit** — `healthAudit` field in Gemini response (`security`/`maintainability`/`architecture` with scores + findings); types in `lib/types/index.ts`; `AnalysisResult.tsx` has two-tab layout (Overview + Health Audit) with `ScoreRing`, `FindingCard`, `SeverityBadge`.
- [x] **Professional PDF Export** — `@react-pdf/renderer` (client-side, vector PDF, SSR-safe via `next/dynamic`); `components/analyze/AnalysisPdfDocument.tsx` (cover block + all overview sections + health audit with severity colors); `components/analyze/ExportPdfButton.tsx` (blob → download); button in `AnalysisResult.tsx` header top-right.


### Phase 6: Production Readiness 🚧 IN PROGRESS

- [x] **User Profile Page** — `app/profile/page.tsx` (client component)
  - User info card: GitHub avatar, username, email, member-since date (from Supabase Auth `user_metadata`)
  - Usage dashboard: animated progress bars for analysis + chat quotas fetched from `GET /api/rate-limit`; shows `∞` when limit is 9999 (dev mode); sustainability note for free-tier users
  - Account actions: Sign Out (Supabase `signOut()`), Delete Account with typed confirmation modal (must type `"delete"` to enable)
  - `DELETE /api/user` (`app/api/user/route.ts`): deletes `code_embeddings` + `embedding_jobs` (Supabase admin), `Analysis` + `RateLimit` (Prisma), then `auth.admin.deleteUser` to invalidate account
  - Profile link added to `UserMenu` dropdown (`components/auth/UserMenu.tsx`)
- [ ] CI/CD deployment
- [ ] Mobile responsiveness audit
- [ ] `ARCHITECT.md` for RAG engine design

**Profile Page (`app/profile/page.tsx`):**
- Auth guard: redirects unauthenticated users to `/`
- Fetches usage via `GET /api/rate-limit` on mount
- Delete flow: `DELETE /api/user` → `signOut()` → `router.push("/")`; error surfaced inline below the delete button
- Framer Motion entry animations (staggered cards), `AnimatePresence` for delete modal

## Quality Bar

This portfolio project targets Big Tech recruiters (Google, Meta, Amazon). Code should demonstrate:
- **Clean architecture**: Separation of concerns, type safety
- **Production awareness**: Error handling, rate limiting, security
- **User experience**: Smooth animations, helpful errors, responsive design
- **Readability**: Well-documented, no clever tricks

When suggesting changes, ask: "Would this impress a senior engineer reviewing this portfolio?"
