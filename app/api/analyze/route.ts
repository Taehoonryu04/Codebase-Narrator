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
        // If ADMIN_EMAIL is unset, all requests are blocked (no accidental open access).
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail || userEmail !== adminEmail) {
            console.log(`🔒 Admin guard: blocked analysis request from ${userEmail ?? "anonymous"}`);
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
                console.log(`🚫 Anon rate limit exceeded for IP ${ip}`);
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
        const fileStructure = await getRepoFileTree(owner, repo, 10, userOctokit);
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
            analysis,
            analyzedFiles: loadedCount,
            totalFiles: fileStructure.length,
            timestamp: new Date().toISOString(),
            stats,
        };

        console.log(`🎉 Analysis complete! ${loadedCount}/${fileStructure.length} files, ${totalTokens} tokens, $${estimatedCostUsd.toFixed(6)}, ${executionTimeMs}ms`);

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
            { error: "An error occurred during analysis. Please try again." },
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
