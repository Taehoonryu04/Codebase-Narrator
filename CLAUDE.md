# CLAUDE.md

AI-powered GitHub repository analyzer generating comprehensive codebase insights. Portfolio project targeting Big Tech internships (2027).

**Current Phase:** Phase 2 (In Progress) - GitHub OAuth, user authentication, analysis history with Supabase/Prisma.

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
├── ai/gemini.ts          # AI integration with structured prompts
├── auth/                 # NextAuth configuration
├── db/                   # Prisma client
├── supabase/            # Supabase client (server/client)
├── github.ts            # GitHub API wrapper
├── validation.ts        # Zod schemas
└── types/               # Shared TypeScript types

app/
├── page.tsx             # Landing page
├── analyze/page.tsx     # Analysis page
├── auth/                # Auth callback pages
├── history/page.tsx     # User analysis history
└── api/
    ├── analyze/         # Repository analysis endpoint
    ├── auth/            # NextAuth routes
    └── history/         # User history CRUD

components/
├── analyze/             # Analysis feature components
├── auth/                # Auth UI components
├── history/             # History UI components
├── navigation/          # Nav components
└── main/                # Landing page components
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
3. Filter files (max depth 5, exclude node_modules/dist/.next/etc)
4. Fetch file contents (batched: 20 files, 5 concurrent)
5. Send to Gemini with structured prompt
6. Parse JSON response
  ↓
Return AnalysisResult → Display with animations
```

## Database Schema (Prisma)

```prisma
User         # NextAuth users (GitHub OAuth)
Account      # OAuth accounts
Session      # User sessions
Analysis     # User's analysis history (userId + repoFullName unique)
```

Run `npx prisma migrate dev` after schema changes.

## Critical Implementation Notes

**GitHub API:**
- Git Tree API with `recursive: "1"` fetches all files in one request (efficient)
- Rate limits: 60/hr (no token) vs 5,000/hr (with token)
- Files >1MB won't return content
- Truncate files to first 500 lines for AI processing

**Gemini AI:**
- Use `gemini-2.5-flash` model (older 1.5 models deprecated → 404)
- Structured JSON prompt with repo metadata, file structure, contents
- May wrap JSON in markdown code blocks (regex handles both formats)
- Free tier: monitor usage at https://ai.dev/rate-limit

**Next.js:**
- Server logs in terminal, client logs in browser console
- API routes are server-only (no `window`, `localStorage`)
- Hot reload auto-refreshes on changes

**Component Patterns:**
- File references use markdown links: `[file.ts:42](src/file.ts#L42)`
- Emoji prefixes in logs: 📥 🔍 ✅ ❌
- Tailwind v4 with dark mode, glassmorphism effects
- Framer Motion for animations (use sparingly)

## Development Workflow

1. **Starting new features:**
   - Read relevant files first (understand before modifying)
   - Check CLAUDE.md for patterns
   - Prefer editing existing files over creating new ones

2. **API Routes:**
   - Validate input with Zod first
   - Log progress with emoji prefixes
   - Return typed responses with NextResponse.json()

3. **Styling:**
   - Mobile-first responsive design
   - Use existing Tailwind classes
   - Avoid over-engineering

4. **Git commits:**
   - Only commit when explicitly requested
   - Never skip hooks or force push to main
   - Stage specific files (avoid `git add -A`)

## Phase Roadmap

### Phase 1: MVP ✅
- Public repo analysis
- Gemini AI integration
- Landing page + analyze page

### Phase 2: User Features 🚧 (Current)
- GitHub OAuth (NextAuth.js)
- User authentication
- Analysis history (Supabase + Prisma)
- Private repo support

### Phase 3: Advanced Features (Planned)
- Interactive file tree visualization
- React Flow dependency graphs
- Redis caching (Upstash)

### Phase 4: Intelligence (Future)
- RAG with Supabase Vector
- Chat interface for codebase Q&A
- 3D architecture visualization

### Phase 5: Production (Future)
- CI/CD (GitHub Actions)
- Testing (Vitest + Playwright)
- Monitoring (Sentry)
- Rate limiting

## Quality Bar

This portfolio project targets Big Tech recruiters (Google, Meta, Amazon). Code should demonstrate:
- **Clean architecture**: Separation of concerns, type safety
- **Production awareness**: Error handling, rate limiting, security
- **User experience**: Smooth animations, helpful errors, responsive design
- **Readability**: Well-documented, no clever tricks

When suggesting changes, ask: "Would this impress a senior engineer reviewing this portfolio?"
