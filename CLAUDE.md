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
├── analyze/page.tsx      # Analysis page (admin-only guard UX)
├── auth/                 # Auth callback pages
├── history/page.tsx      # User analysis history
├── chat/page.tsx         # Codebase chat interface
├── profile/page.tsx      # User profile, usage dashboard, account deletion
├── samples/
│   └── codebase-narrator/page.tsx  # Static demo page (no auth, no API)
└── api/
    ├── analyze/          # Repository analysis endpoint
    ├── auth/             # NextAuth routes
    ├── history/          # User history CRUD
    ├── chat/route.ts     # RAG-powered chat — POST /api/chat
    ├── rate-limit/       # Rate limit status endpoint
    └── user/route.ts     # DELETE /api/user — account deletion

data/
└── sample-analysis.ts    # SAMPLE_ANALYSIS (real Gemini run) + SAMPLE_QA (static Q&A)

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
- Chunk file contents (~3000 chars with 300-char overlap, step=2700) → `lib/ai/rag.ts:chunkFile()`
  - Previously 2000/200 — raised to 3000/300 to reduce total chunk count ~33% and stay within free-tier daily quota (RPD). This repo produced ~197 chunks at 2000 chars, now ~148 at 3000 chars. Unique coverage is unchanged (step ratio maintained).
- Embedding model: `gemini-embedding-001` with `outputDimensionality: 768` (MRL truncation) → `lib/ai/embeddings.ts`
  - NOTE: `text-embedding-004` is deprecated (404). Use `gemini-embedding-001` only.
  - NOTE: Do NOT use `apiVersion: "v1"` — default v1beta works for this model.
  - Sequential embedding: BATCH_SIZE=1, BATCH_DELAY_MS=500 in `rag.ts` (~2 req/s, 120 RPM — 8× safety margin below 1500 RPM free-tier limit)
  - **429 resilience**: `embedText` in `embeddings.ts` retries up to 4 times with exponential backoff (15s → 30s → 60s → 120s) before propagating the error. This handles burst quota hits without failing the entire job. If the daily RPD quota is exhausted, retries will eventually exhaust and the job is marked `failed` (non-blocking — analysis response still returns normally).
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
- RATE_LIMITS: `free: 1/2`, `donor: 5/20`, `admin: 9999/9999` — all enforced in `lib/rate-limit.ts` via `limitsFor(email)`; donor emails via `DONOR_EMAILS` env var (comma-separated), admin via `ADMIN_EMAIL`

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
  - Usage dashboard: animated progress bars for analysis + chat quotas fetched from `GET /api/rate-limit`; shows `∞` when limit is 9999 (admin tier); sustainability note for free-tier users
  - Account actions: Sign Out (Supabase `signOut()`), Delete Account with typed confirmation modal (must type `"delete"` to enable)
  - `DELETE /api/user` (`app/api/user/route.ts`): deletes `code_embeddings` + `embedding_jobs` (Supabase admin), `Analysis` + `RateLimit` (Prisma), then `auth.admin.deleteUser` to invalidate account
  - Profile link added to `UserMenu` dropdown (`components/auth/UserMenu.tsx`)
  - **Tier badge** next to username: amber "Admin", violet "☕ Donor", neutral "Free" — resolved server-side from `GET /api/rate-limit` response `tier` field
- [x] **Admin Guard** — `POST /api/analyze` returns `{ adminOnly: true }` (HTTP 403) for non-admin users; fail-closed: `!ADMIN_EMAIL || userEmail !== ADMIN_EMAIL`
- [x] **Featured Sample Page** — `/samples/codebase-narrator` — static zero-cost demo, no auth required
- [x] **Donation / Support Modal** — `components/main/DonationModal.tsx`; surfaced in nav (always visible) + admin-only card on `/analyze`
- [x] **Homepage Production Polish** — `components/main/landing-sections.tsx`
  - "Current Status" amber banner between access tiers and "How it works" — explains admin-only restriction, donor benefit ("full access immediately — 5 analyses and 20 chats"), links to BMC modal + sample page
  - "☕ Support" button on homepage opens `DonationModal` (same as nav bar) — `useState` + `DonationModal` mounted in `LandingSections`
  - Rate limit numbers corrected: "1 analysis · 2 chats per day (donors: 5 analyses · 20 chats)"
  - "What you get" section expanded with **AI Health Audit** and **PDF Export** cards; last two cards centered via separate `lg:w-2/3 mx-auto` grid
- [x] **Multi-tier Rate Limiting** — `lib/rate-limit.ts`
  - Three tiers: `RATE_LIMITS` (free: 1/2), `DONOR_RATE_LIMITS` (5/20), `ADMIN_RATE_LIMITS` (9999/9999)
  - `isAdmin(email)` checks `ADMIN_EMAIL`; `isDonor(email)` checks `DONOR_EMAILS` (comma-separated); `limitsFor(email)` picks tier — admin takes priority over donor
  - All three check functions (`checkAndIncrementAnalysis`, `checkAndIncrementChat`, `getRateLimitStatus`) accept optional `email` and use `limitsFor()`
  - `GET /api/rate-limit` returns `tier: "admin" | "donor" | "free"` for frontend display
  - Donor emails managed via `DONOR_EMAILS` env var — no DB changes needed to grant/revoke access
- [ ] CI/CD deployment
- [ ] Mobile responsiveness audit
- [ ] `ARCHITECT.md` for RAG engine design

**Featured Sample Page (`app/samples/codebase-narrator/page.tsx`):** ✅ COMPLETE
- Client component (`"use client"`), no auth, no API calls — statically imports from `data/sample-analysis.ts`
- Two-tab layout: **Analysis** (📊) and **Chat Demo** (💬) with animated `layoutId` underline tab indicator
- Analysis tab: amber "Sample Repository" banner + `<AnalysisResult result={SAMPLE_ANALYSIS} />` — full feature parity (Overview, Health Audit, PDF export) with zero component modifications
- Chat Demo tab: blue "Sample Chat" banner + 4 question buttons from `SAMPLE_QA[n].question`; clicking `playAnswer(qa)` loads full answer into `bufferRef`, sets `streamDoneRef = true` immediately, starts `setInterval(16ms)` typewriter drain (1/3/6 chars dynamic)
- On drain completion: renders `<MessageContent content={...} />` (markdown + Mermaid), source chips (deduplicated by `filePath`), inline `SourceViewerModal` (Framer Motion `AnimatePresence`, color-coded match badge)
- `data/sample-analysis.ts` exports `SourceChunk` interface, `SampleQA` interface, `SAMPLE_ANALYSIS: AnalysisResult`, `SAMPLE_QA: SampleQA[]`
- Admin guard UX in `app/analyze/page.tsx`: 403 + `{ adminOnly: true }` → amber card with "☕ Support the Project" (opens `DonationModal`) + "Explore Featured Sample →" buttons

**Profile Page (`app/profile/page.tsx`):**
- Auth guard: redirects unauthenticated users to `/`
- Fetches usage via `GET /api/rate-limit` on mount
- Delete flow: `DELETE /api/user` → `signOut()` → `router.push("/")`; error surfaced inline below the delete button
- Framer Motion entry animations (staggered cards), `AnimatePresence` for delete modal

**Admin Guard (`app/api/analyze/route.ts` Step 2a):**
- `ADMIN_EMAIL` env var controls access; if unset, all requests are blocked (fail-closed)
- Check fires after session extraction, before any GitHub or Gemini API call — zero cost on blocked requests
- Returns `{ error: "...", adminOnly: true }` with HTTP 403
- Add `ADMIN_EMAIL=your-github-email` to both `.env.local` (dev) and production env

**Donation Modal (`components/main/DonationModal.tsx`):**
- Props: `isOpen: boolean`, `onClose: () => void`
- Framer Motion `AnimatePresence`; backdrop click closes modal
- BMC link: `https://buymeacoffee.com/taehoonryu04`; secondary "Explore Sample →" → `/samples/codebase-narrator`
- Mounted in `Navigation.tsx` (always visible "☕ Support" button), `app/analyze/page.tsx` (admin-only card), and `components/main/landing-sections.tsx` (homepage "Current Status" section "☕ Support" button)

## Featured Sample Page — Implementation Notes (Phase 6 ✅ COMPLETE)

**Files:**
- `app/samples/codebase-narrator/page.tsx` — the static demo page
- `data/sample-analysis.ts` — static data file (committed, never fetched at runtime)

**Project structure additions:**
```
app/samples/codebase-narrator/page.tsx   # Static demo page (no auth, no API)
data/sample-analysis.ts                  # SAMPLE_ANALYSIS + SAMPLE_QA static exports
```

---

### `data/sample-analysis.ts` — Data Management

`SAMPLE_ANALYSIS` must always be **one real, unmodified Gemini run** — not a hand-crafted composite. Honesty principle: the sample should show exactly what a visitor would get from a real analysis.

**Current state:** `SAMPLE_ANALYSIS` = Run 3 (timestamp `2026-02-18T15:43:43`), selected as the best single run from three real Gemini calls on `Taehoonryu04/Codebase-Narrator`. The three source runs are committed as `run1.md`, `run2.md`, `run3.md` in the project root for reference. Run 3 won on: highest outputTokens (3805), most insightful architecture finding ("Dual Authentication Management" — NextAuth.js vs Supabase `AuthContext` coexisting), unique security finding (`test-gemini.js` env var exposure), 4 `codeQuality.improvements` vs 3 in others, most complete `dataFlow` (covers typewriter effect, `embedText`, Mermaid).

**How to evaluate a new run (when the admin provides a new JSON file):**

Read the new run alongside the current `SAMPLE_ANALYSIS` and compare on these criteria — **replace only if the new run is strictly better overall**:

| Signal | What to look for |
|---|---|
| `outputTokens` | Higher = more thorough Gemini response |
| `healthAudit` findings | More distinct, specific, actionable findings win |
| `keyFeatures` count | More features covered = better |
| `dataFlow` | Should cover both analyze + chat pipelines with file references |
| `architecture` description | Should identify `lib/` as service layer, mention Client/Server Components |
| Unique insights | Findings not present in current version that are accurate and non-trivial |

If the new run wins: replace `SAMPLE_ANALYSIS` verbatim (no mixing). If current is better: keep current, inform the user.

**`SAMPLE_QA` current state:** All 4 entries contain real Gemini responses. Questions and entry id markers:
1. `id: "hybrid-search"` — "How does the hybrid search pipeline work?"
2. `id: "atomic-swap"` — "Walk me through the full system data flow — from GitHub URL submission to AI chat responses"
3. `id: "source-traceability"` — "How does the source traceability system work — from chunk storage to clickable source chips in the chat UI?"
4. `id: "adaptive-scorer"` — "How does the adaptive file scorer decide which files to send to Gemini?"

**RAG pollution warning:** `data/sample-analysis.ts` is excluded from file indexing via `lib/github.ts` `excludePatterns` (`/^data\/sample-analysis\.ts$/`). Without this, the file gets embedded and retrieved as RAG context, contaminating Gemini's chat answers with stale/circular data. If the exclusion is ever removed, re-run the analysis to refresh embeddings.

---

**To update a SAMPLE_QA entry with a new Gemini response:**

**Step 0 — Parallel reads (one round)**

Read simultaneously:
- `qN.md` — the new SSE response file the user provided
- The current `SAMPLE_QA[N]` entry from `data/sample-analysis.ts` (grep for the `id` marker above to find the line offset, then read ~150 lines)

**Step 1 — Compare: replace or keep?**

Compare new vs current on these signals. **Replace only if new is strictly better overall.**

| Signal | Criteria |
|---|---|
| `outputTokens` (from done event `stats`) | Higher = more thorough Gemini response |
| Technical depth | Specific file/function/line references win over generic prose |
| Structure | Numbered sections > bold-header sections for technical Q&A |
| Mermaid | Present and covers the right scope; diagram placed after explanation > before |
| Sources (non-circular) | More real-file sources = better RAG coverage |
| Unique detail | Covers aspects the current version misses |

- If **new wins**: proceed to Step 2 (full replacement).
- If **current wins**: keep current text. If current has no Mermaid diagram, add one using the "insert diagram" pattern in Step 3b.

**Step 2 — Design the Mermaid diagram**

Always fix or upgrade the Mermaid — even if the new response's diagram "works," apply the established clean style:

**Mermaid style rules (non-negotiable):**
- Node labels: plain `[text]` only — no `()`, `{}`, `:`, `+`, or `-->` inside labels
- Use ` - ` (hyphen) as label separator: `[embedText - gemini-embedding-001 768 dims]`
- Use `and` instead of `+`: `[rrfScore and matchedBy]`
- Subgraph names: always quoted — `subgraph Foo["Foo - description"]` — no raw parens or slashes in unquoted names
- Cross-subgraph connections: define **outside** all subgraph blocks
- Node IDs: alphanumeric + underscore only (`D_ERR` not `D.ERR`)
- Direction: `flowchart TD` for multi-step flows, `flowchart LR` for linear pipelines
- Dotted arrows `-.->` for optional/reference/annotation connections

If the new response has **no Mermaid at all**, write one showing the process flow. For scoring/tiered systems, show the pipeline (input → score → sort → output), not an enumeration of all rules (the text already covers that).

**Step 3a — Replace entire entry (Python script)**

NEVER use the Edit tool on `data/sample-analysis.ts` — it fails on Unicode and backtick-heavy content. Always write and run a Python script.

```python
#!/usr/bin/env python3
import json, os, re

BASE = '/Users/ryutaehoon/Documents/codebasenarrator'

def ts_escape(text):
    text = text.replace('\\', '\\\\')  # MUST be first
    text = text.replace('`', '\\`')
    text = text.replace('${', '\\${')
    return text

def parse_sse(path):
    parts, sources = [], []
    with open(path) as f:
        for line in f.read().split('\n'):
            if not line.startswith('data: '): continue
            obj = json.loads(line[6:])
            if obj['type'] == 'chunk': parts.append(obj['text'])
            elif obj['type'] == 'done': sources = obj['sources']
    return ''.join(parts), sources

answer, sources = parse_sse(f'{BASE}/qN.md')

# Filter circular self-references
sources = [s for s in sources if s['filePath'] != 'data/sample-analysis.ts']
print(f'Valid sources: {[s["filePath"] + ":" + str(s["chunkIndex"]) for s in sources]}')

# Replace mermaid block with improved version
IMPROVED_MERMAID = """flowchart TD
    ..."""  # write your clean diagram here per style rules above
answer = re.sub(r'```mermaid\n.*?\n```', '```mermaid\n' + IMPROVED_MERMAID + '\n```', answer, flags=re.DOTALL)
# If response has no mermaid, insert one after the intro paragraph:
# intro, rest = answer.split('\n\n', 1)
# answer = intro + '\n\n```mermaid\n' + IMPROVED_MERMAID + '\n```\n\n' + rest

# Read source content from disk (NOT from the done event — may be stale/truncated)
def read_lines(fp, s, e):
    with open(os.path.join(BASE, fp)) as f:
        lines = f.readlines()
    return ''.join(lines[s-1:e])

# Build TypeScript sources array
source_items = []
for s in sources:
    content = read_lines(s['filePath'], s['startLine'], s['endLine'])
    content_esc = ts_escape(content)
    item = (
        '            {\n'
        f'                filePath: "{s["filePath"]}",\n'
        f'                chunkIndex: {s["chunkIndex"]},\n'
        f'                content: `{content_esc}`,\n'
        f'                startLine: {s["startLine"]},\n'
        f'                endLine: {s["endLine"]},\n'
        f'                rrfScore: {s["rrfScore"]},\n'
        f'                matchedBy: "{s["matchedBy"]}",\n'
        '            }'
    )
    source_items.append(item)

sources_ts = ',\n'.join(source_items)
answer_esc = ts_escape(answer)

new_entry = (
    '    {\n'
    '        id: "ENTRY_ID",\n'
    '        question: "QUESTION TEXT",\n'
    f'        answer: `{answer_esc}`,\n'
    '        sources: [\n'
    f'{sources_ts},\n'
    '        ],\n'
    '    },'
)

with open(f'{BASE}/data/sample-analysis.ts') as f:
    file_content = f.read()

# Boundary markers — replace from this entry's id up to the next entry's id
old_entry_start = '    {\n        id: "ENTRY_ID",'
next_entry_marker = '    {\n        id: "NEXT_ID",'  # see boundary table below

idx_start = file_content.index(old_entry_start)
idx_end = file_content.index(next_entry_marker)
new_content = file_content[:idx_start] + new_entry + '\n' + file_content[idx_end:]

with open(f'{BASE}/data/sample-analysis.ts', 'w') as f:
    f.write(new_content)
print('Done!')
```

**Entry boundary markers:**
- Q1 `"hybrid-search"` → next: `"atomic-swap"`
- Q2 `"atomic-swap"` → next: `"source-traceability"`
- Q3 `"source-traceability"` → next: `"adaptive-scorer"`
- Q4 `"adaptive-scorer"` → last entry; use `'];\n'` as `next_entry_marker` (end of array)

**Step 3b — Insert diagram into existing entry (when keeping current text)**

When current answer wins but has no Mermaid, insert a diagram at the right point without replacing the full entry. In the `.ts` file, backticks inside template literals are stored as `\``. Search/replace on raw file content:

```python
#!/usr/bin/env python3
BASE = '/Users/ryutaehoon/Documents/codebasenarrator'

MERMAID = """flowchart TD
    ..."""  # clean diagram per style rules

with open(f'{BASE}/data/sample-analysis.ts') as f:
    content = f.read()

# Match the exact text surrounding the insertion point
# Backticks in the file appear as \` (backslash + backtick) — match them with \\` in Python
# Triple backtick fence = \\`\\`\\` in Python string → \`\`\` in file → ``` in rendered output
search = "UNIQUE TEXT BEFORE INSERTION\\n\\nNEXT SECTION HEADING"
replacement = (
    "UNIQUE TEXT BEFORE INSERTION\n\n"
    "\\`\\`\\`mermaid\n" + MERMAID + "\n\\`\\`\\`\n\n"
    "NEXT SECTION HEADING"
)

assert search in content, "search string not found"
new_content = content.replace(search, replacement, 1)

with open(f'{BASE}/data/sample-analysis.ts', 'w') as f:
    f.write(new_content)
print('Done!')
```

**Step 4 — Verify and clean up**

```bash
npx tsc --noEmit  # must be 0 errors
rm qN.md update_qN.py  # remove temp files
```

---

## Quality Bar

This portfolio project targets Big Tech recruiters (Google, Meta, Amazon). Code should demonstrate:
- **Clean architecture**: Separation of concerns, type safety
- **Production awareness**: Error handling, rate limiting, security
- **User experience**: Smooth animations, helpful errors, responsive design
- **Readability**: Well-documented, no clever tricks

When suggesting changes, ask: "Would this impress a senior engineer reviewing this portfolio?"
