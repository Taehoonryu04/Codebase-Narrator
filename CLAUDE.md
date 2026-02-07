# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Codebase Narrator** - An AI-powered tool that analyzes GitHub repositories and generates comprehensive insights about codebase structure, architecture, data flow, and key features. Built as a portfolio project for Georgia Tech CS students targeting Big Tech internships.

**Current Phase:** MVP (Phase 1) - Public repository analysis with Gemini AI integration.

## Development Commands

```bash
# Start development server
npm run dev              # Runs on http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

Required environment variables in `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here    # Required - Get from https://aistudio.google.com/app/apikey
GITHUB_TOKEN=your_token_here        # Optional for Phase 1, increases rate limits
```

**Important:** Never commit `.env.local`. The `.env.example` template is provided for reference.

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **AI:** Google Gemini 2.5 Flash (updated 2026-02 - older 1.5-flash models deprecated)
- **APIs:** GitHub REST API (@octokit/rest), Google Generative AI SDK
- **Validation:** Zod for runtime type safety

### Key Design Patterns

1. **Separation of Concerns**
   - `lib/` - Pure business logic and API wrappers (no UI)
   - `components/` - Reusable UI components (organized by domain)
   - `app/` - Next.js App Router pages and API routes

2. **API Integration Layer**
   - `lib/github.ts` - GitHub API wrapper with rate limiting awareness
   - `lib/ai/gemini.ts` - Gemini AI integration with structured prompts
   - `lib/validation.ts` - Zod schemas for input validation
   - Each wrapper handles its own error cases and returns typed data

3. **Type Safety**
   - `lib/types/index.ts` - Shared TypeScript types
   - Zod schemas infer types automatically (e.g., `z.infer<typeof schema>`)
   - No `any` types; prefer `unknown` when type is truly unknown

### Data Flow

```
User Input (GitHub URL)
  ↓
Client-side validation (Zod schema)
  ↓
POST /api/analyze
  ↓
1. Parse GitHub URL → owner/repo
2. Fetch repo metadata (GitHub API)
3. Fetch file tree (Git Tree API, recursive)
4. Filter important files (maxDepth=5, exclude node_modules/dist/etc)
5. Fetch file contents (batch of 20 files, 5 at a time)
6. Send to Gemini AI with structured prompt
7. Parse JSON response (with fallback on error)
  ↓
Return AnalysisResult to client
  ↓
Display with animated UI components
```

### Critical Implementation Details

**File Filtering (lib/github.ts)**
- Uses Git Tree API with `recursive: "1"` to get all files at once
- Filters by file type (blob only), depth (max 5 levels), and patterns
- Supports multiple languages: JS/TS, Python, Rust, Go, Java, C/C++, Ruby, PHP, etc.
- Excludes build artifacts: node_modules, dist, build, .next, __pycache__, etc.

**AI Prompt Engineering (lib/ai/gemini.ts)**
- Enforces JSON-only output (no markdown code blocks)
- Includes repository metadata, file structure, and file contents (first 500 lines each)
- Requests structured analysis: summary, techStack, architecture, keyFeatures, codeQuality, dataFlow
- Has fallback responses on API errors

**Error Handling Strategy**
- API routes return specific error codes (400, 404, 429, 500)
- Client displays user-friendly error messages
- Server logs detailed errors for debugging
- Gemini failures fallback to basic repo description

## Project Phases (Roadmap)

### Phase 1: MVP ✅ (Current)
- Public repository analysis
- Gemini AI integration
- File structure detection
- Basic UI with landing page

### Phase 2: Core Analysis (Planned)
- GitHub OAuth for private repos
- User analysis history
- Interactive file tree visualization
- React Flow for dependency graphs
- Upstash Redis for caching

### Phase 3: Intelligence (Planned)
- RAG implementation with Pinecone/Supabase Vector
- Chat interface for codebase Q&A
- 3D architecture visualization with Three.js

### Phase 4: Production (Planned)
- GitHub Actions CI/CD
- Vitest unit tests + Playwright E2E
- Sentry error monitoring
- Rate limiting with Upstash

## Important Patterns & Conventions

**Component Organization:**
- `components/ui/` - Generic reusable components (Button, etc.)
- `components/main/` - Landing page specific components (Hero)
- `components/analyze/` - Analysis feature components

**API Route Patterns:**
- Always validate input with Zod schemas first
- Log progress with emoji prefixes for easy scanning (📥 🔍 ✅ ❌)
- Return typed responses using NextResponse.json()
- Handle errors by type (GitHub API, rate limits, AI errors)

**Styling Approach:**
- Tailwind CSS v4 with dark mode support
- Framer Motion for animations (avoid overuse)
- Glassmorphism effects for "Antigravity" vibe
- Mobile-first responsive design

## Key Files to Understand

**Core Logic:**
- `lib/github.ts` - All GitHub API interactions (critical for understanding file fetching)
- `lib/ai/gemini.ts` - AI integration and prompt engineering
- `app/api/analyze/route.ts` - Main API endpoint orchestrating the analysis flow

**UI Entry Points:**
- `app/page.tsx` - Landing page with Hero
- `app/analyze/page.tsx` - Analysis page with form and results
- `components/analyze/AnalysisResult.tsx` - Results display (complex component)

## Common Gotchas

1. **Gemini Model Versions:** Use `gemini-2.5-flash` (current, stable). Older models (`gemini-1.5-flash`, `gemini-1.5-pro`) are deprecated and return 404 errors. Monitor free tier usage at https://ai.dev/rate-limit as quota limits apply.

2. **GitHub Rate Limits:**
   - Without token: 60 requests/hour
   - With token: 5,000 requests/hour
   - Git Tree API counts as 1 request (efficient)

3. **File Content Size:**
   - Files >1MB won't return content from GitHub API
   - Truncate to first 500 lines to avoid token limits

4. **JSON Parsing from AI:**
   - Gemini may wrap JSON in markdown code blocks
   - Regex pattern matches both `{...}` and ` ```json\n{...}\n``` `

5. **Next.js Development:**
   - Hot reload is active - changes auto-refresh
   - Server logs appear in terminal, client logs in browser console
   - API routes are server-side only (can't use `window`, `localStorage`, etc.)

## Target Audience & Quality Bar

This project is designed to impress recruiters at Big Tech companies (Google, Meta, Amazon, etc.) for a 2027 internship. Therefore:

- **Code quality matters:** Prefer readable, well-documented code over clever tricks
- **Architecture matters:** Demonstrate understanding of separation of concerns, type safety, error handling
- **User experience matters:** Smooth animations, helpful error messages, responsive design
- **Production-readiness matters:** Show awareness of caching, rate limiting, monitoring (in later phases)

When suggesting changes, always consider: "Would this impress a senior engineer reviewing this as a portfolio project?"
