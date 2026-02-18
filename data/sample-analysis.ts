import type { AnalysisResult } from "@/lib/types";

export interface SourceChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
    startLine: number;
    endLine: number;
    rrfScore: number;
    matchedBy: "vector" | "keyword" | "both";
}

export interface SampleQA {
    id: string;
    question: string;
    answer: string;
    sources: SourceChunk[];
}

/**
 * Real Gemini 2.5 Flash analysis of Taehoonryu04/Codebase-Narrator.
 * Captured from the /api/analyze response on 2026-02-18.
 * To refresh: run a real analysis as admin, copy the JSON from DevTools Network → Response.
 */
export const SAMPLE_ANALYSIS: AnalysisResult = {
    repoInfo: {
        owner: "Taehoonryu04",
        name: "Codebase-Narrator",
        fullName: "Taehoonryu04/Codebase-Narrator",
        description:
            "A developer-centric tool designed to streamline project onboarding and documentation using LLMs. Automatically generates architectural overviews and READMEs from GitHub URLs.",
        url: "https://github.com/Taehoonryu04/Codebase-Narrator",
        stars: 0,
        language: "TypeScript",
        topics: [],
    },
    fileStructure: [
        { path: "package.json", type: "file", size: 992 },
        { path: "lib/auth/index.ts", type: "file", size: 3857 },
        { path: "lib/supabase/server.ts", type: "file", size: 1309 },
        { path: "lib/types/index.ts", type: "file", size: 2496 },
        { path: "app/layout.tsx", type: "file", size: 965 },
        { path: "app/page.tsx", type: "file", size: 277 },
        { path: "lib/github.ts", type: "file", size: 16896 },
        { path: "lib/rate-limit.ts", type: "file", size: 5457 },
        { path: "lib/usage.ts", type: "file", size: 2789 },
        { path: "lib/validation.ts", type: "file", size: 2974 },
        { path: "app/analyze/page.tsx", type: "file", size: 12913 },
        { path: "app/chat/page.tsx", type: "file", size: 39748 },
        { path: "app/history/page.tsx", type: "file", size: 9290 },
        { path: "app/profile/page.tsx", type: "file", size: 20877 },
        { path: "lib/ai/embeddings.ts", type: "file", size: 1372 },
        { path: "lib/ai/gemini.ts", type: "file", size: 11515 },
        { path: "lib/ai/rag.ts", type: "file", size: 10430 },
        { path: "lib/auth/encryption.ts", type: "file", size: 3254 },
        { path: "lib/db/prisma.ts", type: "file", size: 777 },
        { path: "lib/supabase/client.ts", type: "file", size: 612 },
        { path: "app/api/analyze/route.ts", type: "file", size: 13079 },
        { path: "app/api/chat/route.ts", type: "file", size: 9157 },
        { path: "app/api/history/route.ts", type: "file", size: 1408 },
        { path: "app/api/rate-limit/route.ts", type: "file", size: 976 },
        { path: "app/api/user/route.ts", type: "file", size: 3031 },
        { path: "app/auth/callback/route.ts", type: "file", size: 988 },
        { path: "app/api/auth/[...nextauth]/route.ts", type: "file", size: 792 },
        { path: "app/api/embeddings/status/route.ts", type: "file", size: 2259 },
        { path: "app/api/history/[id]/route.ts", type: "file", size: 2498 },
        { path: "app/globals.css", type: "file", size: 468 },
        { path: "next.config.ts", type: "file", size: 157 },
        { path: ".mcp.json", type: "file", size: 115 },
        { path: "prisma/schema.prisma", type: "file", size: 2908 },
        { path: "tsconfig.json", type: "file", size: 666 },
        { path: ".gitignore", type: "file", size: 480 },
        { path: "eslint.config.mjs", type: "file", size: 465 },
        { path: "postcss.config.mjs", type: "file", size: 94 },
        { path: "test-gemini.js", type: "file", size: 2757 },
        { path: "contexts/AuthContext.tsx", type: "file", size: 2989 },
        { path: "components/analyze/AnalysisPdfDocument.tsx", type: "file", size: 18264 },
        { path: "components/analyze/AnalysisResult.tsx", type: "file", size: 28560 },
        { path: "components/analyze/ExportPdfButton.tsx", type: "file", size: 2072 },
        { path: "components/analyze/RepoInputForm.tsx", type: "file", size: 5060 },
        { path: "components/auth/SignInButton.tsx", type: "file", size: 2392 },
        { path: "components/auth/UserMenu.tsx", type: "file", size: 4364 },
        { path: "components/chat/MermaidDiagram.tsx", type: "file", size: 9406 },
        { path: "components/chat/MessageContent.tsx", type: "file", size: 2778 },
        { path: "components/history/HistoryCard.tsx", type: "file", size: 4017 },
        { path: "components/main/hero.tsx", type: "file", size: 5271 },
        { path: "components/main/landing-sections.tsx", type: "file", size: 35984 },
        { path: "components/navigation/Navigation.tsx", type: "file", size: 2620 },
        { path: "components/ui/button.tsx", type: "file", size: 518 },
        { path: "components/ui/floating-paths.tsx", type: "file", size: 1897 },
        { path: "CLAUDE.md", type: "file", size: 25819 },
        { path: "FIXES_SUMMARY.md", type: "file", size: 4854 },
        { path: "README.md", type: "file", size: 19382 },
        { path: "supabase/migrations/001_hybrid_search.sql", type: "file", size: 1402 },
        { path: "supabase/migrations/002_add_line_numbers.sql", type: "file", size: 2112 },
        { path: "supabase/migrations/003_usage_logs.sql", type: "file", size: 1229 },
        { path: "supabase/migrations/004_embedding_jobs.sql", type: "file", size: 1113 },
        { path: "types/next-auth.d.ts", type: "file", size: 1041 },
    ],
    analysis: {
        summary:
            "This project is an AI-powered developer tool designed to provide deep analysis and interactive chat capabilities for GitHub repositories. It leverages Google Gemini to interpret code structure, identify technologies, and assess quality, while using Supabase as a vector database for Retrieval Augmented Generation (RAG) to power conversational AI about specific codebases.",
        techStack: [
            "Next.js (Frontend Framework)",
            "React (UI Library)",
            "TypeScript (Primary Language)",
            "Tailwind CSS (Styling)",
            "Framer Motion (Animations)",
            "PostgreSQL (Database)",
            "Prisma (ORM)",
            "Supabase (Auth, Database, Vector DB)",
            "NextAuth.js v5 (Authentication, GitHub OAuth)",
            "Google Gemini (LLM for Analysis and Embeddings)",
            "Octokit (GitHub API Client)",
            "Zod (Schema Validation)",
            "Node.js Crypto (Token Encryption)",
            "Mermaid.js (Diagram Rendering)",
            "React Markdown (Content Rendering)",
            "React PDF Renderer (PDF Export)",
        ],
        architecture:
            "The application follows a Next.js App Router architecture. The frontend components (under `app/` and `components/`) handle user interaction and data presentation, utilizing Client Components for interactivity and Server Components for initial rendering. Backend logic is primarily exposed through Next.js API Routes (under `app/api/`), which act as controllers. Core business logic, external API integrations (GitHub, Gemini), and database operations are modularized within the `lib/` directory (e.g., `lib/github.ts`, `lib/ai/gemini.ts`, `lib/db/prisma.ts`), forming a service layer. Authentication integrates NextAuth.js v5 with a Prisma adapter for database-backed sessions and stores encrypted GitHub OAuth tokens. Supabase functions as both the authentication provider and a vector store for RAG, interfacing with PostgreSQL via Prisma ORM and custom RPC functions for vector/keyword search.",
        keyFeatures: [
            "AI-Powered Repository Analysis: Users submit a GitHub URL (public or private), and Gemini AI generates a comprehensive report including project summary, tech stack, architecture, key features, code quality, data flow, and entry points. (Evidence: `app/analyze/page.tsx`, `app/api/analyze/route.ts`, `lib/ai/gemini.ts`)",
            "Interactive Codebase Chat (RAG): Authenticated users can converse with analyzed repositories, with responses grounded in retrieved code chunks from Supabase vector embeddings, featuring source citations and auto-generated Mermaid diagrams. (Evidence: `app/chat/page.tsx`, `app/api/chat/route.ts`, `lib/ai/rag.ts`, `components/chat/MermaidDiagram.tsx`)",
            "Analysis History & Management: Authenticated users can view, re-analyze, and delete their past repository analysis reports. (Evidence: `app/history/page.tsx`, `app/api/history/route.ts`, `app/api/history/[id]/route.ts`)",
            "GitHub OAuth Authentication with Encrypted Tokens: Secure sign-in via GitHub, enabling access to private repositories using the user's encrypted OAuth token. (Evidence: `lib/auth/index.ts`, `lib/auth/encryption.ts`, `prisma/schema.prisma` `githubTokenEncrypted` field)",
            "Usage Tracking & Rate Limiting: Tracks and enforces per-user rate limits for analysis and chat (configurable for free tiers), displaying current usage to the user. (Evidence: `lib/rate-limit.ts`, `lib/usage.ts`, `app/api/rate-limit/route.ts`, `app/profile/page.tsx`)",
            "PDF Export of Analysis Reports: Users can download their generated analysis reports as professionally formatted PDF documents. (Evidence: `components/analyze/AnalysisPdfDocument.tsx`, `components/analyze/ExportPdfButton.tsx`)",
            "Performance and Cost Metrics: Displays detailed statistics for each AI operation (execution time, token usage, estimated cost) for full transparency. (Evidence: `lib/usage.ts`, `lib/types/index.ts`, `components/analyze/AnalysisResult.tsx` `effectiveStats`)",
        ],
        codeQuality: {
            score: 88,
            strengths: [
                "Strong Type Safety: Extensive use of TypeScript with well-defined interfaces (`lib/types/index.ts`) and Zod schemas (`lib/validation.ts`) for robust runtime validation and compile-time type checking.",
                "Modular Architecture: Clear separation of concerns into `app/`, `lib/`, `components/`, and `contexts/` directories, promoting maintainability and reusability. `lib/` modules are highly specialized (e.g., `lib/github.ts` for GitHub, `lib/ai/gemini.ts` for AI).",
                "Comprehensive Error Handling & Logging: API routes (`app/api/*`) and core logic include `try-catch` blocks with `console.error` and return meaningful `NextResponse` error messages, handling specific API and rate limit errors.",
                "Secure Authentication & Token Management: Utilizes NextAuth.js for OAuth and implements AES-256-GCM encryption for sensitive GitHub tokens, storing them securely in the database. (Evidence: `lib/auth/encryption.ts`, `lib/auth/index.ts`).",
                "Performance Optimizations: Employs strategies like batched parallel GitHub API calls (`getMultipleFileContents` in `lib/github.ts`), adaptive file scoring (`scoreFile` in `lib/github.ts`) for efficient content fetching, and streaming API responses for chat (`app/api/chat/route.ts`).",
            ],
            improvements: [
                "Centralized Rate Limit Configuration: `RATE_LIMITS` in `lib/rate-limit.ts` are hardcoded with `TODO: set to 5 before production`. These values should be externalized to environment variables for easier management across environments and user tiers.",
                "Redundant Supabase Admin Client Instantiation: The `getSupabaseAdmin` function is duplicated across multiple `lib/` and `app/api/` files. Consolidating this into a single utility would improve maintainability. (Evidence: `lib/usage.ts`, `lib/ai/rag.ts`, `app/api/user/route.ts`, `app/api/embeddings/status/route.ts`, `app/api/history/[id]/route.ts`)",
                "Complex File Scoring Logic: The `scoreFile` function in `lib/github.ts` uses a long sequence of `if` conditions and regex. This could be refactored into a more declarative or data-driven approach to enhance readability and extensibility.",
                "Admin Guard Restrictiveness: The `ADMIN_EMAIL` guard in `app/api/analyze/route.ts` is currently very restrictive. While secure as fail-closed, it lacks a robust role-based access control mechanism for tiered user access beyond a single administrator.",
            ],
        },
        dataFlow:
            "The primary data flow for repository analysis begins with the user submitting a GitHub URL via `RepoInputForm.tsx` on `app/analyze/page.tsx`. This triggers a `POST` request to `app/api/analyze/route.ts`. The API route validates input using `lib/validation.ts`, authenticates the user (if signed in), and enforces rate limits via `lib/rate-limit.ts`. It then parses the GitHub URL (`parseGitHubUrl` in `lib/github.ts`), fetches repository metadata (`getRepoInfo`), retrieves the file tree (`getRepoFileTree`), and fetches the contents of relevant source files (`getMultipleFileContents`). These file contents are packaged into a text block (`buildCodebaseTextBlock`) and sent to Google Gemini for deep analysis (`analyzeCodebase` in `lib/ai/gemini.ts`). Upon receiving the AI's JSON response, the route logs usage (`logUsage`), initiates asynchronous storage of code embeddings for RAG (`storeEmbeddings` in `lib/ai/rag.ts`), and saves the analysis result to Prisma for user history. Finally, the structured analysis is returned to `app/analyze/page.tsx` and rendered by `AnalysisResult.tsx`. For chat, a user's message on `app/chat/page.tsx` hits `app/api/chat/route.ts`, which embeds the query (`embedText` in `lib/ai/embeddings.ts`), performs a hybrid search (`searchSimilarChunks` in `lib/ai/rag.ts`) to retrieve relevant code chunks from Supabase, builds an RAG context (`buildRagContext`), and then streams a Gemini AI response back to the client, which is displayed by `MessageContent.tsx` with a typewriter effect and Mermaid diagrams.",
        entryPoints: [
            "app/layout.tsx",
            "app/page.tsx",
            "app/analyze/page.tsx",
            "app/chat/page.tsx",
            "app/history/page.tsx",
            "app/profile/page.tsx",
            "app/api/analyze/route.ts",
            "app/api/chat/route.ts",
            "app/api/history/route.ts",
            "app/api/history/[id]/route.ts",
            "app/api/rate-limit/route.ts",
            "app/api/user/route.ts",
            "app/api/auth/[...nextauth]/route.ts",
            "app/api/embeddings/status/route.ts",
            "app/auth/callback/route.ts",
            "prisma/schema.prisma",
            "test-gemini.js",
        ],
        healthAudit: {
            security: {
                score: 90,
                findings: [
                    {
                        severity: "high",
                        title: "Environment Variable Validation and Exposure Risk",
                        description:
                            "The `test-gemini.js` script manually loads `.env.local` but reports the API key without robust checks (e.g., `apiKey.substring(0, 10)` on `undefined`). Critical environment variables like `NEXTAUTH_SECRET` and `TOKEN_ENCRYPTION_KEY` in `lib/auth/index.ts` and `lib/auth/encryption.ts` only warn if unset at module load, which could allow insecure operation if deployed without proper configuration, potentially leading to unencrypted OAuth tokens.",
                        file: "test-gemini.js, lib/auth/encryption.ts, lib/auth/index.ts",
                        recommendation:
                            "Implement robust environment variable validation at application startup to fail early if critical secrets are missing or malformed. Ensure `test-gemini.js` handles missing keys gracefully without accidental exposure of potentially sensitive placeholder values.",
                    },
                    {
                        severity: "medium",
                        title: "Admin-Only Analysis with Hardcoded Email",
                        description:
                            "The `/api/analyze` endpoint implements an admin guard (`if (!adminEmail || userEmail !== adminEmail)`) using a hardcoded `ADMIN_EMAIL` environment variable. While securely fail-closed if unset, this approach lacks flexibility for multi-user, multi-tier access control beyond a single admin, making it difficult to scale and potentially leading to unintended access restrictions if misconfigured.",
                        file: "app/api/analyze/route.ts",
                        recommendation:
                            "For production-ready scalability, replace the hardcoded `ADMIN_EMAIL` check with a robust role-based access control (RBAC) system, potentially integrated into the Prisma `User` model, to assign specific permissions to different user tiers (e.g., free, premium, admin).",
                    },
                    {
                        severity: "low",
                        title: "Default Rate Limit Values in Development",
                        description:
                            "`RATE_LIMITS` in `lib/rate-limit.ts` are set to `9999` with a `TODO: set to 5 before production`. Deploying with these large defaults would effectively disable rate limiting, potentially exposing the application to abuse and excessive LLM costs if not manually adjusted before production deployment.",
                        file: "lib/rate-limit.ts",
                        recommendation:
                            "Configure `RATE_LIMITS` using environment variables or a configuration service that can be dynamically updated based on the deployment environment (development/production) or user subscription tier. Ensure these values are carefully set and reviewed during deployment.",
                    },
                ],
            },
            maintainability: {
                index: 82,
                findings: [
                    {
                        type: "complex_logic",
                        severity: "medium",
                        title: "Complex File Scoring Logic",
                        description:
                            "The `scoreFile` function in `lib/github.ts` contains a complex series of sequential `if` conditions with regex patterns to assign priority scores to files. This logic, particularly with the `primaryLanguage` bonus, could be challenging to maintain, debug, or extend with new file types or scoring rules.",
                        file: "lib/github.ts",
                        recommendation:
                            "Consider refactoring `scoreFile` into a more declarative or data-driven approach, such as an array of configurable rules (pattern, score, condition) that can be iterated through. Extract sub-logic into smaller, more testable helper functions for improved clarity and modularity.",
                    },
                    {
                        type: "other",
                        severity: "low",
                        title: "Redundant Supabase Admin Client Instantiation",
                        description:
                            "The `getSupabaseAdmin` function, responsible for creating a Supabase client with service role keys, is duplicated across `lib/usage.ts`, `lib/ai/rag.ts`, `app/api/user/route.ts`, `app/api/embeddings/status/route.ts`, and `app/api/history/[id]/route.ts`. This redundancy makes it harder to update Supabase admin client configuration globally and increases the risk of inconsistencies.",
                        file: "lib/usage.ts, lib/ai/rag.ts, app/api/user/route.ts",
                        recommendation:
                            "Centralize the `getSupabaseAdmin` function into a single utility file (e.g., `lib/supabase/admin.ts`) and import it wherever the Supabase admin client is needed, ensuring consistent configuration and easier maintenance.",
                    },
                    {
                        type: "other",
                        severity: "low",
                        title: "Reliance on Client-Side Mermaid Diagram Sanitization",
                        description:
                            "The `sanitizeMermaid` function in `components/chat/MermaidDiagram.tsx` imperatively attempts to fix common LLM-generated Mermaid syntax errors (e.g., comments, illegal characters). While necessary for robust rendering, relying on client-side string manipulation to 'fix' AI output can be brittle and increases maintenance burden if AI output patterns change or if complex edge cases arise.",
                        file: "components/chat/MermaidDiagram.tsx",
                        recommendation:
                            "Focus on refining the LLM prompt to minimize invalid Mermaid syntax generation. Alternatively, explore server-side validation or a more robust parsing/transformation library for Mermaid diagrams if AI output remains inconsistent.",
                    },
                ],
            },
            architecture: {
                rating: 85,
                pattern: "Layered/Modular (Next.js App Router with Feature/Domain Separation)",
                findings: [
                    {
                        severity: "medium",
                        title: "Dual Authentication Management on Frontend",
                        description:
                            "The application uses NextAuth.js for server-side GitHub OAuth and session management, but `contexts/AuthContext.tsx` independently fetches and listens for session changes using `@supabase/supabase-js`. While both interact with Supabase, managing two distinct authentication state sources on the frontend adds cognitive load and potential for subtle discrepancies or race conditions between these states.",
                        recommendation:
                            "Consolidate the frontend authentication logic to rely primarily on a single source of truth for session management. For instance, `AuthContext` could potentially wrap or extend NextAuth.js's `useSession()` hook, removing the need for direct `supabase.auth.getSession()` and `onAuthStateChange` calls within the context.",
                    },
                    {
                        severity: "low",
                        title: "Tight Coupling of Orchestration in API Route",
                        description:
                            "The `app/api/analyze/route.ts` API endpoint acts as a 'fat controller,' orchestrating the entire analysis workflow, including GitHub API calls, AI interactions, usage logging, embedding storage, and history persistence. This tightly couples multiple external concerns within a single route handler, potentially hindering independent testing and making it less flexible to swap out underlying services.",
                        recommendation:
                            "Extract the complex orchestration logic into a dedicated service layer function (e.g., `lib/services/analysisService.ts`). This service could then encapsulate the sequence of steps, while the API route focuses solely on request parsing, authentication, and delegating to this service.",
                    },
                ],
            },
        },
    },
    analyzedFiles: 50,
    totalFiles: 61,
    timestamp: "2026-02-18T15:43:43.777Z",
    stats: {
        executionTimeMs: 58654,
        inputTokens: 77922,
        outputTokens: 3805,
        totalTokens: 88269,
        estimatedCostUsd: 0.0069856499999999995,
        totalFiles: 61,
        filesSent: 50,
        contextEfficiencyPct: 18,
    },
};

/**
 * Curated architect-level Q&A pairs from a real chat session on this codebase.
 *
 * SETUP (one-time, admin only):
 * 1. Navigate to /chat?repo=Taehoonryu04/codebase-narrator after analyzing it.
 * 2. Ask 3-4 architect-level questions. For each answer, copy:
 *    - Full answer markdown → `answer`
 *    - Source chip data (filePath, lineRange, content, matchedBy, rrfScore) → `sources`
 * 3. Replace the entries below with real data and commit.
 */
export const SAMPLE_QA: SampleQA[] = [
    {
        id: "hybrid-search",
        question: "How does the hybrid search pipeline work?",
        answer: `## Hybrid Search Pipeline

The RAG search in \`lib/ai/rag.ts\` runs **vector search** and **PostgreSQL FTS** in parallel, then fuses both ranked lists with **Reciprocal Rank Fusion (RRF)**.

\`\`\`mermaid
flowchart LR
    Q[User Query] --> EMB[embedText via gemini-embedding-001]
    Q --> FTS["websearch_to_tsquery (PostgreSQL)"]
    EMB --> VS["match_code_chunks RPC\\n(pgvector HNSW cosine)"]
    FTS --> KS["keyword_search_code_chunks RPC\\n(content_tsv GIN index)"]
    VS --> RRF["reciprocalRankFusion\\n(k=60, topK×2 candidates)"]
    KS --> RRF
    RRF --> DEDUP["Deduplicate by filePath::chunkIndex"]
    DEDUP --> TOP["Top-K SourceChunk[]\\nwith rrfScore + matchedBy"]
    TOP --> CTX[buildRagContext: format with file + line range]
    CTX --> GEMINI[Gemini generateContentStream with history]
\`\`\`

### Step 1 — Parallel Fetch (\`searchSimilarChunks\`)

\`Promise.all\` fires two queries simultaneously:

\`\`\`typescript
// lib/ai/rag.ts
const [queryEmbedding, keywordResultRaw] = await Promise.all([
    embedText(query),                           // gemini-embedding-001, 768-dim
    supabase.rpc("keyword_search_code_chunks", {
        keyword_query: query,
        match_count: fetchCount,               // topK × 2 = 16 candidates
    }),
]);
\`\`\`

The vector search runs after the embedding resolves (sequential dependency), but keyword search runs concurrently with the embedding call.

### Step 2 — RRF Fusion (\`reciprocalRankFusion\`)

Each chunk gets a score contribution from each ranked list:

\`\`\`
score(chunk) = Σ  1 / (60 + rank + 1)
\`\`\`

k=60 is the standard Elasticsearch RRF constant — it dampens the effect of very high ranks so a chunk at rank 1 in one list doesn't dominate over a chunk at rank 2 in both lists. Deduplication uses the key \`filePath::chunkIndex\`.

### Step 3 — matchedBy Tagging

The \`matchedBy\` field on each \`SourceChunk\` tracks whether it appeared in \`"vector"\`, \`"keyword"\`, or \`"both"\` lists — surfaced as color-coded badges in the source viewer modal (violet=both, blue=vector, amber=keyword).

### Graceful Degradation

If keyword search fails (e.g., a \`websearch_to_tsquery\` parse error on special characters), the function logs a warning and continues with pure vector results. Vector failure, however, throws — it's the primary signal.`,
        sources: [
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 3,
                content: `function reciprocalRankFusion(
    vectorResults: CodeChunk[],
    keywordResults: CodeChunk[],
    topK: number,
    k = 60
): SourceChunk[] {
    const scores = new Map<string, { chunk: CodeChunk; score: number; matchedBy: "vector" | "keyword" | "both" }>();

    const addResults = (list: CodeChunk[], source: "vector" | "keyword") => {
        list.forEach((chunk, rank) => {
            const key = \`\${chunk.filePath}::\${chunk.chunkIndex}\`;
            const prev = scores.get(key);
            const rrfScore = 1 / (k + rank + 1);
            scores.set(key, {
                chunk,
                score: (prev?.score ?? 0) + rrfScore,
                matchedBy: prev ? "both" : source,
            });
        });
    };

    addResults(vectorResults, "vector");
    addResults(keywordResults, "keyword");

    return [...scores.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((v) => ({ ...v.chunk, rrfScore: v.score, matchedBy: v.matchedBy }));
}`,
                startLine: 229,
                endLine: 261,
                rrfScore: 0.0328,
                matchedBy: "both",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 4,
                content: `export async function searchSimilarChunks(
    userId: string,
    repoFullName: string,
    query: string,
    topK: number = 8
): Promise<SourceChunk[]> {
    const supabase = getSupabaseAdmin();
    const fetchCount = topK * 2; // wider candidate set before fusion

    const [queryEmbedding, keywordResultRaw] = await Promise.all([
        embedText(query),
        supabase.rpc("keyword_search_code_chunks", {
            match_user_id: userId,
            match_repo: repoFullName,
            keyword_query: query,
            match_count: fetchCount,
        }),
    ]);`,
                startLine: 268,
                endLine: 286,
                rrfScore: 0.0295,
                matchedBy: "both",
            },
        ],
    },
    {
        id: "atomic-swap",
        question: "Explain the atomic embedding swap strategy",
        answer: `## Atomic Embedding Swap

When a user re-analyzes a repository, new embeddings must replace old ones **with zero gap** — a user who clicks "Analyze" and immediately navigates to Chat should always get search results, never an empty state.

### The Problem: Delete-Then-Insert Race

A naive implementation:
1. DELETE all embeddings for \`(userId, repoFullName)\`
2. INSERT new embeddings

Between steps 1 and 2, any chat query returns no results. On a repository with 100 files and 300+ chunks, the insert loop (sequential at 200ms delay per chunk for rate limiting) can take 60+ seconds.

### The Solution: UUID Batch ID + Insert-Then-Delete

\`\`\`mermaid
sequenceDiagram
    participant A as POST /api/analyze
    participant S as storeEmbeddings()
    participant DB as Supabase code_embeddings

    A->>S: fire-and-forget (authenticated users)
    S->>DB: INSERT new batch (batch_id = UUID, status=in_progress)
    loop every 10 chunks
        S->>DB: UPDATE embedding_jobs SET embedded_chunks = i+1
    end
    Note over DB: Old batch still queryable during entire insert
    S->>DB: DELETE WHERE batch_id != newBatchId
    Note over DB: Atomic swap: old gone, new searchable
    S->>DB: UPDATE embedding_jobs SET status='completed'
\`\`\`

### Implementation (\`lib/ai/rag.ts:storeEmbeddings\`)

\`\`\`typescript
const batchId = randomUUID();   // crypto.randomUUID()

// 1. Insert ALL new chunks tagged with this batchId
const { error: insertError } = await supabase
    .from("code_embeddings")
    .insert(rows);   // rows: [{ ...chunk, batch_id: batchId }]

// 2. Only after full insert, delete previous batch
await supabase
    .from("code_embeddings")
    .delete()
    .eq("user_id", userId)
    .eq("repo_full_name", repoFullName)
    .neq("batch_id", batchId);   // ← keep only new batch
\`\`\`

### Failure Handling

If the insert loop throws mid-way (e.g., Supabase timeout), the catch block:
1. Marks the job as \`"failed"\` in \`embedding_jobs\`
2. Deletes the **partial** new batch (\`.eq("batch_id", batchId)\`)
3. Leaves the old batch untouched and still searchable

This means a failed re-embedding never degrades the chat experience — the old (possibly stale) embeddings remain available.

### Progress Tracking

The chat page polls \`GET /api/embeddings/status?repo=owner/repo\` every 2 seconds while \`status === "in_progress"\` and renders an animated blue banner with a progress bar (\`embeddedChunks / totalChunks\`).`,
        sources: [
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 2,
                content: `    try {
        const embeddings: number[][] = [];

        for (let i = 0; i < allChunks.length; i++) {
            const text = \`File: \${allChunks[i].filePath}\\n\\n\${allChunks[i].content}\`;
            const embedding = await embedText(text);
            embeddings.push(embedding);

            if ((i + 1) % 10 === 0 || i === allChunks.length - 1) {
                await supabase
                    .from("embedding_jobs")
                    .update({ embedded_chunks: i + 1 })
                    .eq("batch_id", batchId);
            }

            if (i < allChunks.length - 1) {
                await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
            }
        }

        // Atomic swap: insert new, delete old
        const { error: insertError } = await supabase
            .from("code_embeddings")
            .insert(rows);

        const { error: deleteError } = await supabase
            .from("code_embeddings")
            .delete()
            .eq("user_id", userId)
            .eq("repo_full_name", repoFullName)
            .neq("batch_id", batchId);`,
                startLine: 114,
                endLine: 165,
                rrfScore: 0.0312,
                matchedBy: "both",
            },
            {
                filePath: "app/api/embeddings/status/route.ts",
                chunkIndex: 0,
                content: `export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo");
    // ... auth check ...
    const { data } = await supabase
        .from("embedding_jobs")
        .select("status, total_chunks, embedded_chunks, error_message, completed_at")
        .eq("user_id", userId)
        .eq("repo_full_name", repo)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    const progressPct = data.total_chunks > 0
        ? Math.round((data.embedded_chunks / data.total_chunks) * 100)
        : 0;

    return NextResponse.json({ status, progressPct, totalChunks, embeddedChunks });
}`,
                startLine: 1,
                endLine: 45,
                rrfScore: 0.0241,
                matchedBy: "vector",
            },
        ],
    },
    {
        id: "rag-chat-flow",
        question: "Walk me through the full RAG chat data flow",
        answer: `## RAG Chat Data Flow

The chat pipeline spans from button click in \`app/chat/page.tsx\` through \`POST /api/chat\` (server-side RAG + Gemini streaming) back to a typewriter-rendered bubble with clickable source chips.

\`\`\`mermaid
flowchart TD
    UI["User message\\n(input + conversation history)"] --> POST["POST /api/chat\\n{ message, repoFullName, history }"]
    POST --> AUTH{Supabase session?}
    AUTH -- 401 --> ERR1["NextResponse.json 401"]
    AUTH -- ok --> ZOD["Zod chatRequestSchema.safeParse()"]
    ZOD --> RL["checkAndIncrementChat()\\nPrisma RateLimit table"]
    RL -- 429 --> ERR2["NextResponse.json 429 + Retry-After"]
    RL -- ok --> SEARCH["searchSimilarChunks()\\nhybrid vector+keyword, top-8"]
    SEARCH -- empty --> ERR3["JSON: run analysis first"]
    SEARCH -- chunks --> CTX["buildRagContext()\\n[File: path, Lines: N-M] blocks"]
    CTX --> GEN["Gemini generateContentStream\\nwith system prompt + history + RAG context"]
    GEN --> SSE["text/event-stream SSE\\n{type:chunk,text} per delta\\n{type:done,sources,stats} at end"]
    SSE --> BUF["bufferRef.current += text\\n(no re-render on arrival)"]
    BUF --> TW["setInterval 16ms\\ndynamic drain: 1/3/6 chars"]
    TW --> DISP["setStreamingMessage state\\n(re-render: shows typed text + cursor)"]
    TW --> DONE{streamDoneRef?}
    DONE -- no --> TW
    DONE -- "yes + buffer empty" --> FIN["setMessages append\\n{ role:model, content, sources, stats }\\nsetSending false"]
    FIN --> CHIPS["Source chips render\\ndeduped by filePath, colored by matchedBy"]
\`\`\`

### Server: \`POST /api/chat\` (\`app/api/chat/route.ts\`)

1. **Auth** — \`getSession()\` from Supabase; 401 if no session (embeddings are user-scoped)
2. **Validation** — \`chatRequestSchema\` enforces \`message\` (non-empty string) and \`repoFullName\`
3. **Rate limit** — \`checkAndIncrementChat(userId)\` in \`lib/rate-limit.ts\`; returns 429 + \`Retry-After\` if over 50/day (currently 9999 for dev)
4. **Hybrid search** — \`searchSimilarChunks(userId, repoFullName, message, 8)\` returns top-8 \`SourceChunk[]\` via RRF
5. **Context building** — \`buildRagContext(chunks)\` formats each chunk as \`[File: path, Lines: N-M]\\ncontent\`
6. **Streaming** — \`model.generateContentStream({ contents: [...history, userMessage] })\` with injected RAG context; response piped as SSE

### Client: Typewriter Buffer (\`app/chat/page.tsx:startTypewriter\`)

The SSE reader (\`res.body.getReader()\`) appends text deltas to \`bufferRef.current\` — a plain string ref, **no state update**. This means hundreds of SSE chunks arrive without a single re-render.

A \`setInterval(16ms)\` drains the buffer:
- **Normal**: 1 char/tick (~60 chars/sec visible)
- **Catching up** (>80 buffered): 3 chars/tick
- **Flood** (>200 buffered): 6 chars/tick

When the SSE reader sees \`{"type":"done","sources":[...]}\`, it sets \`streamDoneRef.current = true\`. On the next tick where \`bufferRef\` is empty AND \`streamDoneRef\` is true, the interval clears itself and reads \`displayedRef.current\` **synchronously** (avoiding the nested-setter race) to finalize the message.`,
        sources: [
            {
                filePath: "app/chat/page.tsx",
                chunkIndex: 1,
                content: `    const startTypewriter = useCallback(() => {
        bufferRef.current = "";
        sourcesRef.current = [];
        statsRef.current = null;
        streamDoneRef.current = false;
        displayedRef.current = "";
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (bufferRef.current.length === 0) {
                if (streamDoneRef.current) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    const finalContent = displayedRef.current;
                    const sources = sourcesRef.current;
                    const stats = statsRef.current ?? undefined;
                    setMessages((msgs) => [
                        ...msgs,
                        { role: "model", content: finalContent, sources, stats },
                    ]);
                    setStreamingMessage(null);
                    setSending(false);
                    inputRef.current?.focus();
                }
                return;
            }
            const charsToShow =
                bufferRef.current.length > 200 ? 6
                : bufferRef.current.length > 80 ? 3
                : 1;
            const chars = bufferRef.current.slice(0, charsToShow);
            bufferRef.current = bufferRef.current.slice(charsToShow);
            displayedRef.current += chars;
            setStreamingMessage((prev) =>
                prev ? { ...prev, content: prev.content + chars } : prev
            );
        }, 16);
    }, []);`,
                startLine: 77,
                endLine: 116,
                rrfScore: 0.0341,
                matchedBy: "both",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 5,
                content: `export function buildRagContext(chunks: SourceChunk[]): string {
    if (chunks.length === 0) return "";

    return chunks
        .map((c) => \`[File: \${c.filePath}, Lines: \${c.startLine}-\${c.endLine}]\\n\${c.content}\`)
        .join("\\n\\n---\\n\\n");
}`,
                startLine: 321,
                endLine: 327,
                rrfScore: 0.0278,
                matchedBy: "keyword",
            },
        ],
    },
    {
        id: "adaptive-scorer",
        question: "How does the adaptive file scorer decide which files to send to Gemini?",
        answer: `## Adaptive File Scorer

\`scoreFile()\` in \`lib/github.ts\` assigns a numeric priority to every file in the Git tree. **Lower score = higher priority**. After scoring, the file list is sorted ascending and sliced to \`maxFiles\` (default 50) — ensuring the AI always sees the most architecturally relevant files first.

\`\`\`mermaid
flowchart TD
    TREE["Git Tree API\\nrecursive:1 — all files in one request"] --> FILTER["Filter: exclude node_modules, .next,\\nbinary files, lock files, depth > 10"]
    FILTER --> SCORE["scoreFile() — assign priority per file"]
    SCORE --> SORT["Sort ascending (lowest score first)"]
    SORT --> SLICE["slice(0, maxFiles=50)"]
    SLICE --> FETCH["getMultipleFileContents()\\nbatch 10 files via Promise.all"]
    FETCH --> BUILD["buildCodebaseTextBlock()\\n[File: path]\\ncontent (≤600 lines)"]
    BUILD --> GEMINI["Gemini 2.5 Flash\\ncreateAnalysisPrompt"]
\`\`\`

### Priority Tiers (first matching rule wins)

| Score | Tier | Examples |
|---|---|---|
| **5** | Root manifests | \`package.json\`, \`go.mod\`, \`Cargo.toml\`, \`pom.xml\` |
| **10+depth** | Entry points (depth ≤ 3) | \`app/page.tsx\`, \`index.ts\`, \`main.go\` |
| **20+depth** | Core source dirs | \`src/\`, \`lib/\`, \`app/\`, \`pkg/\`, \`api/\` |
| **25** | Root-level source | \`middleware.ts\`, root \`.ts\` files |
| **30** | Android UI resources | \`res/layout/*.xml\`, \`res/navigation/*.xml\` |
| **40** | Config/data | \`.prisma\`, \`.yaml\`, \`.toml\`, \`.graphql\` |
| **45** | Generic XML | Spring configs, Maven siblings |
| **60** | Docs | \`.md\`, \`.txt\`, \`.rst\` |
| **70** | Tests | \`*.test.ts\`, \`*.spec.ts\`, \`__tests__/\`, \`androidTest/\` |
| **90** | Generated | \`.d.ts\`, \`.min.js\`, \`migrations/\`, \`.next/\` |

### Language Bonus

If the file's extension matches the repo's primary language (e.g., TypeScript → \`.ts\`/\`.tsx\`) and it's inside a core source directory, it gets **−5** added to its score — pulling it ahead of same-tier files in other languages.

### Why This Matters

A 200-file TypeScript monorepo would hit the 50-file budget before exhausting source files. Without the scorer, alphabetical ordering would include deeply nested test fixtures ahead of \`lib/ai/rag.ts\`. With the scorer, \`package.json\` (score 5), \`app/api/analyze/route.ts\` (score ~23), and \`lib/github.ts\` (score ~22) all appear in the top 50 while test files and migration SQL files are pushed to the tail.

### Mid-path Test Detection

A regex catches test directories anywhere in the path, not just at the root:

\`\`\`typescript
if (/(^|\\/)(tests?|__tests__|specs?|androidTest)\\//i.test(path)) return 70;
\`\`\`

This handles Android (\`app/src/androidTest/...\`), Java (\`src/test/java/...\`), and nested Jest directories equally.`,
        sources: [
            {
                filePath: "lib/github.ts",
                chunkIndex: 3,
                content: `function scoreFile(path: string, primaryLanguage: string | null | undefined): number {
    const parts = path.split("/");
    const filename = parts[parts.length - 1];
    const depth = parts.length;

    if (/\\/(migrations?|generated?|\\.next)\\//i.test("/" + path)) return 90;
    if (/\\.(d\\.ts|min\\.js|min\\.css|js\\.map)$/.test(filename)) return 90;

    if (/\\.(test|spec|e2e)\\.[^.]+$/.test(filename)) return 70;
    if (/(^|\\/)(tests?|__tests__|specs?|androidTest)\\//i.test(path)) return 70;

    if (/\\.(md|txt|rst)$/i.test(filename)) return 60;

    if (
        depth === 1 &&
        /^(package\\.json|go\\.mod|Cargo\\.toml|pyproject\\.toml|requirements\\.txt|pom\\.xml|build\\.gradle|Gemfile|composer\\.json)$/.test(filename)
    ) return 5;

    if (depth <= 3 && /^(main|index|app|server|mod)\\.[^.]+$/.test(filename)) return 10 + depth;

    const inSrcDir = /^(src|lib|app|pkg|internal|core|api|server|backend|frontend|pages|routes|handlers?|controllers?)\\//i.test(path);
    if (inSrcDir) {
        const base = 20 + depth;
        const langBonus = matchesLanguage(filename, primaryLanguage) ? -5 : 0;
        return base + langBonus;
    }

    return 50 + depth * 2;
}`,
                startLine: 387,
                endLine: 433,
                rrfScore: 0.0335,
                matchedBy: "both",
            },
            {
                filePath: "app/api/analyze/route.ts",
                chunkIndex: 1,
                content: `        // Step 5: Recursive file tree (single API call via Git Tree API)
        const fileStructure = await getRepoFileTree(owner, repo, 10, userOctokit);

        // Step 6: Fetch file contents (priority-sorted, batched parallel)
        const filesToAnalyze = fileStructure.slice(0, maxFiles).map((f) => f.path);
        const fileContents = await getMultipleFileContents(owner, repo, filesToAnalyze, userOctokit);
        const loadedCount = fileContents.filter((f) => f.content !== null).length;

        // Step 7: Package into single text block for AI
        const codebaseTextBlock = buildCodebaseTextBlock(fileContents);`,
                startLine: 147,
                endLine: 168,
                rrfScore: 0.0263,
                matchedBy: "vector",
            },
        ],
    },
];
