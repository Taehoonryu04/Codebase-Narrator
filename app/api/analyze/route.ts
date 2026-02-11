import { NextRequest, NextResponse } from "next/server";
import {
    parseGitHubUrl,
    getRepoInfo,
    getRepoFileTree,
    getMultipleFileContents,
    buildCodebaseTextBlock,
} from "@/lib/github";
import { analyzeCodebase } from "@/lib/ai/gemini";
import { analyzeRequestSchema, formatZodError } from "@/lib/validation";
import type { AnalysisResult } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { Octokit } from "@octokit/rest";
import { checkAndIncrementAnalysis, windowLabel } from "@/lib/rate-limit";

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
            } else {
                console.log("👤 Anonymous user - using default GitHub token");
            }
        } catch (error) {
            console.warn("⚠️ Failed to get user session, continuing with default token:", error);
        }

        // Step 2b: Enforce rate limit (authenticated users only)
        if (authenticatedUserId) {
            const rateLimit = await checkAndIncrementAnalysis(authenticatedUserId);
            if (!rateLimit.allowed) {
                const retryAfterSecs = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);
                console.log(`🚫 Rate limit exceeded for user ${authenticatedUserId}`);
                return NextResponse.json(
                    {
                        error: `Analysis limit reached (${rateLimit.limit}/${windowLabel()}). Resets at ${rateLimit.resetAt.toLocaleString()}.`,
                        resetAt: rateLimit.resetAt.toISOString(),
                    },
                    {
                        status: 429,
                        headers: { "Retry-After": String(retryAfterSecs) },
                    }
                );
            }
            console.log(`📊 Rate limit: ${rateLimit.current}/${rateLimit.limit} analyses today`);
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
        console.log(`🔍 Starting deep analysis: ${owner}/${repo}`);

        // Step 4: Fetch repository metadata
        console.log("📊 Fetching repository metadata...");
        const repoInfo = await getRepoInfo(owner, repo, userOctokit);
        console.log(`✅ Repository: ${repoInfo.fullName} (⭐ ${repoInfo.stars})`);

        // Step 5: Recursive file tree (single API call via Git Tree API)
        console.log("🌳 Fetching recursive file tree...");
        const fileStructure = await getRepoFileTree(owner, repo, 5, userOctokit);
        console.log(`✅ ${fileStructure.length} important files detected`);

        if (fileStructure.length < 3) {
            console.warn(
                `⚠️ Only ${fileStructure.length} files found — possible docs-only or minimal repo`
            );
        }

        // Step 6: Fetch file contents (priority-sorted, batched parallel)
        console.log(`📄 Fetching contents for up to ${maxFiles} files...`);
        const filesToAnalyze = fileStructure.slice(0, maxFiles).map((f) => f.path);
        const fileContents = await getMultipleFileContents(owner, repo, filesToAnalyze, userOctokit);
        const loadedCount = fileContents.filter((f) => f.content !== null).length;
        console.log(`✅ Loaded ${loadedCount}/${filesToAnalyze.length} file contents`);

        // Step 7: Package into single text block for AI
        console.log("📦 Packaging codebase text block...");
        const codebaseTextBlock = buildCodebaseTextBlock(fileContents);
        console.log(`✅ Text block: ~${Math.round(codebaseTextBlock.length / 1000)}K characters`);

        // Step 8: Gemini deep analysis
        console.log("🤖 Starting Gemini deep source code analysis...");
        const analysis = await analyzeCodebase(repoInfo, fileStructure, codebaseTextBlock);
        console.log("✅ Deep analysis complete");

        // Step 9: Return results
        const result: AnalysisResult = {
            repoInfo,
            fileStructure,
            analysis,
            analyzedFiles: loadedCount,
            totalFiles: fileStructure.length,
            timestamp: new Date().toISOString(),
        };

        console.log(`🎉 Analysis complete! ${loadedCount} files analyzed out of ${fileStructure.length} total`);

        // Step 10: Save to history (authenticated users only)
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
            if (error.message.includes("Not Found")) {
                return NextResponse.json(
                    {
                        error: "Repository not found or access denied. For private repositories, please sign in with GitHub."
                    },
                    { status: 404 }
                );
            }

            if (error.message.includes("rate limit")) {
                return NextResponse.json(
                    { error: "GitHub API rate limit reached. Please try again later." },
                    { status: 429 }
                );
            }

            if (error.message.includes("API key")) {
                return NextResponse.json(
                    { error: "AI API configuration error. Please contact administrator." },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            {
                error: "An error occurred during analysis. Please try again.",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/analyze?url=...
 *
 * Simple test endpoint (optional)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json(
            {
                message: "Usage: POST /api/analyze with { repoUrl: string }",
                example: {
                    repoUrl: "https://github.com/vercel/next.js",
                    maxFiles: 20,
                },
            },
            { status: 400 }
        );
    }

    // Redirect GET request to POST
    return POST(
        new NextRequest(request.url, {
            method: "POST",
            body: JSON.stringify({ repoUrl: url }),
        })
    );
}
