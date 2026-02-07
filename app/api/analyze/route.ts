import { NextRequest, NextResponse } from "next/server";
import {
    parseGitHubUrl,
    getRepoInfo,
    getRepoFileTree,
    getMultipleFileContents,
} from "@/lib/github";
import { analyzeCodebase } from "@/lib/ai/gemini";
import { analyzeRequestSchema, formatZodError } from "@/lib/validation";
import type { AnalysisResult } from "@/lib/types";

/**
 * POST /api/analyze
 *
 * GitHub Repository Analysis API Endpoint
 *
 * Full flow:
 * 1. Input validation (Zod)
 * 2. GitHub URL parsing
 * 3. Fetch repository information via GitHub API
 * 4. Fetch file tree structure
 * 5. Fetch content of key files
 * 6. Analyze codebase with Gemini AI
 * 7. Return results
 *
 * Next.js App Router Route Handler docs:
 * https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export async function POST(request: NextRequest) {
    try {
        // Step 1: Parse request body
        const body = await request.json();
        console.log("📥 Analysis request received:", body);

        // Step 2: Input validation (using Zod)
        const validationResult = analyzeRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: formatZodError(validationResult.error),
                },
                { status: 400 }
            );
        }

        const { repoUrl, maxFiles } = validationResult.data;

        // Step 3: Parse GitHub URL
        const parsed = parseGitHubUrl(repoUrl);

        if (!parsed) {
            return NextResponse.json(
                {
                    error: "Invalid GitHub URL. Format: https://github.com/owner/repo",
                },
                { status: 400 }
            );
        }

        const { owner, repo } = parsed;
        console.log(`🔍 Starting analysis: ${owner}/${repo}`);

        // Step 4: Fetch repository information via GitHub API
        console.log("📊 Fetching repository information...");
        const repoInfo = await getRepoInfo(owner, repo);
        console.log(`✅ Repository info: ${repoInfo.fullName}`);

        // Step 5: Fetch file tree structure
        console.log("🌳 Fetching file tree...");
        const fileStructure = await getRepoFileTree(owner, repo, 5);
        console.log(`✅ Found ${fileStructure.length} important files`);

        // Warn if very few files found
        if (fileStructure.length < 3) {
            console.warn(
                `⚠️ Only ${fileStructure.length} files found. This may indicate:
- Repository contains mostly documentation
- File filtering patterns don't match repository structure
- Repository is very small/minimal`
            );
        }

        // Step 6: Fetch content of key files (up to maxFiles)
        console.log("📄 Fetching file contents...");
        const filesToAnalyze = fileStructure.slice(0, maxFiles).map((f) => f.path);
        const fileContents = await getMultipleFileContents(owner, repo, filesToAnalyze);
        console.log(`✅ Loaded ${fileContents.filter((f) => f.content !== null).length} file contents`);

        // Step 7: Analyze codebase with Gemini AI
        console.log("🤖 Starting AI analysis...");
        const analysis = await analyzeCodebase(repoInfo, fileStructure, fileContents);
        console.log("✅ AI analysis complete");

        // Step 8: Combine and return results
        const result: AnalysisResult = {
            repoInfo,
            fileStructure,
            analysis,
            timestamp: new Date().toISOString(),
        };

        console.log("🎉 Analysis complete!");

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("❌ Error during analysis:", error);

        // Handle errors by type
        if (error instanceof Error) {
            // GitHub API error (e.g., repository not found)
            if (error.message.includes("Not Found")) {
                return NextResponse.json(
                    {
                        error: "Repository not found. Please ensure it's a public repository.",
                    },
                    { status: 404 }
                );
            }

            // Rate limit error
            if (error.message.includes("rate limit")) {
                return NextResponse.json(
                    {
                        error: "GitHub API rate limit reached. Please try again later.",
                    },
                    { status: 429 }
                );
            }

            // Gemini API error
            if (error.message.includes("API key")) {
                return NextResponse.json(
                    {
                        error: "AI API configuration error. Please contact administrator.",
                    },
                    { status: 500 }
                );
            }
        }

        // Other errors
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
