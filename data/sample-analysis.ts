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
        answer: `The hybrid search pipeline in this codebase is designed to retrieve relevant code chunks by combining both vector similarity and keyword (Full-Text Search, FTS) methods. It's primarily implemented in the \`lib/ai/rag.ts\` file within the \`searchSimilarChunks\` function.

Here's a breakdown of the process:

1.  **Parallel Search Initialization**:
    *   The \`searchSimilarChunks\` function (in \`lib/ai/rag.ts\`) initiates two operations concurrently using \`Promise.all\`.
    *   The user's \`query\` is embedded into a 768-dimensional vector via \`embedText(query)\` using the \`gemini-embedding-001\` model.
    *   A keyword search is performed by calling the \`supabase.rpc("keyword_search_code_chunks", { ... })\` PostgreSQL function. This uses \`websearch_to_tsquery\` on a \`content_tsv\` GIN index for Full-Text Search.

2.  **Vector Similarity Search**:
    *   Once the \`queryEmbedding\` is ready, a vector similarity search is executed via \`supabase.rpc("match_code_chunks", { query_embedding: ..., ... })\`. This leverages \`pgvector\` with HNSW for cosine similarity matching.

3.  **Candidate Retrieval**:
    *   Both the vector and keyword searches retrieve \`topK * 2\` (e.g., 16) candidate code chunks to provide a wider pool for subsequent fusion.

4.  **Reciprocal Rank Fusion (RRF)**:
    *   The \`reciprocalRankFusion\` function (also in \`lib/ai/rag.ts\`) combines the ranked lists from both vector and keyword searches.
    *   It calculates a score for each unique chunk using the formula: \`score(chunk) = Σ 1 / (k + rank + 1)\`, where \`k\` is a constant (defaulting to 60) that dampens the effect of very high ranks.
    *   Deduplication occurs by creating a unique key for each chunk based on \`filePath\` and \`chunkIndex\` (\`\${chunk.filePath}::\${chunk.chunkIndex}\`). If a chunk appears in both lists, its scores are summed.

5.  **\`matchedBy\` Tagging**:
    *   During RRF, each \`SourceChunk\` is tagged with a \`matchedBy\` field indicating whether it was found by \`"vector"\`, \`"keyword"\`, or \`"both"\`. This metadata is used in the UI for color-coded badges (violet=both, blue=vector, amber=keyword).

6.  **Graceful Degradation**:
    *   If the keyword search fails (e.g., due to a \`websearch_to_tsquery\` parse error), a warning is logged, and the system proceeds with only the vector search results.
    *   However, a failure in the vector search component will cause the \`searchSimilarChunks\` function to throw an error, as it's considered the primary search signal.

7.  **Final Output**:
    *   The \`reciprocalRankFusion\` function returns a \`topK\` (defaulting to 8) array of \`SourceChunk[]\`, sorted by their RRF score.
    *   These \`SourceChunk\` instances are then passed to \`buildRagContext\`, which formats them into a structured string (e.g., \`[File: path, Lines: N-M]\\n<content>\`) for inclusion in the prompt sent to the Gemini large language model.

Here's a flowchart visualizing the pipeline:

\`\`\`mermaid
flowchart LR
    Q[User Query] --> EMB[embedText - gemini-embedding-001 768 dims]
    Q --> FTS[keyword_search_code_chunks RPC - FTS GIN]
    EMB --> VS[match_code_chunks RPC - pgvector HNSW cosine]
    FTS --> RRF[reciprocalRankFusion - k=60 topK x2 candidates]
    VS --> RRF
    RRF --> DEDUP[Deduplicate by filePath and chunkIndex]
    DEDUP --> TOP[Top-K SourceChunk - rrfScore and matchedBy]
    TOP --> CTX[buildRagContext - File Lines format]
    CTX --> GEN[Gemini generateContentStream]
\`\`\``,
        sources: [
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 3,
                content: `        .map((v) => ({
            ...v.chunk,
            rrfScore: v.score,
            matchedBy: v.matchedBy,
        }));
}

/**
 * Hybrid search: runs vector similarity + keyword (FTS) search in parallel,
 * then fuses results with Reciprocal Rank Fusion.
 * Degrades gracefully to pure vector search if keyword search fails or returns nothing.
 */
export async function searchSimilarChunks(
    userId: string,
    repoFullName: string,
    query: string,
    topK: number = 8
): Promise<SourceChunk[]> {
    const supabase = getSupabaseAdmin();
    const fetchCount = topK * 2; // wider candidate set before fusion

    // Embed query and run keyword search concurrently
    const [queryEmbedding, keywordResultRaw] = await Promise.all([
        embedText(query),
        supabase.rpc("keyword_search_code_chunks", {
            match_user_id: userId,
            match_repo: repoFullName,
            keyword_query: query,
            match_count: fetchCount,
        }),
    ]);

    // Vector search depends on embedding (runs after)
    const { data: vectorData, error: vectorError } = await supabase.rpc("match_code_chunks", {
        query_embedding: queryEmbedding,
        match_user_id: userId,
        match_repo: repoFullName,
        match_count: fetchCount,
    });

    if (vectorError) {
        console.error("❌ Vector search failed:", vectorError.message);
        throw vectorError;
    }

    const vectorChunks: CodeChunk[] = (vectorData ?? []).map(rowToCodeChunk);

    const keywordChunks: CodeChunk[] =
        !keywordResultRaw.error && keywordResultRaw.data
            ? keywordResultRaw.data.map(rowToCodeChunk)
            : [];

    if (keywordResultRaw.error) {
        console.warn("⚠️ Keyword search failed (vector-only fallback):", keywordResultRaw.error.message);
    }

    console.log(\`🔍 Hybrid search: \${vectorChunks.length} vector + \${keywordChunks.length} keyword results\`);

    return reciprocalRankFusion(vectorChunks, keywordChunks, topK);
}

/**
 * Format retrieved chunks into a context block for the chat prompt.
 * Includes file path and line range so Gemini can cite specific locations.
 */
export function buildRagContext(chunks: SourceChunk[]): string {
    if (chunks.length === 0) return "";

    return chunks
        .map((c) => \`[File: \${c.filePath}, Lines: \${c.startLine}-\${c.endLine}]\\n\${c.content}\`)
        .join("\\n\\n---\\n\\n");
}
`,
                startLine: 256,
                endLine: 328,
                rrfScore: 0.016129032258064516,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 2,
                content: `        // Mark job completed
        await supabase
            .from("embedding_jobs")
            .update({
                status: "completed",
                embedded_chunks: allChunks.length,
                completed_at: new Date().toISOString(),
            })
            .eq("batch_id", batchId);

        console.log(\`✅ Stored \${rows.length} embeddings for \${repoFullName} (batch \${batchId.slice(0, 8)})\`);
    } catch (err) {
        // Mark job failed
        await supabase
            .from("embedding_jobs")
            .update({
                status: "failed",
                error_message: err instanceof Error ? err.message : "Unknown error",
                completed_at: new Date().toISOString(),
            })
            .eq("batch_id", batchId);

        // Clean up any partially inserted new-batch rows
        await supabase
            .from("code_embeddings")
            .delete()
            .eq("user_id", userId)
            .eq("repo_full_name", repoFullName)
            .eq("batch_id", batchId);

        console.error(\`❌ Embedding failed for \${repoFullName} (batch \${batchId.slice(0, 8)}):\`, err);
        throw err;
    }
}

type RpcRow = {
    file_path: string;
    chunk_index: number;
    content: string;
    start_line: number;
    end_line: number;
};

function rowToCodeChunk(r: RpcRow): CodeChunk {
    return {
        filePath: r.file_path,
        chunkIndex: r.chunk_index,
        content: r.content,
        startLine: r.start_line ?? 1,
        endLine: r.end_line ?? 1,
    };
}

/**
 * Combine two ranked result lists using Reciprocal Rank Fusion.
 * score(d) = Σ 1/(k + rank(d)) across lists; k=60 is standard.
 * Deduplicates by filePath::chunkIndex key.
 * Returns SourceChunk[] with rrfScore and matchedBy populated.
 */
function reciprocalRankFusion(
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
        .map((v) => ({
            ...v.chunk,
            rrfScore: v.score,
            matchedBy: v.matchedBy,
        }));
}

/**
 * Hybrid search: runs vector similarity + keyword (FTS) search in parallel,
 * then fuses results with Reciprocal Rank Fusion.
 * Degrades gracefully to pure vector search if keyword search fails or returns nothing.
`,
                startLine: 170,
                endLine: 266,
                rrfScore: 0.015625,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 0,
                content: `import { createClient } from "@supabase/supabase-js";
import { embedText } from "./embeddings";
import { randomUUID } from "crypto";

// Service-role client for server-side vector operations (bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

const BATCH_DELAY_MS = 500; // 2 req/s = 120 RPM — safe margin on free tier

// ~750 tokens ≈ ~3000 characters; larger chunks reduce total count ~33%
const CHUNK_SIZE = 3000;
const CHUNK_OVERLAP = 300;

/** Minimal chunk shape used internally and stored in the DB. */
export interface CodeChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
    startLine: number;
    endLine: number;
}

/**
 * Enriched chunk returned from hybrid search.
 * Carries RRF fusion metadata on top of the base CodeChunk fields.
 * Exported for use by the chat route and the frontend types.
 */
export interface SourceChunk extends CodeChunk {
    rrfScore: number;
    matchedBy: "vector" | "keyword" | "both";
}

/**
 * Split a file's content into overlapping chunks of ~500 tokens.
 * Line numbers are computed from character offsets (1-indexed).
 */
export function chunkFile(filePath: string, content: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < content.length) {
        const end = Math.min(start + CHUNK_SIZE, content.length);
        const chunkContent = content.slice(start, end);

        // Count newlines before start/end positions to get 1-indexed line numbers
        const startLine = content.slice(0, start).split("\\n").length;
        const endLine = content.slice(0, end).split("\\n").length;

        chunks.push({
            filePath,
            chunkIndex: index++,
            content: chunkContent,
            startLine,
            endLine,
        });

        if (end === content.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Chunk, embed, and upsert file contents into Supabase code_embeddings table.
 * Uses atomic swap: old embeddings remain searchable until new batch is fully ready.
 * Progress is tracked in the embedding_jobs table for frontend polling.
 */
export async function storeEmbeddings(
    userId: string,
    repoFullName: string,
    fileContents: Array<{ path: string; content: string | null }>
): Promise<void> {
    const supabase = getSupabaseAdmin();
    const batchId = randomUUID();

    // Build all chunks
    const allChunks: CodeChunk[] = [];
    for (const file of fileContents) {
        if (!file.content) continue;
        allChunks.push(...chunkFile(file.path, file.content));
    }

    if (allChunks.length === 0) {
        console.log("⚠️ No chunks to embed — skipping");
        return;
    }

    // Create job record for progress tracking
    const { error: jobError } = await supabase
        .from("embedding_jobs")
        .insert({
            user_id: userId,
`,
                startLine: 1,
                endLine: 99,
                rrfScore: 0.015151515151515152,
                matchedBy: "vector",
            },
        ],
    },
    {
        id: "atomic-swap",
        question: "Walk me through the full system data flow — from GitHub URL submission to AI chat responses",
        answer: `The system data flow in Codebase Narrator involves two main phases: **Codebase Analysis** and **AI Chat Q&A**. Both leverage the \`/api/analyze\` and \`/api/chat\` Next.js API routes, respectively, and interact with various services including GitHub, Google Gemini AI, Supabase for authentication, and a PostgreSQL database (via Prisma) for persistence.

Here's a breakdown of the full system data flow:

\`\`\`mermaid
flowchart TD
    subgraph ClientUI["Client UI"]
        A[User]
        B[app/analyze/page.tsx]
        S[AnalysisResult.tsx]
        T[User asks in chat]
        AC[Chat response rendered]
    end

    subgraph AnalyzeAPI["Analysis API - api/analyze/route.ts"]
        C[POST /api/analyze]
        C --> D{analyzeRequestSchema}
        D -- invalid --> D_ERR[400 Zod Error]
        D -- valid --> E{supabase.auth.getSession}
        E --> F{Admin Guard - ADMIN_EMAIL check}
        F -- blocked --> F_ERR[403 Admin Only]
        F -- allowed --> GA{checkAnonAnalysisLimit}
        GA -- exceeded --> GA_ERR[429 Anon Limit]
        GA -- allowed --> GB{checkAndIncrementAnalysis}
        GB -- exceeded --> GB_ERR[429 Auth Limit]
        GB -- allowed --> I[parseGitHubUrl]
        I -- invalid --> I_ERR[400 Invalid URL]
        I -- valid --> J[getRepoInfo]
        J --> K[getRepoFileTree - adaptive scorer]
        K --> L[getMultipleFileContents]
        L --> M[buildCodebaseTextBlock]
        M --> N[analyzeCodebase - Gemini AI]
        N --> O1[logUsage - fire and forget]
        N --> O2[storeEmbeddings - async RAG indexing]
        N --> O3[prisma.analysis.upsert - save history]
        N --> R[200 AnalysisResult JSON]
    end

    subgraph ChatAPI["Chat API - api/chat/route.ts"]
        U[POST /api/chat]
        U --> V{supabase.auth.getSession}
        V -- no user --> V_ERR[401 Auth Required]
        V -- ok --> W{chatRequestSchema}
        W -- invalid --> W_ERR[400 Zod Error]
        W -- valid --> X{checkAndIncrementChat}
        X -- exceeded --> X_ERR[429 Chat Limit]
        X -- ok --> Y[searchSimilarChunks - hybrid RAG top-8]
        Y -- no embeddings --> Y_ERR[reply - run analysis first]
        Y -- chunks --> Z[buildRagContext]
        Z --> AA[Gemini generateContentStream]
        AA --> AB[SSE - chunk events then done event with sources]
    end

    A --> B
    B -- POST maxFiles=50 --> C
    R --> S
    S --> T
    T -- POST message and history --> U
    AB --> AC
\`\`\`

---

### Part 1: Codebase Analysis Flow

This flow is initiated when a user wants to analyze a GitHub repository.

1.  **User Initiates Analysis (Client-side):**
    *   The user inputs a GitHub repository URL into a form on the \`app/analyze/page.tsx\` client component.
    *   The \`handleAnalyze\` function in \`app/analyze/page.tsx\` (lines 44-74) sends a \`POST\` request to the \`/api/analyze\` endpoint, including the \`repoUrl\` and \`maxFiles\` (e.g., 50).
    *   The client-side UI updates to show progress indicators (e.g., "Connecting to repository...", "Mapping file tree...", etc., defined in \`ANALYSIS_STEPS\`, lines 14-19).

2.  **\`POST /api/analyze\` Endpoint (\`app/api/analyze/route.ts\`):**
    *   **Request Reception & Validation (lines 31-43):**
        *   The endpoint receives the \`NextRequest\`.
        *   The request body is validated against \`analyzeRequestSchema\` using \`safeParse\`. If validation fails, a \`400\` status with a Zod error message (via \`formatZodError\`) is returned.
    *   **Authentication & GitHub Token Acquisition (lines 47-69):**
        *   \`createClient()\` (from \`@/lib/supabase/server\`) initializes a Supabase client.
        *   \`supabase.auth.getSession()\` attempts to retrieve the user's session.
        *   If a \`session?.provider_token\` (GitHub OAuth token) is present, an \`Octokit\` instance is created using this token for authenticated GitHub API requests. Otherwise, GitHub API requests proceed with a default, unauthenticated token. The \`authenticatedUserId\` and \`userEmail\` are also extracted.
    *   **Authorization (Admin Guard) (lines 76-88):**
        *   An \`ADMIN_EMAIL\` environment variable is checked. If it's set and \`userEmail\` does not match, the request is blocked with a \`403\` status, limiting analysis to the admin.
    *   **Rate Limiting (lines 91-123):**
        *   **Anonymous Users:** If \`authenticatedUserId\` is \`null\`, \`checkAnonAnalysisLimit(ip)\` (from \`@/lib/rate-limit\`) enforces a limit (e.g., 1 analysis per day). Exceeding this returns a \`429\` status.
        *   **Authenticated Users:** If \`authenticatedUserId\` exists, \`checkAndIncrementAnalysis(authenticatedUserId)\` (from \`@/lib/rate-limit\`) applies a different rate limit. Exceeding it returns a \`429\` status with a \`Retry-After\` header.
    *   **GitHub URL Parsing (lines 126-140):**
        *   \`parseGitHubUrl(repoUrl)\` (from \`@/lib/github\`) extracts the \`owner\` and \`repo\` names from the URL. An invalid URL format results in a \`400\` status.
    *   **Repository Information Retrieval (lines 144-164):**
        *   \`getRepoInfo(owner, repo, userOctokit)\` (from \`@/lib/github\`) fetches basic repository metadata (e.g., stars, description).
        *   \`getRepoFileTree(owner, repo, 10, userOctokit)\` (from \`@/lib/github\`) recursively fetches the file tree of the repository, prioritizing relevant code files and limiting the depth.
        *   The \`fileStructure\` is sliced to \`maxFiles\`, and \`getMultipleFileContents(owner, repo, filesToAnalyze, userOctokit)\` (from \`@/lib/github\`) fetches the actual content of these selected files in parallel.
    *   **Codebase Packaging for AI (lines 168-170):**
        *   \`buildCodebaseTextBlock(fileContents)\` (from \`@/lib/github\`) formats the retrieved file contents into a single text block, with each file prefixed by \`[File: path/to/file.ts]\`, optimized for large language model input.
    *   **Gemini Deep Analysis (lines 173-175):**
        *   \`analyzeCodebase(repoInfo, fileStructure, codebaseTextBlock)\` (from \`@/lib/ai/gemini\`) sends the packaged code and repo info to the Gemini AI model. The prompt, defined in \`lib/ai/gemini.ts\` (lines 68-139), instructs Gemini to return a detailed JSON object covering an \`overview\`, \`keyFeatures\`, \`codeQuality\`, \`dataFlow\`, \`entryPoints\`, and a \`healthAudit\`.
    *   **Post-Analysis Actions (lines 178-244):**
        *   \`AnalysisStats\` are computed, including execution time, token usage, and estimated cost.
        *   The final \`AnalysisResult\` object is assembled.
        *   \`logUsage()\` (from \`@/lib/usage\`) asynchronously logs the analysis details for monitoring.
        *   **Store Embeddings:** For authenticated users, \`storeEmbeddings(authenticatedUserId, repoInfo.fullName, fileContents)\` (from \`@/lib/ai/rag\`) asynchronously generates embeddings for the analyzed files and stores them in a vector database for later use in RAG (Retrieval-Augmented Generation) for chat. This is a non-blocking operation.
        *   **Save to History:** For authenticated users, \`prisma.analysis.upsert()\` (from \`@/lib/db/prisma\`) saves the \`AnalysisResult\` to the database, updating an existing record or creating a new one for the user and repository. This ensures past analyses are accessible.
    *   **Response to Client (line 247):** The full \`AnalysisResult\` JSON is returned to the client with a \`200\` status.

3.  **Client-side Display (Client-side):**
    *   \`app/analyze/page.tsx\` receives the \`AnalysisResult\`.
    *   The \`AnalysisResult\` component renders the detailed AI-generated insights to the user.
    *   Upon successful analysis, the chat functionality for that specific repository is enabled.

---

### Part 2: AI Chat Responses Flow

This flow allows a user to ask questions about an already analyzed codebase.

1.  **User Initiates Chat (Client-side):**
    *   The user types a question into the chat interface for a previously analyzed repository.
    *   This sends a \`POST\` request to the \`/api/chat\` endpoint, including the \`repoFullName\`, the current \`message\`, and \`history\` of the conversation.

2.  **\`POST /api/chat\` Endpoint (\`app/api/chat/route.ts\`):**
    *   **Authentication (lines 24-31):**
        *   \`createClient()\` initializes a Supabase client.
        *   \`supabase.auth.getSession()\` retrieves the user's session. If \`session?.user?.id\` is not available, a \`401\` status ("Authentication required") is returned.
    *   **Request Validation (lines 34-40):**
        *   The request body is validated against \`chatRequestSchema\`. If invalid, a \`400\` status with a Zod error message is returned.
    *   **Rate Limiting (lines 43-55):**
        *   \`checkAndIncrementChat(userId)\` (from \`@/lib/rate-limit\`) enforces a chat-specific rate limit for the authenticated user. Exceeding it returns a \`429\` status with a \`Retry-After\` header.
    *   **RAG Retrieval (lines 59-74):**
        *   \`searchSimilarChunks(userId, repoFullName, message, 8)\` (from \`@/lib/ai/rag\`) performs the core RAG step. It takes the user's \`message\`, generates an embedding for it, and then queries the vector database (populated during analysis) to retrieve the 8 most semantically similar code chunks from the specified \`repoFullName\`.
        *   If no embeddings are found for the repository (meaning no prior analysis or embedding storage failed), a specific message ("No codebase embeddings found...") is returned.
        *   \`buildRagContext(chunks)\` (from \`@/lib/ai/rag\`) formats these retrieved code \`chunks\` into a \`Relevant Code Context\` block, similar to the analysis phase, for inclusion in the AI prompt.
    *   **Gemini Generate Content (lines 75-115, and implied):**
        *   A detailed \`systemPrompt\` is constructed. This prompt (lines 75-108) establishes the AI's role as an "expert software engineer," incorporates the \`repoFullName\`, the \`ragContext\` with the relevant code snippets, and provides strict instructions for generating specific, concise, technical answers, including Mermaid.js diagrams for complex flows or structures.
        *   \`genAI.getGenerativeModel({ model: "gemini-2.5-flash" })\` initializes the Gemini model.
        *   The \`contents\` array for the Gemini API call is built, including the \`systemPrompt\` (as the initial user turn), the \`history\` of the conversation, and the current user \`message\`.
        *   (Implicitly) \`model.generateContent(contents)\` is called to send the complete prompt to the Gemini model for a response.
    *   **Response to Client (Implicit, derived from error handling at line 66):** The AI's \`reply\` and the \`sources\` (file paths from the retrieved chunks) are returned as JSON with a \`200\` status.

3.  **Client-side Display (Client-side):**
    *   The client UI receives the AI's \`reply\` and \`sources\`.
    *   It renders the AI's response in the chat interface, potentially highlighting the code \`sources\` from which the answer was derived.`,
        sources: [
            {
                filePath: "app/api/analyze/route.ts",
                chunkIndex: 0,
                content: `import { NextRequest, NextResponse } from "next/server";
import {
    parseGitHubUrl,
    getRepoInfo,
    getRepoFileTree,
    getMultipleFileContents,
    buildCodebaseTextBlock,
} from "@/lib/github";
import { analyzeCodebase } from "@/lib/ai/gemini";
import { analyzeRequestSchema, formatZodError } from "@/lib/validation";
import type { AnalysisResult, AnalysisStats } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { Octokit } from "@octokit/rest";
import { checkAndIncrementAnalysis, windowLabel } from "@/lib/rate-limit";
import { storeEmbeddings } from "@/lib/ai/rag";
import { logUsage, checkAnonAnalysisLimit, estimateCost } from "@/lib/usage";

/**
 * POST /api/analyze
 *
 * GitHub Repository Deep Analysis API Endpoint
 *
 * Flow:
 * 1. Zod validation
 * 2. GitHub URL parsing
 * 3. Repo metadata (GitHub API)
 * 4. Recursive file tree (Git Tree API, single request)
 * 5. Priority-sorted file content fetch (batch parallel)
 * 6. Package into [File: path] text block
 * 7. Gemini deep analysis (source-code-first prompt)
 * 8. Return typed AnalysisResult
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

    try {
        // Step 1: Parse & validate
        const body = await request.json();
        console.log("📥 Analysis request received:", body);

        const validationResult = analyzeRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: formatZodError(validationResult.error) },
                { status: 400 }
            );
        }

        const { repoUrl, maxFiles } = validationResult.data;

        // Step 2: Get authenticated user's GitHub token (if available)
        let userOctokit: Octokit | undefined;
        let authenticatedUserId: string | null = null;
        let userEmail: string | null = null;
        try {
            const supabase = await createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.provider_token) {
                // User is authenticated - use their GitHub OAuth token
                console.log("🔐 Using authenticated user's GitHub token");
                userOctokit = new Octokit({
                    auth: session.provider_token,
                });
                authenticatedUserId = session.user?.id ?? null;
                userEmail = session.user?.email ?? null;
            } else {
                console.log("👤 Anonymous user - using default GitHub token");
            }
        } catch (error) {
            console.warn("⚠️ Failed to get user session, continuing with default token:", error);
        }

        // Step 2a: Admin guard — fail-closed: block everyone unless userEmail === ADMIN_EMAIL.
`,
                startLine: 1,
                endLine: 80,
                rrfScore: 0.01639344262295082,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/chat/route.ts",
                chunkIndex: 1,
                content: `        if (chunks.length === 0) {
            return NextResponse.json({
                reply: "No codebase embeddings found for this repository. Please run an analysis first so I can index the code.",
                sources: [],
            });
        }

        const ragContext = buildRagContext(chunks);
        // Deduplicate file paths for the log, but keep full SourceChunk[] for the client
        const uniqueFiles = [...new Set(chunks.map((c) => c.filePath))];
        console.log(\`🔍 Retrieved \${chunks.length} chunks from \${uniqueFiles.length} files\`);

        // Step 5: Build prompt and call Gemini
        const systemPrompt = \`You are an expert software engineer helping a developer understand a codebase.

You have been given relevant code snippets from the repository "\${repoFullName}" retrieved via semantic search.

## Relevant Code Context
\${ragContext}

---

Answer the user's question about this codebase using the code context above.
- Be specific: reference actual file names, function names, and line-level details from the context.
- If the context doesn't contain enough information, say so clearly rather than guessing.
- Keep answers concise and technical.
- When explaining complex logic, data flows, class relationships, or system architecture, include a Mermaid.js diagram to visualize the structure. Use a fenced code block with the \\\`\\\`\\\`mermaid language tag. Prefer flowchart TD for flows, classDiagram for class relationships, and sequenceDiagram for request/response flows.
- When drawing data flow or request/response diagrams, always include: (1) authentication and rate-limit checks with their error exit paths, (2) the exact file/function responsible for each step based on the code context, (3) the complete response lifecycle including what the client does after receiving the response such as rendering, streaming buffers, or UI updates.
- CRITICAL Mermaid syntax rules you MUST follow or the diagram will fail to render:
  1. Node IDs must be alphanumeric only — no dots, dashes, or spaces. Use underscores: D6_1 not D6.1.
  2. Node labels inside [] or () or {} must contain plain text only. No parentheses (), no curly braces {}, no arrow symbols --> or ->, no pipe |, no colon :, no semicolon ;, no quotes.
  3. Never put an arrow symbol inside a label string. Write [RRF Top 8 Chunks] not [Reciprocal Rank Fusion --> Top-8].
  4. Keep labels short. Omit parens from function names: write checkAndIncrementChat not checkAndIncrementChat().
  5. subgraph titles must also contain plain text only — no parentheses. Write "subgraph Settings Activity" not "subgraph Settings Activity (com/example/Settings.java)".\`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build contents array: system context as first user turn, then history, then current message
        const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I have reviewed the code context and am ready to answer questions about this codebase." }] },
`,
                startLine: 75,
                endLine: 115,
                rrfScore: 0.016129032258064516,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/analyze/route.ts",
                chunkIndex: 1,
                content: `                console.log("👤 Anonymous user - using default GitHub token");
            }
        } catch (error) {
            console.warn("⚠️ Failed to get user session, continuing with default token:", error);
        }

        // Step 2a: Admin guard — fail-closed: block everyone unless userEmail === ADMIN_EMAIL.
        // If ADMIN_EMAIL is unset, all requests are blocked (no accidental open access).
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail || userEmail !== adminEmail) {
            console.log(\`🔒 Admin guard: blocked analysis request from \${userEmail ?? "anonymous"}\`);
            return NextResponse.json(
                {
                    error: "Analysis is currently limited to the admin to maintain free-tier resource stability. Please explore the pre-analyzed samples below.",
                    adminOnly: true,
                },
                { status: 403 }
            );
        }

        // Step 2b-anon: Enforce 1 analysis/day for unauthenticated users
        if (!authenticatedUserId) {
            const allowed = await checkAnonAnalysisLimit(ip);
            if (!allowed) {
                console.log(\`🚫 Anon rate limit exceeded for IP \${ip}\`);
                return NextResponse.json(
                    {
                        error: "Guest analysis limit reached (1/day). Sign in with GitHub for unlimited analyses.",
                        upgradeRequired: true,
                    },
                    { status: 429 }
                );
            }
        }

        // Step 2c: Enforce rate limit (authenticated users only)
        if (authenticatedUserId) {
            const rateLimit = await checkAndIncrementAnalysis(authenticatedUserId);
            if (!rateLimit.allowed) {
                const retryAfterSecs = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);
                console.log(\`🚫 Rate limit exceeded for user \${authenticatedUserId}\`);
                return NextResponse.json(
                    {
                        error: \`Analysis limit reached (\${rateLimit.limit}/\${windowLabel()}). Resets at \${rateLimit.resetAt.toLocaleString()}.\`,
                        resetAt: rateLimit.resetAt.toISOString(),
                    },
                    {
                        status: 429,
                        headers: { "Retry-After": String(retryAfterSecs) },
                    }
                );
            }
            console.log(\`📊 Rate limit: \${rateLimit.current}/\${rateLimit.limit} analyses today\`);
        }

        // Step 3: Parse GitHub URL
        const parsed = parseGitHubUrl(repoUrl);

        if (!parsed) {
            return NextResponse.json(
                { error: "Invalid GitHub URL. Format: https://github.com/owner/repo" },
                { status: 400 }
            );
        }

        const { owner, repo } = parsed;
        console.log(\`🔍 Starting deep analysis: \${owner}/\${repo}\`);

        // Step 4: Fetch repository metadata
        console.log("📊 Fetching repository metadata...");
`,
                startLine: 74,
                endLine: 143,
                rrfScore: 0.015873015873015872,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/analyze/route.ts",
                chunkIndex: 2,
                content: `                { error: "Invalid GitHub URL. Format: https://github.com/owner/repo" },
                { status: 400 }
            );
        }

        const { owner, repo } = parsed;
        console.log(\`🔍 Starting deep analysis: \${owner}/\${repo}\`);

        // Step 4: Fetch repository metadata
        console.log("📊 Fetching repository metadata...");
        const repoInfo = await getRepoInfo(owner, repo, userOctokit);
        console.log(\`✅ Repository: \${repoInfo.fullName} (⭐ \${repoInfo.stars})\`);

        // Step 5: Recursive file tree (single API call via Git Tree API)
        console.log("🌳 Fetching recursive file tree...");
        const fileStructure = await getRepoFileTree(owner, repo, 10, userOctokit);
        console.log(\`✅ \${fileStructure.length} important files detected\`);

        if (fileStructure.length < 3) {
            console.warn(
                \`⚠️ Only \${fileStructure.length} files found — possible docs-only or minimal repo\`
            );
        }

        // Step 6: Fetch file contents (priority-sorted, batched parallel)
        console.log(\`📄 Fetching contents for up to \${maxFiles} files...\`);
        const filesToAnalyze = fileStructure.slice(0, maxFiles).map((f) => f.path);
        const fileContents = await getMultipleFileContents(owner, repo, filesToAnalyze, userOctokit);
        const loadedCount = fileContents.filter((f) => f.content !== null).length;
        console.log(\`✅ Loaded \${loadedCount}/\${filesToAnalyze.length} file contents\`);

        // Step 7: Package into single text block for AI
        console.log("📦 Packaging codebase text block...");
        const codebaseTextBlock = buildCodebaseTextBlock(fileContents);
        console.log(\`✅ Text block: ~\${Math.round(codebaseTextBlock.length / 1000)}K characters\`);

        // Step 8: Gemini deep analysis
        console.log("🤖 Starting Gemini deep source code analysis...");
        const { analysis, usageMetadata } = await analyzeCodebase(repoInfo, fileStructure, codebaseTextBlock);
        console.log("✅ Deep analysis complete");

        // Step 9: Build stats
        const executionTimeMs = Date.now() - startTime;
        const inputTokens = usageMetadata?.promptTokenCount ?? 0;
        const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;
        const totalTokens = usageMetadata?.totalTokenCount ?? 0;
        const estimatedCostUsd = estimateCost(inputTokens, outputTokens);
        const contextEfficiencyPct =
            fileStructure.length > 0
                ? Math.round(((fileStructure.length - loadedCount) / fileStructure.length) * 100)
                : 0;

        const stats: AnalysisStats = {
            executionTimeMs,
            inputTokens,
            outputTokens,
            totalTokens,
            estimatedCostUsd,
            totalFiles: fileStructure.length,
            filesSent: loadedCount,
            contextEfficiencyPct,
        };

        const result: AnalysisResult = {
            repoInfo,
            fileStructure,
`,
                startLine: 134,
                endLine: 199,
                rrfScore: 0.015625,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/chat/route.ts",
                chunkIndex: 0,
                content: `import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementChat, windowLabel } from "@/lib/rate-limit";
import { searchSimilarChunks, buildRagContext } from "@/lib/ai/rag";
import { chatRequestSchema, formatZodError } from "@/lib/validation";
import { logUsage, estimateCost } from "@/lib/usage";
import type { ChatStats } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * POST /api/chat
 *
 * RAG-powered codebase Q&A chat endpoint.
 *
 * Flow:
 * 1. Auth check
 * 2. Zod validation
 * 3. Chat rate limit check
 * 4. Embed query → similarity search → build RAG context
 * 5. Gemini generateContent with system prompt + history + user message
 * 6. Return { reply, sources }
 */
export async function POST(request: NextRequest) {
    try {
        // Step 1: Auth
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required. Sign in to use codebase chat." },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Step 2: Validate
        const body = await request.json();
        const validation = chatRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: formatZodError(validation.error) },
                { status: 400 }
            );
        }

        const { repoFullName, message, history } = validation.data;

        // Step 3: Rate limit
        const rateLimit = await checkAndIncrementChat(userId);
        if (!rateLimit.allowed) {
            const retryAfterSecs = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);
            return NextResponse.json(
                {
                    error: \`Chat limit reached (\${rateLimit.limit}/\${windowLabel()}). Resets at \${rateLimit.resetAt.toLocaleString()}.\`,
                    resetAt: rateLimit.resetAt.toISOString(),
                },
                {
                    status: 429,
                    headers: { "Retry-After": String(retryAfterSecs) },
                }
            );
        }

        // Step 4: RAG retrieval
        console.log(\`💬 Chat request: "\${message.slice(0, 60)}..." for \${repoFullName}\`);
        const ragStart = Date.now();
        const chunks = await searchSimilarChunks(userId, repoFullName, message, 8);
        const ragRetrievalMs = Date.now() - ragStart;

        if (chunks.length === 0) {
            return NextResponse.json({
                reply: "No codebase embeddings found for this repository. Please run an analysis first so I can index the code.",
                sources: [],
            });
        }

        const ragContext = buildRagContext(chunks);
        // Deduplicate file paths for the log, but keep full SourceChunk[] for the client
`,
                startLine: 1,
                endLine: 83,
                rrfScore: 0.015384615384615385,
                matchedBy: "vector",
            },
            {
                filePath: "app/analyze/page.tsx",
                chunkIndex: 0,
                content: `"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RepoInputForm } from "@/components/analyze/RepoInputForm";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { FloatingPaths } from "@/components/ui/floating-paths";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";

const ANALYSIS_STEPS = [
    { icon: "🔗", label: "Connecting to repository..." },
    { icon: "🗂", label: "Mapping file tree & scoring relevance..." },
    { icon: "📄", label: "Fetching priority source files..." },
    { icon: "🧠", label: "Running deep AI analysis..." },
    { icon: "✨", label: "Finalizing insights..." },
];

/**
 * Inner component that reads search params (must be inside Suspense)
 */
function AnalyzeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResultType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [adminOnly, setAdminOnly] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const autoTriggered = useRef(false);
    const stepTimersRef = useRef<NodeJS.Timeout[]>([]);

    // Auto-analyze from query params (e.g., from History re-analyze)
    useEffect(() => {
        const repoParam = searchParams.get("repo");
        const autoParam = searchParams.get("auto");

        if (repoParam && autoParam === "true" && !autoTriggered.current) {
            autoTriggered.current = true;
            handleAnalyze(repoParam);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleAnalyze = async (url: string) => {
        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setAdminOnly(false);
        setCurrentStep(0);

        // Steps 0→1→2→3 advance quickly (~1.5s each) mirroring fast GitHub API calls.
        // Step 3 ("Running deep AI analysis") holds until Gemini responds.
        // Step 4 ("Finalizing insights") shows briefly after response arrives.
        const timers: NodeJS.Timeout[] = [
            setTimeout(() => setCurrentStep(1), 1500),
            setTimeout(() => setCurrentStep(2), 3000),
            setTimeout(() => setCurrentStep(3), 5000),
        ];
        stepTimersRef.current = timers;
        const clearTimers = () => timers.forEach(clearTimeout);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl: url, maxFiles: 50 }),
            });

            const data = await response.json();

            if (response.status === 403 && data.adminOnly) {
                clearTimers();
                setAdminOnly(true);
`,
                startLine: 1,
                endLine: 74,
                rrfScore: 0.015151515151515152,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/gemini.ts",
                chunkIndex: 1,
                content: `  "architecture": "Detailed description of the architectural pattern. Reference specific directories and files. (e.g., 'Next.js App Router with lib/ for business logic separation, API routes in app/api/, shared types in lib/types/')",
  "keyFeatures": [
    "Feature 1 — cite the specific files/functions implementing it",
    "Feature 2 — with evidence from source code",
    "Feature 3 — be specific, not generic"
  ],
  "codeQuality": {
    "score": 85,
    "strengths": ["Specific strength with file/pattern reference", "Another strength"],
    "improvements": ["Specific improvement suggestion", "Another suggestion"]
  },
  "dataFlow": "Trace the main data flow from user input to final output, referencing actual files. (e.g., 'User submits URL in AnalyzeForm → POST /api/analyze → parseGitHubUrl() → getRepoInfo() → getRepoFileTree() → Gemini AI → AnalysisResult rendered by AnalysisResult.tsx')",
  "entryPoints": ["List actual entry point files found in the codebase"],
  "healthAudit": {
    "security": {
      "score": 85,
      "findings": [
        {
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "What the issue is and where it was found in the code",
          "file": "path/to/file.ts (optional, omit if not file-specific)",
          "recommendation": "Concrete fix — e.g., 'Move secret to environment variable and add to .gitignore'"
        }
      ]
    },
    "maintainability": {
      "index": 72,
      "findings": [
        {
          "type": "god_class|circular_dependency|complex_logic|other",
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "What makes this hard to maintain, with evidence from source code",
          "file": "path/to/file.ts (optional)",
          "recommendation": "Concrete refactoring suggestion"
        }
      ]
    },
    "architecture": {
      "rating": 78,
      "pattern": "Detected pattern name (e.g., 'MVC', 'MVVM', 'Clean Architecture', 'Layered')",
      "findings": [
        {
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "Specific architectural violation or concern observed in the code",
          "recommendation": "How to align with the detected pattern or industry best practices"
        }
      ]
    }
  }
}

HEALTH AUDIT RULES:
- Security score, maintainability index, and architecture rating are 0–100 integers.
- severity must be exactly one of: "critical", "high", "medium", "low".
- Use "critical" only for issues that could cause data loss, exposure of secrets, or system crashes.
- Use "high" for significant risks that require near-term action.
- Use "medium" for code smells or suboptimal patterns.
- Use "low" for minor style or documentation gaps.
- Limit findings to the most impactful ones (max 5 per category). Prioritize actionable items.
- Every finding must be grounded in actual code you read — do not fabricate issues.\`;
}

/**
 * Gemini API로 전체 코드베이스 심층 분석
 *
 * 핵심 변경:
 * - 파일별 마크다운 포맷 대신 [File: path] 텍스트 블록 사용
 * - 소스코드 중심 분석 (README 참고 수준)
 * - 1M 토큰 컨텍스트 활용한 대규모 분석
`,
                startLine: 68,
                endLine: 139,
                rrfScore: 0.014925373134328358,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/analyze/route.ts",
                chunkIndex: 3,
                content: `            inputTokens,
            outputTokens,
            totalTokens,
            estimatedCostUsd,
            totalFiles: fileStructure.length,
            filesSent: loadedCount,
            contextEfficiencyPct,
        };

        const result: AnalysisResult = {
            repoInfo,
            fileStructure,
            analysis,
            analyzedFiles: loadedCount,
            totalFiles: fileStructure.length,
            timestamp: new Date().toISOString(),
            stats,
        };

        console.log(\`🎉 Analysis complete! \${loadedCount}/\${fileStructure.length} files, \${totalTokens} tokens, $\${estimatedCostUsd.toFixed(6)}, \${executionTimeMs}ms\`);

        // Log usage (fire-and-forget)
        logUsage({
            userId: authenticatedUserId,
            ipAddress: ip,
            eventType: "analyze",
            repoFullName: repoInfo.fullName,
            executionTimeMs,
            inputTokens,
            outputTokens,
            totalTokens,
            totalFiles: fileStructure.length,
            filesSent: loadedCount,
            estimatedCostUsd,
        });

        // Step 10: Store embeddings for RAG (authenticated users only, fire-and-forget)
        if (authenticatedUserId) {
            storeEmbeddings(authenticatedUserId, repoInfo.fullName, fileContents).catch((err) => {
                console.error("⚠️ Embedding storage failed (non-blocking):", err);
            });
        }

        // Step 11: Save to history (authenticated users only)
        if (authenticatedUserId) {
            try {
                await prisma.analysis.upsert({
                    where: {
                        userId_repoFullName: {
                            userId: authenticatedUserId,
                            repoFullName: repoInfo.fullName,
                        },
                    },
                    update: {
                        repoUrl,
                        result: JSON.parse(JSON.stringify(result)),
                        analyzedFiles: loadedCount,
                        totalFiles: fileStructure.length,
                        analyzedAt: new Date(),
                    },
                    create: {
                        userId: authenticatedUserId,
                        repoUrl,
                        repoOwner: repoInfo.owner,
                        repoName: repoInfo.name,
                        repoFullName: repoInfo.fullName,
                        result: JSON.parse(JSON.stringify(result)),
                        analyzedFiles: loadedCount,
                        totalFiles: fileStructure.length,
                    },
                });
                console.log("💾 Analysis saved to history");
            } catch (dbError) {
                console.error("⚠️ Failed to save analysis to history:", dbError);
            }
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("❌ Error during analysis:", error);

        if (error instanceof Error) {
`,
                startLine: 188,
                endLine: 269,
                rrfScore: 0.014705882352941176,
                matchedBy: "vector",
            },
        ],
    },
    {
        id: "source-traceability",
        question: "How does the source traceability system work — from chunk storage to clickable source chips in the chat UI?",
        answer: `The source traceability system in this codebase works by meticulously tracking relevant code snippets from their initial storage as chunks all the way to their interactive display as clickable chips in the chat UI.

Here's a breakdown of the full data flow:

\`\`\`mermaid
flowchart TD
    subgraph Indexing["Indexing - lib/ai/rag.ts"]
        A1[GitHub Files] --> A2[chunkFile - 3000 chars with 300 overlap]
        A2 --> A3[CodeChunk - filePath startLine endLine content]
        A3 --> A4[embedText - gemini-embedding-001 768 dims]
        A4 --> A5[storeEmbeddings - atomic swap via batch_id]
        A5 --> A6[code_embeddings - pgvector HNSW and FTS GIN]
    end

    subgraph Retrieval["Retrieval - api/chat and lib/ai/rag.ts"]
        B1[User Query] --> B2[searchSimilarChunks]
        B2 --> B3[embedText query]
        B2 --> B4[keyword_search_code_chunks RPC]
        B3 --> B5[match_code_chunks RPC - vector similarity]
        B5 --> B6[reciprocalRankFusion - topK x2 candidates]
        B4 --> B6
        B6 --> B7[SourceChunk array - rrfScore and matchedBy tag]
        B7 --> B8[buildRagContext - File Lines format]
        B8 --> B9[Gemini generateContentStream]
        B9 --> B10[SSE chunk events - streaming text]
        B9 --> B11[SSE done event - sources SourceChunk array and stats]
    end

    subgraph Frontend["Chat UI - app/chat/page.tsx"]
        B10 --> C1[SSE Reader]
        C1 --> C2[bufferRef - no re-renders on arrival]
        C2 --> C3[setInterval 16ms - typewriter drain 1 to 6 chars]
        C3 --> C4[streamingMessage state - live cursor]
        B11 --> C5[streamDoneRef true and sourcesRef stored]
        C5 --> C6[setMessages - finalize with sources and stats]
        C6 --> C7[Dedup by filePath - best RRF chunk per file]
        C7 --> C8[Source chips - violet=both blue=vector amber=keyword]
        C8 --> C9[SourceViewerModal - raw snippet and line range]
    end
\`\`\`

Here's a detailed explanation:

1.  **Chunk Storage and Embedding (\`lib/ai/rag.ts\`)**:
    *   When a GitHub repository is analyzed, its files are split into smaller \`CodeChunk\` objects using \`chunkFile\`. These chunks typically have around 3000 characters with 300 characters of overlap. Each \`CodeChunk\` stores its \`filePath\`, \`chunkIndex\`, \`content\`, \`startLine\`, and \`endLine\`.
    *   These \`CodeChunk\` contents are then embedded into vectors using \`embedText\` (powered by \`gemini-embedding-001\`).
    *   The chunks and their embeddings are stored in the Supabase \`code_embeddings\` table via \`storeEmbeddings\`. Supabase utilizes \`pgvector\` for vector search (HNSW index) and a \`content_tsv\` GIN index for Full-Text Search (FTS).

2.  **RAG Retrieval (\`app/api/chat/route.ts\`, \`lib/ai/rag.ts\`)**:
    *   When a user submits a chat query, the \`POST /api/chat\` endpoint orchestrates the retrieval process.
    *   The \`searchSimilarChunks\` function is invoked. It performs two searches concurrently using \`Promise.all\`:
        *   **Vector Similarity Search**: The user's \`query\` is embedded using \`embedText\`. This embedding is then used with the \`supabase.rpc("match_code_chunks", { query_embedding: ... })\` function, leveraging \`pgvector\` to find semantically similar code chunks.
        *   **Keyword Full-Text Search**: The \`supabase.rpc("keyword_search_code_chunks", { keyword_query: ... })\` function performs a PostgreSQL Full-Text Search on the \`content_tsv\` GIN index to find chunks matching keywords in the query.
    *   Both searches retrieve \`topK * 2\` (e.g., 16) candidate chunks to ensure a wide selection for fusion.
    *   The results from both searches (which are \`CodeChunk[]\`) are then passed to \`reciprocalRankFusion\`. This function combines and re-ranks the chunks, calculating an \`rrfScore\` for each. Crucially, it tags each \`SourceChunk\` with a \`matchedBy\` property: \`"vector"\`, \`"keyword"\`, or \`"both"\`.
    *   The \`reciprocalRankFusion\` function returns the \`topK\` (defaulting to 8) highest-scoring \`SourceChunk[]\`.
    *   These \`SourceChunk[]\` are then passed to \`buildRagContext\`, which formats them into a structured string, including \`[File: path, Lines: N-M]\` and the chunk content, for inclusion in the \`systemPrompt\` sent to the Gemini model.

3.  **Streaming Response from Gemini (\`app/api/chat/route.ts\`)**:
    *   The Gemini model generates a response stream (\`model.generateContentStream\`).
    *   As the AI generates text, \`app/api/chat/route.ts\` enqueues Server-Sent Events (SSE) of \`type: "chunk"\` containing the streamed text.
    *   Once the Gemini stream completes, the \`/api/chat\` route captures token usage and execution stats. It then sends a final SSE event of \`type: "done"\`. This \`done\` event is critical, as it includes the final generated \`reply\`, the \`SourceChunk[]\` that were used for RAG (now referred to as \`sources\` in the client), and the \`stats\` (token counts, cost, etc.).

4.  **Client-Side Stream Processing and Finalization (\`app/chat/page.tsx\` details from \`data/sample-analysis.ts\`)**:
    *   On the client side (\`app/chat/page.tsx\`), an SSE reader listens for these events.
    *   Received text \`chunk\` data is appended to \`bufferRef.current\`, which does not trigger a UI re-render.
    *   A \`setInterval\` loop (e.g., every 16ms) drains characters from \`bufferRef.current\` into \`displayedRef.current\` at a variable rate (e.g., 1 to 6 characters per tick for a typewriter effect). This drained text is then used to update the \`streamingMessage\` state (\`setStreamingMessage\`), causing the UI to re-render the partially typed response and cursor.
    *   When the SSE reader receives the \`type: "done"\` event, it sets \`streamDoneRef.current = true\`. It also stores the received \`sources\` and \`stats\`.
    *   On a subsequent \`setInterval\` tick, if \`bufferRef.current\` is empty AND \`streamDoneRef.current\` is true, the interval clears. The complete message from \`displayedRef.current\`, along with the received \`sources\` and \`stats\`, is then appended to the main \`messages\` state (\`setMessages\`).

5.  **Source Chips Rendering (\`app/chat/page.tsx\` details from \`data/sample-analysis.ts\`)**:
    *   After the message is finalized and added to the \`messages\` state, the UI renders the \`sources\` as clickable chips.
    *   These \`sources\` are deduped by their \`filePath\` to avoid redundant chips for different chunks from the same file.
    *   Each chip is color-coded based on its \`matchedBy\` property: violet for \`"both"\`, blue for \`"vector"\`, and amber for \`"keyword"\`. This visual cue helps the user understand how the relevant code was found.`,
        sources: [
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 0,
                content: `import { createClient } from "@supabase/supabase-js";
import { embedText } from "./embeddings";
import { randomUUID } from "crypto";

// Service-role client for server-side vector operations (bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

const BATCH_DELAY_MS = 500; // 2 req/s = 120 RPM — safe margin on free tier

// ~750 tokens ≈ ~3000 characters; larger chunks reduce total count ~33%
const CHUNK_SIZE = 3000;
const CHUNK_OVERLAP = 300;

/** Minimal chunk shape used internally and stored in the DB. */
export interface CodeChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
    startLine: number;
    endLine: number;
}

/**
 * Enriched chunk returned from hybrid search.
 * Carries RRF fusion metadata on top of the base CodeChunk fields.
 * Exported for use by the chat route and the frontend types.
 */
export interface SourceChunk extends CodeChunk {
    rrfScore: number;
    matchedBy: "vector" | "keyword" | "both";
}

/**
 * Split a file's content into overlapping chunks of ~500 tokens.
 * Line numbers are computed from character offsets (1-indexed).
 */
export function chunkFile(filePath: string, content: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < content.length) {
        const end = Math.min(start + CHUNK_SIZE, content.length);
        const chunkContent = content.slice(start, end);

        // Count newlines before start/end positions to get 1-indexed line numbers
        const startLine = content.slice(0, start).split("\\n").length;
        const endLine = content.slice(0, end).split("\\n").length;

        chunks.push({
            filePath,
            chunkIndex: index++,
            content: chunkContent,
            startLine,
            endLine,
        });

        if (end === content.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Chunk, embed, and upsert file contents into Supabase code_embeddings table.
 * Uses atomic swap: old embeddings remain searchable until new batch is fully ready.
 * Progress is tracked in the embedding_jobs table for frontend polling.
 */
export async function storeEmbeddings(
    userId: string,
    repoFullName: string,
    fileContents: Array<{ path: string; content: string | null }>
): Promise<void> {
    const supabase = getSupabaseAdmin();
    const batchId = randomUUID();

    // Build all chunks
    const allChunks: CodeChunk[] = [];
    for (const file of fileContents) {
        if (!file.content) continue;
        allChunks.push(...chunkFile(file.path, file.content));
    }

    if (allChunks.length === 0) {
        console.log("⚠️ No chunks to embed — skipping");
        return;
    }

    // Create job record for progress tracking
    const { error: jobError } = await supabase
        .from("embedding_jobs")
        .insert({
            user_id: userId,
`,
                startLine: 1,
                endLine: 99,
                rrfScore: 0.015151515151515152,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 3,
                content: `        .map((v) => ({
            ...v.chunk,
            rrfScore: v.score,
            matchedBy: v.matchedBy,
        }));
}

/**
 * Hybrid search: runs vector similarity + keyword (FTS) search in parallel,
 * then fuses results with Reciprocal Rank Fusion.
 * Degrades gracefully to pure vector search if keyword search fails or returns nothing.
 */
export async function searchSimilarChunks(
    userId: string,
    repoFullName: string,
    query: string,
    topK: number = 8
): Promise<SourceChunk[]> {
    const supabase = getSupabaseAdmin();
    const fetchCount = topK * 2; // wider candidate set before fusion

    // Embed query and run keyword search concurrently
    const [queryEmbedding, keywordResultRaw] = await Promise.all([
        embedText(query),
        supabase.rpc("keyword_search_code_chunks", {
            match_user_id: userId,
            match_repo: repoFullName,
            keyword_query: query,
            match_count: fetchCount,
        }),
    ]);

    // Vector search depends on embedding (runs after)
    const { data: vectorData, error: vectorError } = await supabase.rpc("match_code_chunks", {
        query_embedding: queryEmbedding,
        match_user_id: userId,
        match_repo: repoFullName,
        match_count: fetchCount,
    });

    if (vectorError) {
        console.error("❌ Vector search failed:", vectorError.message);
        throw vectorError;
    }

    const vectorChunks: CodeChunk[] = (vectorData ?? []).map(rowToCodeChunk);

    const keywordChunks: CodeChunk[] =
        !keywordResultRaw.error && keywordResultRaw.data
            ? keywordResultRaw.data.map(rowToCodeChunk)
            : [];

    if (keywordResultRaw.error) {
        console.warn("⚠️ Keyword search failed (vector-only fallback):", keywordResultRaw.error.message);
    }

    console.log(\`🔍 Hybrid search: \${vectorChunks.length} vector + \${keywordChunks.length} keyword results\`);

    return reciprocalRankFusion(vectorChunks, keywordChunks, topK);
}

/**
 * Format retrieved chunks into a context block for the chat prompt.
 * Includes file path and line range so Gemini can cite specific locations.
 */
export function buildRagContext(chunks: SourceChunk[]): string {
    if (chunks.length === 0) return "";

    return chunks
        .map((c) => \`[File: \${c.filePath}, Lines: \${c.startLine}-\${c.endLine}]\\n\${c.content}\`)
        .join("\\n\\n---\\n\\n");
}
`,
                startLine: 256,
                endLine: 328,
                rrfScore: 0.014925373134328358,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/chat/route.ts",
                chunkIndex: 1,
                content: `        if (chunks.length === 0) {
            return NextResponse.json({
                reply: "No codebase embeddings found for this repository. Please run an analysis first so I can index the code.",
                sources: [],
            });
        }

        const ragContext = buildRagContext(chunks);
        // Deduplicate file paths for the log, but keep full SourceChunk[] for the client
        const uniqueFiles = [...new Set(chunks.map((c) => c.filePath))];
        console.log(\`🔍 Retrieved \${chunks.length} chunks from \${uniqueFiles.length} files\`);

        // Step 5: Build prompt and call Gemini
        const systemPrompt = \`You are an expert software engineer helping a developer understand a codebase.

You have been given relevant code snippets from the repository "\${repoFullName}" retrieved via semantic search.

## Relevant Code Context
\${ragContext}

---

Answer the user's question about this codebase using the code context above.
- Be specific: reference actual file names, function names, and line-level details from the context.
- If the context doesn't contain enough information, say so clearly rather than guessing.
- Keep answers concise and technical.
- When explaining complex logic, data flows, class relationships, or system architecture, include a Mermaid.js diagram to visualize the structure. Use a fenced code block with the \\\`\\\`\\\`mermaid language tag. Prefer flowchart TD for flows, classDiagram for class relationships, and sequenceDiagram for request/response flows.
- When drawing data flow or request/response diagrams, always include: (1) authentication and rate-limit checks with their error exit paths, (2) the exact file/function responsible for each step based on the code context, (3) the complete response lifecycle including what the client does after receiving the response such as rendering, streaming buffers, or UI updates.
- CRITICAL Mermaid syntax rules you MUST follow or the diagram will fail to render:
  1. Node IDs must be alphanumeric only — no dots, dashes, or spaces. Use underscores: D6_1 not D6.1.
  2. Node labels inside [] or () or {} must contain plain text only. No parentheses (), no curly braces {}, no arrow symbols --> or ->, no pipe |, no colon :, no semicolon ;, no quotes.
  3. Never put an arrow symbol inside a label string. Write [RRF Top 8 Chunks] not [Reciprocal Rank Fusion --> Top-8].
  4. Keep labels short. Omit parens from function names: write checkAndIncrementChat not checkAndIncrementChat().
  5. subgraph titles must also contain plain text only — no parentheses. Write "subgraph Settings Activity" not "subgraph Settings Activity (com/example/Settings.java)".\`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build contents array: system context as first user turn, then history, then current message
        const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I have reviewed the code context and am ready to answer questions about this codebase." }] },
`,
                startLine: 75,
                endLine: 115,
                rrfScore: 0.014705882352941176,
                matchedBy: "vector",
            },
        ],
    },
    {
        id: "adaptive-scorer",
        question: "How does the adaptive file scorer decide which files to send to Gemini?",
        answer: `The adaptive file scorer, implemented in the \`scoreFile\` function within \`lib/github.ts\`, assigns a numeric priority to every file in the Git tree. The core principle is: **Lower score = higher priority**. After all files are scored, the list is sorted in ascending order (lowest score first) and then sliced to a maximum number of files (\`maxFiles\`, default 50). This ensures that only the most relevant and architecturally important files are sent to Gemini.

Here's how \`scoreFile\` makes its decision:

\`\`\`mermaid
flowchart TD
    GIT[Git Tree API - all files recursive] --> FILTER[Filter - depth limit exclusions binary check]
    FILTER --> SCORE[scoreFile - first matching rule wins - lower score = higher priority]
    SCORE --> SORT[Sort all files ascending by score]
    SORT --> SLICE[Slice to maxFiles - default 50]
    SLICE --> FETCH[getMultipleFileContents - batched parallel]
    FETCH --> BLOCK[buildCodebaseTextBlock - File path format max 600 lines]
    BLOCK --> GEMINI[Gemini analyzeCodebase]

    SCORE -.-> T1[5 - root manifests]
    SCORE -.-> T2[10 + depth - entry points depth 3 or less]
    SCORE -.-> T3[20 + depth - 5 lang bonus - core src dirs]
    SCORE -.-> T4[40 - config and data files]
    SCORE -.-> T5[50 + depth x2 - default fallback]
    SCORE -.-> T6[60 - docs]
    SCORE -.-> T7[70 - tests]
    SCORE -.-> T8[90 - generated or compiled]
\`\`\`

### Scoring Logic (\`lib/github.ts\`, Lines 387-494)

The \`scoreFile\` function takes a \`path\` (string) and the \`primaryLanguage\` of the repository. It calculates \`filename\` and \`depth\` from the path and applies rules in a cascading manner; the **first matching rule wins**.

1.  **Generated/Compiled Files (Score 90)**:
    *   These are the lowest priority.
    *   Matched by:
        *   \`/\\/(migrations?|generated?|\\.next)\\//i.test("/" + path)\`: Directories like \`migrations/\`, \`generated/\`, or \`.next/\`.
        *   \`/\\.(d\\.ts|min\\.js|min\\.css|js\\.map)$/.test(filename)\`: Files like \`.d.ts\`, \`.min.js\`, \`.min.css\`, \`.js.map\`.

2.  **Test Files (Score 70)**:
    *   Matched by:
        *   \`/\\.(test|spec|e2e)\\.[^.]+$/.test(filename)\`: Files ending with \`.test.*\`, \`.spec.*\`, or \`.e2e.*\`.
        *   \`/(^|\\/)(tests?|__tests__|specs?|androidTest)\\//i.test(path)\`: Directories like \`test/\`, \`__tests__/\`, \`specs/\`, or \`androidTest/\` anywhere in the path.

3.  **Documentation Files (Score 60)**:
    *   \`/\\.(md|txt|rst)$/i.test(filename)\`: Markdown, text, or reStructuredText files.

4.  **Generic XML (Score 45)**:
    *   \`/\\.xml$/.test(filename)\`: General XML files (e.g., Maven \`pom.xml\` siblings, Spring configs). This is behind other config files.

5.  **Config/Data Files (Score 40)**:
    *   \`/\\.(json|jsonc|yaml|yml|toml|ini|cfg|env\\.example|prisma|graphql|proto|sql)$/.test(filename)\`: Common configuration or data formats.

6.  **Android UI Resources (Score 30)**:
    *   \`/\\/(res\\/layout|res\\/menu|res\\/navigation|res\\/drawable)\\//i.test("/" + path) && /\\.xml$/.test(filename)\`: XML files specific to Android UI layouts, menus, navigation, or drawables.

7.  **Root-level Source Files (Score 25)**:
    *   \`depth === 1 && matchesLanguage(filename, primaryLanguage)\`: Source files directly in the repository root that match the primary language (e.g., \`middleware.ts\` in a TypeScript repo).

8.  **Files inside Core Source Directories (Score 20 + depth - 5 bonus)**:
    *   \`inSrcDir = /^(src|lib|app|pkg|internal|core|api|server|backend|frontend|pages|routes|handlers?|controllers?)\\//i.test(path)\`: Files within common source directories.
    *   The base score is \`20 + depth\`.
    *   **Language Bonus**: If the file's extension matches the \`primaryLanguage\` of the repository (checked by \`matchesLanguage\` function), a **-5** is added to its score, making it higher priority than other languages in the same tier.

9.  **Entry Points (Score 10 + depth)**:
    *   \`depth <= 3 && /^(main|index|app|server|mod)\\.[^.]+$/.test(filename)\`: Important entry point files like \`main.go\`, \`index.ts\`, \`app.py\`, \`server.js\` if they are at a shallow depth (1 to 3).

10. **Root Manifests (Score 5)**:
    *   These are the highest priority.
    *   \`depth === 1 && /^(package\\.json|go\\.mod|Cargo\\.toml|pyproject\\.toml|requirements\\.txt|pom\\.xml|build\\.gradle|Gemfile|composer\\.json)$/.test(filename)\`: Key manifest files at the root of the repository.

11. **Everything Else (Score 50 + depth * 2)**:
    *   Any file not caught by the above rules receives a default score that increases with depth, pushing deeper, less specific files lower in priority.

### Language Matching (\`matchesLanguage\` in \`lib/github.ts\`, Lines 466-485)

The \`matchesLanguage\` helper function determines if a \`filename\` matches the repository's \`primaryLanguage\`. It uses a \`Record<string, RegExp>\` map to associate common primary languages (e.g., \`typescript\`, \`python\`, \`go\`) with regular expressions that match their typical file extensions (e.g., \`/\\.(ts|tsx)$/\` for TypeScript).

### How Scores Are Used

After \`scoreFile\` has assigned a score to every file path:
1.  The list of file paths is sorted in ascending order based on these scores.
2.  The sorted list is then \`slice\`d to \`maxFiles\` (default 50), ensuring that only the highest-priority files (lowest scores) are selected.
3.  These selected files' contents are then fetched (\`getMultipleFileContents\`) and combined into a single text block (\`buildCodebaseTextBlock\`) for the Gemini AI.`,
        sources: [
            {
                filePath: "lib/github.ts",
                chunkIndex: 4,
                content: `): Promise<Array<{ path: string; content: string | null }>> {
    const BATCH_SIZE = 10;
    const results: Array<{ path: string; content: string | null }> = [];

    // 우선순위 정렬: 핵심 파일이 먼저 처리되도록
    const sorted = prioritizePaths(paths);

    // 배치로 나누어서 처리
    for (let i = 0; i < sorted.length; i += BATCH_SIZE) {
        const batch = sorted.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(async (path) => ({
                path,
                content: await getFileContent(owner, repo, path, octokit),
            }))
        );
        results.push(...batchResults);
    }

    return results;
}

/**
 * Adaptive file scorer — assigns a priority score to each file path.
 * Lower score = higher priority = fetched first within the maxFiles budget.
 *
 * Tiers (first matching rule wins):
 *  90  — Generated/compiled (.d.ts, .min.js, migrations/, .next/ subdirs)
 *  70  — Test files (*.test.*, *.spec.*, __tests__/, test/ dirs)
 *  60  — Docs (.md, .txt, .rst)
 *   5  — Root-level key manifests (package.json, go.mod, Cargo.toml, …)
 *  10+depth — Entry points (main.*, index.*, app.*, server.* at depth ≤ 3)
 *  20+depth — Files inside core source dirs (src/, lib/, app/, pkg/, …)
 *  25  — Root-level source files matching primary language
 *  40  — Other config/data files (.json, .yaml, .toml, …)
 *  50+depth×2 — Everything else
 *
 * Primary language bonus: −5 if file extension matches repo's primary language.
 */
function scoreFile(path: string, primaryLanguage: string | null | undefined): number {
    const parts = path.split("/");
    const filename = parts[parts.length - 1];
    const depth = parts.length;

    // Generated / compiled — push to end
    if (/\\/(migrations?|generated?|\\.next)\\//i.test("/" + path)) return 90;
    if (/\\.(d\\.ts|min\\.js|min\\.css|js\\.map)$/.test(filename)) return 90;

    // Test files — catches both root-level test/ dirs and mid-path variants (e.g. app/src/test/..., androidTest/)
    if (/\\.(test|spec|e2e)\\.[^.]+$/.test(filename)) return 70;
    if (/(^|\\/)(tests?|__tests__|specs?|androidTest)\\//i.test(path)) return 70;

    // Docs
    if (/\\.(md|txt|rst)$/i.test(filename)) return 60;

    // Root-level key manifests
    if (
        depth === 1 &&
        /^(package\\.json|go\\.mod|Cargo\\.toml|pyproject\\.toml|requirements\\.txt|pom\\.xml|build\\.gradle|Gemfile|composer\\.json)$/.test(filename)
    ) return 5;

    // Entry points (shallow depth only)
    if (depth <= 3 && /^(main|index|app|server|mod)\\.[^.]+$/.test(filename)) return 10 + depth;

    // Core source directories
    const inSrcDir = /^(src|lib|app|pkg|internal|core|api|server|backend|frontend|pages|routes|handlers?|controllers?)\\//i.test(path);
    if (inSrcDir) {
        const base = 20 + depth;
        // Language bonus inside src dirs
        const langBonus = matchesLanguage(filename, primaryLanguage) ? -5 : 0;
        return base + langBonus;
    }

    // Root-level source files
    if (depth === 1 && matchesLanguage(filename, primaryLanguage)) return 25;

    // UI resource files (Android layouts, iOS storyboards, etc.) — ahead of generic config
`,
                startLine: 348,
                endLine: 424,
                rrfScore: 0.015873015873015872,
                matchedBy: "vector",
            },
            {
                filePath: "lib/github.ts",
                chunkIndex: 5,
                content: `        const base = 20 + depth;
        // Language bonus inside src dirs
        const langBonus = matchesLanguage(filename, primaryLanguage) ? -5 : 0;
        return base + langBonus;
    }

    // Root-level source files
    if (depth === 1 && matchesLanguage(filename, primaryLanguage)) return 25;

    // UI resource files (Android layouts, iOS storyboards, etc.) — ahead of generic config
    if (/\\/(res\\/layout|res\\/menu|res\\/navigation|res\\/drawable)\\//i.test("/" + path) && /\\.xml$/.test(filename)) return 30;

    // Other config/data files
    if (/\\.(json|jsonc|yaml|yml|toml|ini|cfg|env\\.example|prisma|graphql|proto|sql)$/.test(filename)) return 40;
    // Generic XML (pom.xml siblings, Spring config, etc.) — behind config, ahead of docs
    if (/\\.xml$/.test(filename)) return 45;

    return 50 + depth * 2;
}

/** Returns true if the filename's extension matches the repo's primary language. */
function matchesLanguage(filename: string, primaryLanguage: string | null | undefined): boolean {
    if (!primaryLanguage) return false;
    const lang = primaryLanguage.toLowerCase();
    const extMap: Record<string, RegExp> = {
        typescript: /\\.(ts|tsx)$/,
        javascript: /\\.(js|jsx|mjs|cjs)$/,
        python: /\\.py$/,
        go: /\\.go$/,
        rust: /\\.rs$/,
        java: /\\.java$/,
        kotlin: /\\.(kt|kts)$/,
        ruby: /\\.rb$/,
        php: /\\.php$/,
        "c#": /\\.cs$/,
        "c++": /\\.(cpp|cc|cxx|hpp|hxx)$/,
        c: /\\.(c|h)$/,
        swift: /\\.swift$/,
        scala: /\\.(scala|sc)$/,
    };
    return extMap[lang]?.test(filename) ?? false;
}

/**
 * 파일 경로 우선순위 정렬 (legacy — inputs are already sorted by scoreFile)
 * Kept for getMultipleFileContents compatibility; returns paths unchanged.
 */
function prioritizePaths(paths: string[]): string[] {
    return paths;
}

/**
 * 파일 내용을 하나의 거대한 텍스트 블록으로 패키징
 *
 * 포맷:
 *   [File: path/to/file.js]
 *   (실제 코드 내용)
 *
 * Gemini에 전달할 때 구조적으로 파싱 가능한 형태로 구성.
 * 각 파일은 maxLinesPerFile 줄까지만 포함해 토큰 절약.
 */
export function buildCodebaseTextBlock(
    fileContents: Array<{ path: string; content: string | null }>,
    maxLinesPerFile: number = 600
): string {
    const blocks: string[] = [];

    for (const file of fileContents) {
        if (!file.content) continue;

        const truncatedLines = file.content.split("\\n").slice(0, maxLinesPerFile);
        const wasTruncated = file.content.split("\\n").length > maxLinesPerFile;
        const suffix = wasTruncated ? \`\\n... (truncated at \${maxLinesPerFile} lines)\` : "";

        blocks.push(\`[File: \${file.path}]\\n\${truncatedLines.join("\\n")}\${suffix}\`);
    }

    return blocks.join("\\n\\n");
}
`,
                startLine: 415,
                endLine: 494,
                rrfScore: 0.015625,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/gemini.ts",
                chunkIndex: 1,
                content: `  "architecture": "Detailed description of the architectural pattern. Reference specific directories and files. (e.g., 'Next.js App Router with lib/ for business logic separation, API routes in app/api/, shared types in lib/types/')",
  "keyFeatures": [
    "Feature 1 — cite the specific files/functions implementing it",
    "Feature 2 — with evidence from source code",
    "Feature 3 — be specific, not generic"
  ],
  "codeQuality": {
    "score": 85,
    "strengths": ["Specific strength with file/pattern reference", "Another strength"],
    "improvements": ["Specific improvement suggestion", "Another suggestion"]
  },
  "dataFlow": "Trace the main data flow from user input to final output, referencing actual files. (e.g., 'User submits URL in AnalyzeForm → POST /api/analyze → parseGitHubUrl() → getRepoInfo() → getRepoFileTree() → Gemini AI → AnalysisResult rendered by AnalysisResult.tsx')",
  "entryPoints": ["List actual entry point files found in the codebase"],
  "healthAudit": {
    "security": {
      "score": 85,
      "findings": [
        {
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "What the issue is and where it was found in the code",
          "file": "path/to/file.ts (optional, omit if not file-specific)",
          "recommendation": "Concrete fix — e.g., 'Move secret to environment variable and add to .gitignore'"
        }
      ]
    },
    "maintainability": {
      "index": 72,
      "findings": [
        {
          "type": "god_class|circular_dependency|complex_logic|other",
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "What makes this hard to maintain, with evidence from source code",
          "file": "path/to/file.ts (optional)",
          "recommendation": "Concrete refactoring suggestion"
        }
      ]
    },
    "architecture": {
      "rating": 78,
      "pattern": "Detected pattern name (e.g., 'MVC', 'MVVM', 'Clean Architecture', 'Layered')",
      "findings": [
        {
          "severity": "critical|high|medium|low",
          "title": "Short finding title",
          "description": "Specific architectural violation or concern observed in the code",
          "recommendation": "How to align with the detected pattern or industry best practices"
        }
      ]
    }
  }
}

HEALTH AUDIT RULES:
- Security score, maintainability index, and architecture rating are 0–100 integers.
- severity must be exactly one of: "critical", "high", "medium", "low".
- Use "critical" only for issues that could cause data loss, exposure of secrets, or system crashes.
- Use "high" for significant risks that require near-term action.
- Use "medium" for code smells or suboptimal patterns.
- Use "low" for minor style or documentation gaps.
- Limit findings to the most impactful ones (max 5 per category). Prioritize actionable items.
- Every finding must be grounded in actual code you read — do not fabricate issues.\`;
}

/**
 * Gemini API로 전체 코드베이스 심층 분석
 *
 * 핵심 변경:
 * - 파일별 마크다운 포맷 대신 [File: path] 텍스트 블록 사용
 * - 소스코드 중심 분석 (README 참고 수준)
 * - 1M 토큰 컨텍스트 활용한 대규모 분석
`,
                startLine: 68,
                endLine: 139,
                rrfScore: 0.015384615384615385,
                matchedBy: "vector",
            },
            {
                filePath: "lib/github.ts",
                chunkIndex: 2,
                content: `                    /LICENSE/i,
                    /CHANGELOG/i,
                    /CONTRIBUTING/i,

                    // Configuration files
                    /package\\.json$/,
                    /tsconfig.*\\.json$/,
                    /\\.config\\.(js|ts|mjs|cjs|json)$/,
                    /next\\.config/,
                    /vite\\.config/,
                    /tailwind\\.config/,
                    /webpack\\.config/,
                    /babel\\.config/,
                    /eslint/,
                    /prettier/,
                    /\\.env\\.example$/,
                    /Dockerfile$/,
                    /docker-compose/,
                    /Makefile$/,
                    /\\.gitignore$/,
                    /\\.nvmrc$/,
                    /\\.node-version$/,

                    // JavaScript/TypeScript (more permissive)
                    /\\.(tsx?|jsx?|mjs|cjs)$/,
                    /\\.(json|jsonc)$/,

                    // Python
                    /\\.py$/,
                    /requirements.*\\.txt$/,
                    /setup\\.py$/,
                    /pyproject\\.toml$/,
                    /poetry\\.lock$/,
                    /Pipfile$/,

                    // Rust
                    /\\.rs$/,
                    /Cargo\\.toml$/,

                    // Go
                    /\\.go$/,
                    /go\\.(mod|sum)$/,

                    // Java/Kotlin
                    /\\.(java|kt|kts)$/,
                    /pom\\.xml$/,
                    /build\\.gradle(\\.kts)?$/,

                    // C/C++
                    /\\.(c|cpp|cc|cxx|h|hpp|hxx)$/,
                    /CMakeLists\\.txt$/,

                    // Ruby
                    /\\.rb$/,
                    /Gemfile$/,

                    // PHP
                    /\\.php$/,
                    /composer\\.json$/,

                    // CSS/SCSS
                    /\\.(css|scss|sass|less|styl)$/,

                    // HTML/Templates
                    /\\.(html|htm|ejs|hbs|pug|jade)$/,

                    // Shell scripts
                    /\\.(sh|bash|zsh|fish)$/,

                    // Other languages
                    /\\.(swift|m|mm)$/, // Swift/Objective-C
                    /\\.(cs|fs|vb)$/, // .NET
                    /\\.(scala|sc)$/, // Scala
                    /\\.(clj|cljs|cljc)$/, // Clojure
                    /\\.(elm|ex|exs|erl|hrl)$/, // Elm, Elixir, Erlang
                    /\\.(lua|vim|r|R|jl)$/, // Lua, Vim, R, Julia

                    // Data/Config formats
                    /\\.(yaml|yml|toml|ini|cfg)$/,
                    /\\.(sql|graphql|proto|prisma)$/,
                    /\\.md$/i, // Markdown files
                    /\\.xml$/, // Android layouts, Maven pom, Spring config, etc.
                ];

                const matches = importantPatterns.some((pattern) => pattern.test(path));
                if (!matches && depth <= 2) {
                    // Log files in root/first level that don't match (for debugging)
                    console.log(\`⚠️ Skipped (no pattern match): \${path}\`);
`,
                startLine: 179,
                endLine: 266,
                rrfScore: 0.015151515151515152,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/gemini.ts",
                chunkIndex: 2,
                content: `- Limit findings to the most impactful ones (max 5 per category). Prioritize actionable items.
- Every finding must be grounded in actual code you read — do not fabricate issues.\`;
}

/**
 * Gemini API로 전체 코드베이스 심층 분석
 *
 * 핵심 변경:
 * - 파일별 마크다운 포맷 대신 [File: path] 텍스트 블록 사용
 * - 소스코드 중심 분석 (README 참고 수준)
 * - 1M 토큰 컨텍스트 활용한 대규모 분석
 */
interface AnalysisOutput {
    summary: string;
    techStack: string[];
    architecture: string;
    keyFeatures: string[];
    codeQuality?: {
        score: number;
        strengths: string[];
        improvements: string[];
    };
    dataFlow?: string;
    entryPoints?: string[];
    healthAudit?: {
        security: {
            score: number;
            findings: Array<{
                severity: "critical" | "high" | "medium" | "low";
                title: string;
                description: string;
                file?: string;
                recommendation: string;
            }>;
        };
        maintainability: {
            index: number;
            findings: Array<{
                type: "god_class" | "circular_dependency" | "complex_logic" | "other";
                severity: "critical" | "high" | "medium" | "low";
                title: string;
                description: string;
                file?: string;
                recommendation: string;
            }>;
        };
        architecture: {
            rating: number;
            pattern: string;
            findings: Array<{
                severity: "critical" | "high" | "medium" | "low";
                title: string;
                description: string;
                recommendation: string;
            }>;
        };
    };
}

interface UsageMetadata {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
}

export async function analyzeCodebase(
    repoInfo: GitHubRepo,
    fileStructure: FileNode[],
    codebaseTextBlock: string
): Promise<{ analysis: AnalysisOutput; usageMetadata: UsageMetadata | undefined }> {
    try {
        if (!codebaseTextBlock.trim()) {
            console.warn("⚠️ No file contents available for analysis");
            return {
                analysis: {
                    summary: \`\${repoInfo.fullName}: \${repoInfo.description || "A GitHub repository"}\`,
                    techStack: repoInfo.language ? [repoInfo.language] : ["Unknown"],
                    architecture: "Insufficient data — repository appears to contain only non-code files",
                    keyFeatures: [
                        "Unable to analyze — no source code files found",
                        "This may be a documentation-only or binary-only repository",
                    ],
                },
                usageMetadata: undefined,
            };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = createAnalysisPrompt(repoInfo, fileStructure, codebaseTextBlock);

        console.log("🤖 Starting Gemini deep analysis...");
`,
                startLine: 129,
                endLine: 219,
                rrfScore: 0.014705882352941176,
                matchedBy: "vector",
            }
        ],
    },
];
