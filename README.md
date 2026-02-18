# Codebase Narrator

**An AI-powered GitHub repository analysis engine.** Paste a repo URL and receive a structured technical audit: architecture diagrams, a multi-dimensional code health report, and a persistent RAG-powered chat interface that answers questions about the codebase with pinpoint source citations.

Built to demonstrate production-grade system design — not just "call an LLM and display the output."

---

## Key Features

| Feature | Description |
|---|---|
| **Hybrid Search (Vector + FTS)** | Semantic `pgvector` search fused with PostgreSQL Full-Text Search via Reciprocal Rank Fusion |
| **Atomic Embedding Swap** | Zero-downtime re-indexing via UUID batch IDs — old embeddings serve queries until the new batch is 100% committed |
| **Async Job Tracking** | `embedding_jobs` table + polling API exposes live indexing progress to the frontend |
| **Adaptive File Scanner** | Tiered priority scoring selects the highest-signal files within a token budget before fetching |
| **AI Code Health Audit** | Structured Gemini prompt extracts security findings, maintainability index, and architecture rating |
| **Source Traceability** | Every chat response cites exact file paths and line ranges; clicking a chip opens the raw code snippet |
| **Professional PDF Export** | Client-side vector PDF via `@react-pdf/renderer`, SSR-safe via `next/dynamic` |
| **Real-time Cost Telemetry** | Per-request token counts and USD estimates logged to Supabase; displayed inline in the UI |

---

## Live Demo & Resource Management

**Status: Live demo is in Read-Only / Sample-Access mode.**

The hosted instance operates on free-tier infrastructure (Google Gemini API, Supabase pgvector). To ensure sustained availability for all visitors without exhausting quota, **new repository analysis is restricted to the administrator account**. All other features are fully accessible.

### What you can do as a visitor

| Feature | Available |
|---|---|
| Browse pre-analyzed sample repositories | ✅ |
| RAG-powered chat (vector + FTS hybrid search) | ✅ |
| Source traceability — clickable file + line citations | ✅ |
| Mermaid architecture diagram rendering | ✅ |
| AI Code Health Audit (security / maintainability / architecture) | ✅ |
| Professional PDF export | ✅ |
| New repository analysis | 🔒 Admin only |

### Why this restriction exists

Each analysis call consumes Gemini 2.5 Flash tokens (typically 50k–200k per request), triggers sequential embedding API calls for every file chunk (≥500ms per batch to respect free-tier RPM limits), and writes to Supabase pgvector. Unrestricted public access would exhaust these quotas within hours.

The admin guard is enforced at the API layer in `POST /api/analyze`: if the `ADMIN_EMAIL` environment variable is set, any request from a non-matching authenticated email — or any unauthenticated request — receives a `403 adminOnly` response before a single GitHub or Gemini API call is made. This keeps resource consumption deterministic and cost-attributable.

### Engineering note

This is a **deliberate architectural decision**, not a shortcoming. It demonstrates two production concerns relevant to systems built on consumption-billed infrastructure:

1. **Cost-effective infrastructure management** — enforce hard gates at the cheapest possible point in the request lifecycle (before any paid API is touched), log every token and USD estimate to `usage_logs`, and expose per-request telemetry inline in the UI so cost is always visible.
2. **Multi-tier rate limiting** — authenticated users have a 24-hour rolling window enforced by Prisma (`RateLimit` table); anonymous visitors are capped by IP via `usage_logs` (Supabase); the admin guard is a third, hardest layer above both, toggled by a single environment variable with no code change required.

---

## Tech Stack

**Frontend**
- Next.js 16.1.6 (App Router), React 19, TypeScript
- Tailwind CSS v4, Framer Motion
- `react-markdown` + `remark-gfm` + Mermaid v11 (dynamic import)
- `@react-pdf/renderer` for client-side PDF generation

**AI**
- Google Gemini 2.5 Flash — analysis & chat (`gemini-2.5-flash`)
- Google Gemini Embedding 001 — vector embeddings (`gemini-embedding-001`, 768-dim MRL truncation)

**Backend & Infrastructure**
- Supabase (PostgreSQL + `pgvector` extension)
- Prisma ORM (User, Session, RateLimit, Analysis tables)
- NextAuth.js v5 with GitHub OAuth
- GitHub REST API via `@octokit/rest` (Git Tree API, recursive)
- Zod for runtime schema validation

---

## Architecture

### RAG & Embedding Pipeline

```mermaid
flowchart TD
    A[User: GitHub URL] --> B[POST /api/analyze]
    B --> C[Git Tree API: single recursive fetch]
    C --> D[scoreFile: tiered priority sort]
    D --> E[Fetch top-N files, truncate to 600 lines each]
    E --> F[Gemini 2.5 Flash: structured JSON analysis]
    F --> G[Return AnalysisResult to UI]

    G --> H{Authenticated?}
    H -- Yes --> I[storeEmbeddings: fire-and-forget]
    I --> J[chunkFile: 2000-char chunks, 200-char overlap]
    J --> K[gemini-embedding-001: 768-dim vectors, 500ms delay]
    K --> L[Supabase INSERT code_embeddings with batch_id_new]
    L --> M[DELETE WHERE batch_id != batch_id_new]
    M --> N[embedding_jobs: status = completed]

    O[User: Chat message] --> P[POST /api/chat]
    P --> Q[embedText: query vector]
    Q --> R1[match_code_chunks RPC: HNSW vector search]
    Q --> R2[keyword_search_code_chunks RPC: FTS tsquery]
    R1 & R2 --> S[reciprocalRankFusion k=60: deduplicate + score]
    S --> T[buildRagContext: top-8 SourceChunks]
    T --> U[Gemini 2.5 Flash: generateContentStream]
    U --> V[SSE: chunk / done+sources / error events]
    V --> W[Chat UI: typewriter render + clickable source chips]
```

### Project Structure

```
lib/
├── ai/
│   ├── gemini.ts          # Gemini client, analysis prompt, Health Audit schema
│   ├── embeddings.ts      # gemini-embedding-001, BATCH_SIZE=1, 500ms delay
│   └── rag.ts             # Chunking, RRF fusion, atomic swap, job tracking
├── github.ts              # Git Tree API, adaptive file scoring tiers
├── rate-limit.ts          # 24-hour rolling window per user (Prisma)
├── usage.ts               # Token cost estimation, anonymous IP guard
└── types/index.ts         # AnalysisResult, SourceChunk, HealthAudit, ChatStats

app/api/
├── analyze/               # Main analysis endpoint (auth + rate limit + GitHub + Gemini)
├── chat/route.ts          # RAG chat, SSE streaming, conversation history
├── embeddings/status/     # Job progress polling (GET ?repo=owner/repo)
├── rate-limit/            # Read-only limit status for frontend display
└── user/route.ts          # DELETE /api/user — full account and data deletion

app/
├── analyze/page.tsx       # Repository analysis with multi-step loading UX
├── chat/page.tsx          # RAG chat — fixed viewport, typewriter streaming, source chips
├── history/page.tsx       # Analysis history with cascade-delete
└── profile/page.tsx       # User info, usage dashboard, account deletion

components/
├── analyze/
│   ├── AnalysisResult.tsx        # Overview + Health Audit two-tab layout
│   ├── AnalysisPdfDocument.tsx   # react-pdf document tree (cover + body + audit)
│   └── ExportPdfButton.tsx       # Blob download handler with spinner
└── chat/
    ├── MessageContent.tsx        # react-markdown + Mermaid renderer
    ├── MermaidDiagram.tsx        # SVG render, fullscreen, SVG download
    └── SourceViewerModal.tsx     # Code snippet viewer with line range + RRF score
```

---

## Engineering Deep Dive

Seven non-trivial system design problems encountered and solved during development.

---

### Challenge 1: Hybrid Search with Reciprocal Rank Fusion

**Problem.** Pure semantic vector search (`pgvector` cosine similarity) retrieves conceptually related code but fails on exact identifier lookups — searching for `storeEmbeddings` may surface files about "storage" rather than the function itself. Keyword search alone misses semantic relationships across renamed or abstracted concepts.

**Solution.** `lib/ai/rag.ts:searchSimilarChunks()` runs both search paths in parallel:

1. **Vector search** via `match_code_chunks` Supabase RPC — HNSW index on `vector(768)`, cosine distance
2. **Keyword search** via `keyword_search_code_chunks` RPC — `content_tsv tsvector` generated column + GIN index + `websearch_to_tsquery` + `ts_rank`

Results are merged with **Reciprocal Rank Fusion**:

```
score(d) = Σ  1 / (k + rank(d) + 1)     k = 60
           methods
```

Documents appearing in both result sets accumulate scores from each ranking independently. The `k=60` constant smooths rank sensitivity. Deduplication is keyed on `filePath::chunkIndex`. Each method fetches `topK × 2` candidates before fusion to ensure the final top-K survivors are high-quality. A keyword search failure degrades gracefully to vector-only — logs a warning and continues rather than surfacing an error.

Each returned `SourceChunk` carries a `matchedBy` field (`"vector"` | `"keyword"` | `"both"`) rendered as a color-coded badge in the source viewer.

---

### Challenge 2: Zero-Downtime Atomic Embedding Swap

**Problem.** When a user re-analyzes a repo, the naive sequence is: delete old embeddings → insert new ones. During that window — which can span several minutes for large repositories — the chat returns empty results. Users navigating to chat mid-indexing see a broken experience.

**Solution.** `lib/ai/rag.ts:storeEmbeddings()` implements an **atomic swap via UUID batch IDs**:

```
1. Generate  batch_id_new  (UUID v4)
2. INSERT all new chunks with  embedding.batch_id = batch_id_new
   (old chunks with batch_id_old are still live — queries hit them normally)
3. Only after the full insert commits:
   DELETE FROM code_embeddings WHERE user_id = ? AND repo = ? AND batch_id != batch_id_new
```

The `match_code_chunks` RPC queries by `(user_id, repo_full_name)` without a batch_id filter, so old chunks remain visible to every concurrent chat query throughout the entire insert phase. The delete is the only "hot" step, and it is a single atomic SQL operation. There is no lock, no downtime, and no race condition — even if a user opens the chat tab the moment analysis completes.

---

### Challenge 3: Asynchronous Job Tracking with Live Progress UI

**Problem.** Embedding a large repository (hundreds of chunks, sequential 500ms-delayed API calls) runs for several minutes in a background task. Without status feedback, users navigate to chat, see "no embeddings found," and assume the system is broken or re-trigger analysis unnecessarily.

**Solution.** A dedicated `embedding_jobs` Supabase table tracks every indexing job:

```sql
embedding_jobs (
  user_id        TEXT,
  repo_full_name TEXT,
  status         TEXT,     -- in_progress | completed | failed
  total_chunks   INT,
  embedded_chunks INT,     -- updated every 10 chunks
  batch_id       UUID,
  created_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  error_message  TEXT
)
```

`storeEmbeddings()` increments `embedded_chunks` after every 10 embeddings. `GET /api/embeddings/status?repo=owner/repo` reads the latest job row and returns `{ status, progressPct, totalChunks, embeddedChunks }`. The chat page polls this endpoint every 2 seconds and renders an animated blue progress banner (`Indexing… 47%`) while `status === "in_progress"`. The empty-state message also updates to "Your codebase is being indexed" so users know to wait rather than re-trigger.

---

### Challenge 4: Structural Code Chunking with Exact Line Number Preservation

**Problem.** Naive fixed-size text splitting loses file context and makes source attribution impossible. Standard document chunking cuts through function bodies and discards the metadata needed to say "the relevant code is on line 84 of `auth/route.ts`."

**Solution.** `lib/ai/rag.ts:chunkFile()` implements **overlap-aware chunking with exact line tracking**:

- Each chunk is ≤ 2000 characters with a 200-character trailing overlap (the last 200 chars of chunk N prefix chunk N+1, preserving cross-boundary context)
- `startLine` and `endLine` are computed by counting `\n` characters in the text before and within each chunk — 1-indexed to match editor line numbers
- The chunk stores `filePath`, `chunkIndex`, `content`, `startLine`, `endLine` — all persisted to `code_embeddings` and surfaced as `SourceChunk` to the frontend

At query time, source chips render as `path/file.ts:42`. Clicking opens `SourceViewerModal` with the exact raw code snippet, line range, `matchedBy` badge (violet = both, blue = vector, amber = keyword), and the numerical `rrfScore` — giving users full transparency into retrieval decisions.

---

### Challenge 5: Structured Multi-Dimensional Code Health Audit

**Problem.** Generic AI summaries ("this code is well-structured") provide no actionable signal. They cannot be cited in a code review, used to prioritize technical debt, or compared across repositories.

**Solution.** The Gemini analysis prompt enforces a **typed JSON schema** for the `healthAudit` response field, instructing the model to reason from three distinct auditor perspectives:

- **Security reviewer** — look for fail-open policies, exposed secrets, missing input validation, injection vectors
- **Maintainability reviewer** — look for god classes, circular dependencies, deeply nested logic, missing abstractions
- **Architect** — look for tight coupling, separation-of-concerns violations, missing layering, undocumented patterns

The extracted schema:

```typescript
healthAudit: {
  security:        { score: number,  findings: SecurityFinding[] }
  maintainability: { index: number,  findings: MaintainabilityFinding[] }  // typed: god_class | circular_dependency | complex_logic | other
  architecture:    { rating: number, pattern: string, findings: ArchitectureFinding[] }
}

// Each finding: { severity: "critical"|"high"|"medium"|"low", title, description, file?, recommendation }
```

The UI renders a two-tab layout: **Overview** (summary, tech stack, data flow) and **Health Audit** (three `ScoreRing` SVG components + `FindingCard` list with `SeverityBadge` color-coding). All findings are reproduced in the PDF export with severity-colored borders.

---

### Challenge 6: SSR-Safe Client-Side Vector PDF Export

**Problem.** `@react-pdf/renderer` operates on browser-only canvas APIs and crashes Next.js SSR with `ReferenceError: window is not defined`. Rendering HTML-to-PDF (puppeteer, html2canvas) produces raster output, requires a server process, and cannot produce selectable vector text.

**Solution.** A pure client-side vector PDF pipeline:

1. `ExportPdfButton` is imported via `next/dynamic({ ssr: false })` — the component is never evaluated on the server, eliminating the SSR crash entirely
2. On click: `pdf(<AnalysisPdfDocument {...props} />).toBlob()` runs entirely in the browser using `@react-pdf/renderer`'s internal PDF serializer
3. `URL.createObjectURL(blob)` → programmatic `<a>` click with `download="reponame-analysis.pdf"` → `URL.revokeObjectURL()` cleanup
4. Button disables and shows a spinner during blob generation to prevent double-click re-generation

The document is a structured technical report: cover block (repo metadata, star count, language, analysis stats pills), body sections (summary, tech stack tags, architecture, code quality score bars), and a Health Audit section with severity-colored finding cards (critical = `#ef4444`, high = `#f97316`, medium = `#3b82f6`, low = `#a3a3a3`). Page numbers appear in a fixed footer. Output is a true vector PDF — text is fully selectable and renders crisply at any zoom level.

---

### Challenge 7: Multi-Tier Usage Guard and Cost Shield

**Problem.** Unrestricted API access exposes two attack surfaces: (a) authenticated users could exhaust Gemini quotas by running unlimited analyses, and (b) anonymous visitors could trigger unbounded server-side processing with no accountability.

**Solution.** Two independent enforcement layers with different storage backends:

**Layer 1 — Per-user rolling window (authenticated, Prisma).**
`lib/rate-limit.ts` maintains a `RateLimit` row per user with `analysisCount`, `chatCount`, and `windowStart`. `checkAndIncrementAnalysis()` / `checkAndIncrementChat()` check whether `Date.now() - windowStart > 86_400_000ms`; if true, the counter resets to 1; otherwise it increments and checks against the limit. Requests over the limit return HTTP 429 with a `Retry-After` header. Limits: 5 analyses/day, 50 chat messages/day.

**Layer 2 — Anonymous IP cap (unauthenticated, Supabase).**
`lib/usage.ts:checkAnonAnalysisLimit()` queries `usage_logs` for `analyze` events from the same IP in the last 24 hours. If count ≥ 1, the request is rejected before any GitHub or Gemini API call is made. On Supabase query failure, the function **fails open** (returns `true`) — a deliberate trade-off: transient DB errors should not lock out legitimate users, and the cost of an occasional missed enforcement is lower than degraded availability.

`logUsage()` records every request (authenticated or anonymous) with `inputTokens`, `outputTokens`, `estimatedCostUsd`, `executionTimeMs`, and `ragRetrievalMs` — providing a full audit trail and per-event cost attribution across the `usage_logs` table.

---

## Installation & Setup

### Prerequisites

- Node.js 20+
- Supabase project (PostgreSQL + pgvector)
- Google AI Studio account — [get a Gemini API key](https://aistudio.google.com/app/apikey)
- GitHub OAuth App — create at [github.com/settings/developers](https://github.com/settings/developers)

### 1. Clone and install

```bash
git clone https://github.com/your-username/codebasenarrator.git
cd codebasenarrator
npm install
```

### 2. Configure environment variables

Create `.env.local` at the project root:

```bash
# AI
GEMINI_API_KEY=your_gemini_api_key

# GitHub (optional — raises rate limit from 60/hr to 5000/hr)
GITHUB_TOKEN=your_github_pat
GITHUB_CLIENT_ID=your_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_oauth_app_client_secret

# Auth
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Database (Prisma)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Supabase (vector search + job tracking)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Initialize the database

```bash
# Prisma: User, Account, Session, Analysis, RateLimit tables
npx prisma migrate dev
```

Run the following SQL migrations in the Supabase SQL Editor in order:

```
supabase/migrations/001_hybrid_search.sql    — code_embeddings table, FTS generated column, RPCs
supabase/migrations/002_add_line_numbers.sql — startLine, endLine columns on code_embeddings
supabase/migrations/003_usage_logs.sql       — usage_logs table
supabase/migrations/004_embedding_jobs.sql   — embedding_jobs table
```

### 4. Run

```bash
npm run dev    # http://localhost:3000
npm run build  # Production build
npm start      # Production server
```

---

## License

MIT
