# CodebaseNarrator

> AI-powered GitHub repository analyzer that generates comprehensive codebase insights and enables natural language Q&A over any codebase.

Built with Next.js 16, Google Gemini 2.5 Flash, and a full RAG (Retrieval-Augmented Generation) pipeline backed by pgvector on Supabase.

---

## Features

- **Instant Codebase Analysis** — Paste any public GitHub URL and get a structured breakdown: architecture overview, tech stack, design patterns, and key insights — powered by Gemini 2.5 Flash.
- **Chat with Your Codebase** — Ask questions about any analyzed repo in natural language. A full RAG pipeline embeds code chunks, retrieves semantically relevant context, and generates grounded answers.
- **Analysis History** — Authenticated users can revisit past analyses and launch chat sessions from any previously analyzed repository.
- **Rate Limiting** — Per-user daily limits (5 analyses / 50 chats) enforced server-side with a 24-hour rolling window.
- **Smooth UX** — Scroll-reveal landing page, typing indicators, streaming-ready architecture, and a fixed-viewport chat layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| AI | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| Embeddings | `gemini-embedding-001` (768-dim, MRL truncation) |
| Database | PostgreSQL via Prisma ORM |
| Vector Store | Supabase `pgvector` (HNSW index, 768 dims) |
| Auth | NextAuth.js v5, GitHub OAuth |
| Styling | Tailwind CSS v4, Framer Motion |
| Validation | Zod |

---

## Architecture

```
User Input (GitHub URL)
  → Zod Validation
  → POST /api/analyze
      1. Parse owner/repo from URL
      2. Fetch repo metadata + full file tree (Git Tree API, recursive)
      3. Filter files (max depth 5, exclude node_modules/dist/.next)
      4. Fetch file contents (batched: 20 files, 5 concurrent)
      5. Truncate to 500 lines/file → send to Gemini with structured prompt
      6. Parse JSON response → return AnalysisResult
      7. Store embeddings fire-and-forget (authenticated users)
          → chunk files (~2000 chars, 200-char overlap)
          → embed with gemini-embedding-001
          → upsert to Supabase code_embeddings table

Chat (POST /api/chat)
  → Auth check + rate limit
  → Embed user query
  → Similarity search (top-8 chunks via Supabase RPC)
  → Inject context into Gemini prompt
  → Return { reply, sources }
```

### Project Structure

```
lib/
├── ai/
│   ├── gemini.ts         # Gemini AI integration
│   ├── embeddings.ts     # Embedding generation
│   └── rag.ts            # Chunk → embed → retrieve pipeline
├── github.ts             # GitHub API wrapper (octokit)
├── rate-limit.ts         # Per-user rate limiting (Prisma)
├── validation.ts         # Zod schemas
└── types/                # Shared TypeScript types

app/
├── page.tsx              # Landing page (Hero + scroll sections)
├── analyze/page.tsx      # Analysis UI
├── chat/page.tsx         # Fixed-viewport chat interface
├── history/page.tsx      # User analysis history
└── api/
    ├── analyze/          # Repository analysis endpoint
    ├── chat/route.ts     # RAG-powered chat endpoint
    ├── history/          # History CRUD
    └── rate-limit/       # Rate limit status

components/
├── main/                 # Hero, LandingSections
├── analyze/              # Analysis feature components
├── chat/                 # Chat UI components
├── history/              # History UI components
├── auth/                 # Auth UI
└── navigation/           # Nav with auth-gated links
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase project)
- Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey)
- GitHub OAuth app — create at [github.com/settings/developers](https://github.com/settings/developers)

### Setup

```bash
git clone https://github.com/your-username/codebasenarrator.git
cd codebasenarrator
npm install
```

Create `.env.local`:

```bash
# AI
GEMINI_API_KEY=your_gemini_api_key

# GitHub
GITHUB_TOKEN=your_github_token         # Optional but recommended (5000 req/hr vs 60)
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret

# Auth
NEXTAUTH_SECRET=your_nextauth_secret   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Supabase (for RAG / vector search)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

```bash
npx prisma migrate dev   # Run database migrations
npm run dev              # http://localhost:3000
```

---

## Roadmap

**Completed**
- Phase 1: MVP analysis (GitHub URL → Gemini → structured output)
- Phase 2: Auth + Analysis History (GitHub OAuth, NextAuth, Prisma)
- Phase 3: RAG + Chat + Rate Limiting (pgvector, embeddings, chat API)

**In Progress — Phase 4: Engine Refinement**
- [ ] Adaptive Scanner — dynamic file priority based on project type
- [ ] Hybrid Search — keyword + vector search for better retrieval
- [ ] Chat Streaming — SSE for real-time response UX

**Planned — Phase 5: Advanced Insights**
- [ ] Visual Architecture — auto-generated Mermaid diagrams
- [ ] Code Health Audit — automated bug and security risk reports

---

## Design Decisions

- **RAG over full-context:** Code files are chunked and embedded rather than dumped wholesale into the LLM context, keeping costs low and retrieval precise.
- **Fire-and-forget embedding:** Embeddings are generated asynchronously after analysis so the user gets their result immediately without waiting for vector ingestion.
- **User-scoped embeddings:** Each user's code chunks are stored with their `user_id`, so search is always scoped — no cross-user data leakage.
- **Sequential embedding with backoff:** Free-tier Gemini rate limits are respected by processing one chunk at a time with a 500ms delay between calls.
- **Fixed-viewport chat layout:** The chat page uses `h-full flex-col overflow-hidden` so the input bar is always pinned to the bottom regardless of message count.

---

## License

MIT
