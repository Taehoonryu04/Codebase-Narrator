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
        answer: `The hybrid search pipeline combines vector similarity and keyword (Full-Text Search, FTS) to retrieve relevant code chunks. It's implemented primarily in \`lib/ai/rag.ts\` and operates as follows:

\`\`\`mermaid
flowchart LR
    Q[User Query] --> EMB["embedText via gemini-embedding-001"]
    Q --> FTS["websearch_to_tsquery PostgreSQL"]
    EMB --> VS["match_code_chunks RPC pgvector HNSW cosine"]
    FTS --> KS["keyword_search_code_chunks RPC content_tsv GIN"]
    VS --> RRF["RRF Fusion k=60 topK x2 candidates"]
    KS --> RRF
    RRF --> DEDUP["Deduplicate by filePath + chunkIndex"]
    DEDUP --> TOP["Top-K SourceChunk with rrfScore + matchedBy"]
    TOP --> CTX["buildRagContext: format with file + line range"]
    CTX --> GEN["Gemini generateContentStream with history"]
\`\`\`

**Parallel Fetch** (\`searchSimilarChunks\` in \`lib/ai/rag.ts\`):

The \`searchSimilarChunks\` function initiates two operations concurrently using \`Promise.all\`:
- \`embedText(query)\`: The user's query is embedded into a 768-dimensional vector using the \`gemini-embedding-001\` model.
- \`supabase.rpc("keyword_search_code_chunks", { ... })\`: A PostgreSQL Full-Text Search (FTS) is performed using \`websearch_to_tsquery\` on a \`content_tsv\` GIN index. This returns a raw list of keyword-matched chunks.

Once the embedding is ready, a vector similarity search is performed via \`supabase.rpc("match_code_chunks", { query_embedding: ..., ... })\`. This relies on pgvector with HNSW for cosine similarity matching.

Both vector and keyword searches retrieve \`topK * 2\` (e.g., 16) candidate chunks to provide a wider set for fusion.

**RRF Fusion** (\`reciprocalRankFusion\` in \`lib/ai/rag.ts\`):

The \`reciprocalRankFusion\` function combines the ranked lists from both vector and keyword searches.
It calculates a score for each unique chunk using the formula: \`score(chunk) = Σ 1 / (k + rank + 1)\`, where k is a constant (defaulting to 60) that dampens the effect of very high ranks.
Deduplication occurs by creating a unique key for each chunk: \`\${chunk.filePath}::\${chunk.chunkIndex}\`. If a chunk appears in both lists, its scores are summed.

**matchedBy Tagging:**

During RRF, each \`SourceChunk\` is tagged with a \`matchedBy\` field, indicating whether it was found by \`"vector"\`, \`"keyword"\`, or \`"both"\`.
This metadata is later used in the UI to display color-coded badges (violet=both, blue=vector, amber=keyword) in the source viewer modal.

**Graceful Degradation:**

If the keyword search fails (e.g., due to a \`websearch_to_tsquery\` parse error on special characters), the system logs a warning and proceeds with only the vector search results.
However, a failure in the vector search component will cause the function to throw an error, as it's considered the primary search signal.

**Final Output:**

The \`reciprocalRankFusion\` function returns a \`topK\` (defaulting to 8) array of \`SourceChunk[]\`, sorted by their RRF score.
These chunks are then formatted by \`buildRagContext\` into a structured string with the format \`[File: path, Lines: N-M]\` followed by the content block, for inclusion in the prompt sent to the Gemini large language model.`,
        sources: [
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 2,
                content: `            .update({
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
 */
export async function searchSimilarChunks(
    userId: string,
`,
                startLine: 173,
                endLine: 269,
                rrfScore: 0.01639344262295082,
                matchedBy: "vector",
            },
            {
                filePath: "lib/ai/rag.ts",
                chunkIndex: 3,
                content: `            matchedBy: v.matchedBy,
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
        .map((c) => \`[File: \${c.filePath}, Lines: \${c.startLine}-\${c.endLine}]\n\${c.content}\`)
        .join("\n\n---\n\n");
}
`,
                startLine: 259,
                endLine: 328,
                rrfScore: 0.015873015873015872,
                matchedBy: "vector",
            },
        ],
    },
    {
        id: "atomic-swap",
        question: "Walk me through the full system data flow — from GitHub URL submission to AI chat responses",
        answer: `\`\`\`mermaid
flowchart TD
    subgraph Client
        UI_ANALYZE["app/analyze/page.tsx\\\\n(RepoInputForm.tsx)"]
        UI_CHAT["app/chat/page.tsx\\\\n(User message + history)"]
        UI_ANALYZE_RES["AnalysisResult.tsx"]
    end

    subgraph Server (Next.js API Routes)
        API_ANALYZE["POST /api/analyze\\\\nroute.ts"]
        API_CHAT["POST /api/chat\\\\nroute.ts"]
    end

    subgraph Core Services & DBs
        AUTH{Auth Check\\\\ngetSession() from Supabase}
        RL{Rate Limit Check\\\\ncheckAndIncrementChat()\\\\n(Prisma)}
        VALIDATION["Zod Schema Validation\\\\n(chatRequestSchema)"]
        GITHUB["GitHub API\\\\n(lib/github.ts)"]
        GEMINI_ANALYSIS["Gemini AI\\\\n(lib/ai/gemini.ts)"]
        GEMINI_CHAT["Gemini generateContentStream"]
        DB_PRISMA["Prisma (PostgreSQL)\\\\n(Analysis History, Rate Limits)"]
        DB_SUPABASE["Supabase (Vector DB, Auth)\\\\n(code_embeddings)"]
    end

    subgraph Chat Client-Side (app/chat/page.tsx)
        SSE_STREAM["SSE text/event-stream"]
        BUF_REF["bufferRef.current += text\\\\n(no re-render)"]
        TYPEWRITER_INTERVAL["setInterval(16ms)"]
        DISP_STATE["setStreamingMessage state\\\\n(renders typed text + cursor)"]
        DONE_CHECK{streamDoneRef? + buffer empty?}
        FIN_MSG["setMessages append\\\\n(role:model, content, sources, stats)"]
        SRC_CHIPS["Source chips render\\\\n(deduped, colored)"]
    end

    %% Analyze Pipeline
    UI_ANALYZE -- Submit GitHub URL --> API_ANALYZE
    API_ANALYZE --> AUTH
    AUTH -- 401 --> ERR1["NextResponse.json 401"]
    AUTH --> RL
    RL -- 429 --> ERR2["NextResponse.json 429"]
    RL --> VALIDATION["lib/validation.ts\\\\nparseGitHubUrl"]
    VALIDATION --> GITHUB["getRepoInfo, getRepoFileTree,\\\\ngetMultipleFileContents"]
    GITHUB --> BUILD_BLOCK["buildCodebaseTextBlock()"]
    BUILD_BLOCK --> GEMINI_ANALYSIS["analyzeCodebase()\\\\n(createAnalysisPrompt)"]
    GEMINI_ANALYSIS --> LOG_USAGE["logUsage()"]
    GEMINI_ANALYSIS --> DB_PRISMA["Save analysis result"]
    GEMINI_ANALYSIS --> STORE_EMBED["storeEmbeddings()\\\\n(lib/ai/rag.ts)"]
    STORE_EMBED --> DB_SUPABASE["INSERT new code_embeddings\\\\n(Atomic Swap Strategy)"]
    API_ANALYZE -- Structured Analysis --> UI_ANALYZE_RES
    UI_ANALYZE_RES -- Renders Analysis --> UI_ANALYZE

    %% Chat Pipeline
    UI_CHAT -- POST {message, repoFullName, history} --> API_CHAT
    API_CHAT --> AUTH
    AUTH -- 401 --> ERR1
    API_CHAT --> VALIDATION
    VALIDATION --> RL
    RL -- 429 --> ERR2
    RL --> SEARCH["searchSimilarChunks()\\\\n(lib/ai/rag.ts)"]
    SEARCH --> DB_SUPABASE["Query code_embeddings\\\\n(Vector + Keyword Hybrid Search)"]
    SEARCH -- Retrieved chunks --> BUILD_CTX["buildRagContext()"]
    BUILD_CTX --> GEMINI_CHAT["generateContentStream()\\\\n(with RAG context)"]
    GEMINI_CHAT --> SSE_STREAM["text/event-stream"]

    %% Client-side Chat Streaming & Rendering
    SSE_STREAM -- {type:chunk, text} --> BUF_REF
    SSE_STREAM -- {type:done, sources, stats} --> DONE_CHECK
    BUF_REF --> TYPEWRITER_INTERVAL
    TYPEWRITER_INTERVAL -- Drains buffer --> DISP_STATE
    DISP_STATE -- Updates UI --> UI_CHAT
    TYPEWRITER_INTERVAL -- Checks buffer & stream done --> DONE_CHECK
    DONE_CHECK -- Yes, buffer empty --> FIN_MSG
    FIN_MSG -- Append {role:model, content, sources, stats} --> UI_CHAT
    FIN_MSG --> SRC_CHIPS
    SRC_CHIPS --> UI_CHAT

    %% Connections
    STORE_EMBED --- DB_SUPABASE
    DB_SUPABASE --- SEARCH
\`\`\`

**Explanation:**

1.  **Analyze Pipeline (Left Side)**:
    *   A user submits a GitHub URL on the \`app/analyze/page.tsx\` UI.
    *   This triggers a \`POST\` request to \`app/api/analyze/route.ts\`.
    *   The API route performs authentication (\`getSession\` from Supabase) and rate limiting (\`checkAndIncrementChat\` with Prisma) and validates the input using \`lib/validation.ts\`.
    *   It then interacts with the GitHub API (\`lib/github.ts\`) to fetch repository information and file contents.
    *   The gathered code is formatted (\`buildCodebaseTextBlock\`) and sent to Google Gemini for deep analysis (\`analyzeCodebase\` in \`lib/ai/gemini.ts\`).
    *   Upon receiving Gemini's analysis, usage is logged (\`logUsage\`), the analysis result is saved to Prisma, and crucially, \`storeEmbeddings\` (\`lib/ai/rag.ts\`) is called.
    *   \`storeEmbeddings\` then writes the extracted code chunks and their vector embeddings into the \`code_embeddings\` table within **Supabase** (following an atomic swap strategy to ensure zero downtime).
    *   Finally, the structured analysis is returned and rendered by \`AnalysisResult.tsx\` on the client.

2.  **Chat Pipeline (Right Side)**:
    *   A user types a message in \`app/chat/page.tsx\`.
    *   This triggers a \`POST\` request to \`app/api/chat/route.ts\`.
    *   Similar to analyze, this route performs authentication and rate limiting.
    *   It then calls \`searchSimilarChunks\` (\`lib/ai/rag.ts\`), which is the core RAG component. This function queries the **Supabase** \`code_embeddings\` table (the same one populated by the analyze pipeline) using a hybrid vector + keyword search.
    *   The retrieved relevant code chunks are formatted into RAG context (\`buildRagContext\`).
    *   This context, along with the chat history, is sent to \`Gemini.generateContentStream\` for a streaming AI response.
    *   The API streams text deltas back to the client as Server-Sent Events (SSE).

3.  **Client-Side Chat Streaming & Rendering**:
    *   On \`app/chat/page.tsx\`, an SSE reader appends incoming text chunks to \`bufferRef.current\` (a plain string ref, preventing re-renders for every chunk).
    *   A \`setInterval(16ms)\` runs a typewriter effect, draining characters from \`bufferRef.current\` and updating the \`streamingMessage\` state, which causes re-renders to display the typed text with a cursor.
    *   When the SSE stream signals completion (\`"type":"done"\`), and the buffer is empty, the message is finalized (\`setMessages\`) and source chips (deduplicated and colored by \`matchedBy\` status) are rendered.

**Connection Point:**

The crucial link between the two pipelines is the **Supabase \`code_embeddings\`** database. The \`storeEmbeddings\` function in the analyze pipeline populates this vector store, making the codebase searchable. The \`searchSimilarChunks\` function in the chat pipeline then queries this very same vector store to retrieve relevant context for AI responses. This separation ensures that the analysis can be performed once and then extensively chatted about without re-analyzing the code on every chat query.`,
        sources: [
        ],
    },
    {
        id: "rag-chat-flow",
        question: "Walk me through the full RAG chat data flow",
        answer: `The RAG (Retrieval Augmented Generation) chat data flow orchestrates the entire process from a user initiating a chat to receiving a streaming, context-aware response rendered with a typewriter effect and clickable source chips.

\`\`\`mermaid
flowchart TD
    UI["User message\\\\n(input + conversation history)"] --> POST["POST /api/chat\\\\n{ message, repoFullName, history }"]
    POST --> AUTH{Supabase session?}
    AUTH -- 401 --> ERR1["NextResponse.json 401"]
    AUTH -- ok --> ZOD["Zod chatRequestSchema.safeParse()"]
    ZOD --> RL["checkAndIncrementChat()\\\\nPrisma RateLimit table"]
    RL -- 429 --> ERR2["NextResponse.json 429 + Retry-After"]
    RL -- ok --> SEARCH["searchSimilarChunks()\\\\nhybrid vector+keyword, top-8"]
    SEARCH -- empty --> ERR3["JSON: run analysis first"]
    SEARCH -- chunks --> CTX["buildRagContext\\\\nFile path Lines N-M format"]
    CTX --> GEN["Gemini generateContentStream\\\\nsystem prompt + history + RAG context"]
    GEN --> SSE["text/event-stream SSE\\\\nchunk events then done event"]
    SSE --> BUF["bufferRef.current += text\\\\nno re-render on arrival"]
    BUF --> TW["setInterval 16ms\\\\ndynamic drain 1/3/6 chars"]
    TW --> DISP["setStreamingMessage state\\\\nre-render: shows typed text + cursor"]
    TW --> DONE{streamDoneRef?}
    DONE -- no --> TW
    DONE -- "yes + buffer empty" --> FIN["setMessages append\\\\nrole model content sources stats\\\\nsetSending false"]
    FIN --> CHIPS["Source chips render\\\\ndeduped by filePath, colored by matchedBy"]
\`\`\`

### Server: \`POST /api/chat\` (\`app/api/chat/route.ts\`)

This is the main entry point for chat requests, handling retrieval, context building, and initiating the AI stream.

1.  **Authentication (Lines 30-36)**:
    *   \`getSession()\` from Supabase is used to retrieve the current user's session.
    *   If no \`session?.user?.id\` is found, a \`401 Unauthorized\` response is returned, as embeddings are user-scoped.

2.  **Validation (Lines 39-47)**:
    *   The request body is parsed and validated against \`chatRequestSchema\` using \`zod.safeParse()\`.
    *   This ensures the \`message\` (non-empty string) and \`repoFullName\` are present. Invalid requests receive a \`400 Bad Request\`.

3.  **Rate Limiting (Lines 50-68)**:
    *   \`checkAndIncrementChat(userId)\` from \`lib/rate-limit.ts\` checks the user's chat quota.
    *   If the limit (currently 50/day in production, 9999 for dev) is exceeded, a \`429 Too Many Requests\` response is returned, along with a \`Retry-After\` header.

4.  **RAG Retrieval (Hybrid Search) (Lines 75-80)**:
    *   \`searchSimilarChunks(userId, repoFullName, message, 8)\` is called. This function, located in \`lib/ai/rag.ts\`, performs a hybrid search combining vector similarity and keyword search (as detailed in the "Hybrid Search Pipeline" explanation) to retrieve the top-8 most relevant \`SourceChunk[]\` from the codebase embeddings.
    *   If \`chunks.length\` is 0, it means no relevant embeddings were found, indicating that an analysis might not have been run, and a message instructing the user to "run an analysis first" is returned.

5.  **Context Building (Lines 80-84)**:
    *   \`buildRagContext(chunks)\` takes the retrieved \`SourceChunk[]\` and formats them into a string. Each chunk is represented as \`[File: path, Lines: N-M]\\ncontent\`, separated by \`\\n\\n---\\n\\n\`. This structured text forms the "Relevant Code Context" for the LLM.

6.  **Build Prompt and Call Gemini (Lines 87-123)**:
    *   A \`systemPrompt\` is constructed, including the \`repoFullName\` and the \`ragContext\`. This prompt instructs Gemini to act as an expert software engineer, referencing file names, functions, and lines from the context, and to include Mermaid diagrams for complex logic/flows.
    *   The \`gemini-2.5-flash\` model is initialized.
    *   The \`contents\` array for the LLM call is built, starting with the system prompt (as the first user turn), followed by a model acknowledgment, the chat \`history\`, and finally the current \`message\`.
    *   \`model.generateContentStream({ contents })\` is called to initiate the streaming AI response.

7.  **Streaming Response (Lines 125-176)**:
    *   The \`result.stream\` from Gemini is wrapped in a \`ReadableStream\`.
    *   For each \`chunk\` received from Gemini, its \`text()\` content is encoded and \`enqueued\` as a \`data: { type: "chunk", text: "..." }\\n\\n\` SSE event.
    *   Once the stream completes, the final response \`usageMetadata\` (input/output/total tokens, estimated cost, execution time) and the \`sources\` (the original \`chunks\` used for RAG) are collected.
    *   A final \`data: { type: "done", sources: [...], stats: {...} }\\n\\n\` SSE event is enqueued.
    *   Usage statistics are logged asynchronously via \`logUsage()\`.

### Client: Typewriter Buffer (\`app/chat/page.tsx:startTypewriter\`)

This part handles the reception and rendering of the streaming AI response on the client-side.

1.  **SSE Reader (\`res.body.getReader()\`)**:
    *   On the client, the \`res.body.getReader()\` reads the incoming SSE events.
    *   When a \`{"type":"chunk","text":"..."}\` event arrives, its \`text\` content is appended to \`bufferRef.current\`. This is a plain string \`ref\` and **does not trigger a re-render** on arrival, optimizing performance for hundreds of small chunks.

2.  **Typewriter Interval (Lines 77-116 in \`app/chat/page.tsx\`)**:
    *   A \`setInterval(16ms)\` is set up to regularly drain characters from \`bufferRef.current\`.
    *   This interval implements **adaptive draining**:
        *   **Normal**: 1 character per tick (approx. 60 chars/sec visible)
        *   **Catching up** (\`bufferRef.current.length > 80\`): 3 characters per tick
        *   **Flood** (\`bufferRef.current.length > 200\`): 6 characters per tick
    *   The drained characters are appended to \`displayedRef.current\` and then used to update the \`streamingMessage\` state (\`setStreamingMessage\`). This state update is what causes the UI to re-render, displaying the typed text and the cursor.

3.  **Stream Completion and Finalization**:
    *   When the SSE reader receives the \`{"type":"done","sources":[...],"stats":{...}}\` event, it sets \`streamDoneRef.current = true\` and stores the \`sources\` and \`stats\`.
    *   On a subsequent tick of the \`setInterval\` loop, if \`bufferRef.current\` is empty AND \`streamDoneRef.current\` is true, the interval clears itself.
    *   The final message content from \`displayedRef.current\`, along with the received \`sources\` and \`stats\`, is appended to the main \`messages\` state (\`setMessages\`).
    *   The \`streamingMessage\` state is cleared, and \`setSending(false)\` indicates the chat is no longer active. The input field is refocused.

4.  **Source Chips Rendering**:
    *   After the message is finalized, the \`sources\` (retrieved chunks) are rendered as clickable chips. These chips are deduped by \`filePath\` and color-coded based on their \`matchedBy\` property (violet for "both", blue for "vector", amber for "keyword").`,
        sources: [
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
                rrfScore: 0.015625,
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
                rrfScore: 0.014925373134328358,
                matchedBy: "vector",
            },
            {
                filePath: "app/api/chat/route.ts",
                chunkIndex: 2,
                content: `        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build contents array: system context as first user turn, then history, then current message
        const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I have reviewed the code context and am ready to answer questions about this codebase." }] },
            ...history.map((h) => ({
                role: h.role as "user" | "model",
                parts: [{ text: h.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        const streamStart = Date.now();
        const result = await model.generateContentStream({ contents });

        console.log(\`✅ Streaming chat response started, \${uniqueFiles.length} sources\`);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(
                                encoder.encode(\`data: \${JSON.stringify({ type: "chunk", text })}\\n\\n\`)
                            );
                        }
                    }

                    // Capture token usage after stream completes
                    const response = await result.response;
                    const usageMetadata = response.usageMetadata;
                    const inputTokens = usageMetadata?.promptTokenCount ?? 0;
                    const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;
                    const totalTokens = usageMetadata?.totalTokenCount ?? 0;
                    const estimatedCostUsd = estimateCost(inputTokens, outputTokens);
                    const executionTimeMs = Date.now() - streamStart + ragRetrievalMs;

                    const stats: ChatStats = {
                        ragRetrievalMs,
                        inputTokens,
                        outputTokens,
                        totalTokens,
                        estimatedCostUsd,
                    };

                    controller.enqueue(
                        encoder.encode(\`data: \${JSON.stringify({ type: "done", sources: chunks, stats })}\\n\\n\`)
                    );

                    // Log usage fire-and-forget
                    logUsage({
                        userId,
                        eventType: "chat",
                        repoFullName,
                        executionTimeMs,
                        ragRetrievalMs,
                        inputTokens,
                        outputTokens,
                        totalTokens,
                        estimatedCostUsd,
                    });
                } catch (err) {
                    console.error("❌ Stream error:", err);
                    controller.enqueue(
`,
                startLine: 110,
                endLine: 176,
                rrfScore: 0.014705882352941176,
                matchedBy: "vector",
            }
        ],
    },
    {
        id: "adaptive-scorer",
        question: "How does the adaptive file scorer decide which files to send to Gemini?",
        answer: `The adaptive file scorer, implemented in the \`scoreFile\` function within \`lib/github.ts\`, assigns a numeric priority to every file in the Git tree. The core principle is: **Lower score = higher priority**. After all files are scored, the list is sorted in ascending order (lowest score first) and then sliced to a maximum number of files (\`maxFiles\`, default 50). This ensures that only the most relevant and architecturally important files are sent to Gemini.

Here's how \`scoreFile\` makes its decision:

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
