import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GitHubRepo, FileNode } from "../types";

/**
 * Gemini AI Client Initialization
 *
 * Model Selection Guide (as of 2026):
 * - gemini-2.5-flash: Fast model with 1M token context — ideal for full codebase analysis
 * - gemini-2.5-pro: Most capable but slower, use for premium analysis
 * - Note: gemini-1.5-* and gemini-2.0-* models have been deprecated
 */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * 전체 코드베이스 분석을 위한 프롬프트 생성
 *
 * Prompt Engineering Strategy:
 * 1. "세계 최고의 아키텍트" 페르소나 설정
 * 2. README는 참고만, 실제 소스코드 전체 분석 지시
 * 3. [File: path] 형식의 텍스트 블록을 직접 읽도록 구성
 * 4. JSON-only output 강제
 */
function createAnalysisPrompt(
    repoInfo: GitHubRepo,
    fileStructure: FileNode[],
    codebaseTextBlock: string
): string {
    const fileList = fileStructure.map((file) => `- ${file.path}`).join("\n");

    return `You are the world's greatest software architect. You have been given the ENTIRE source code of a real project. Your task is to analyze the actual code — not just the README or metadata — and reveal this project's TRUE IDENTITY.

README and description are REFERENCE ONLY. Your analysis must be grounded in the actual source code provided below.

## Repository Metadata (reference only)
- Name: ${repoInfo.fullName}
- Description: ${repoInfo.description || "No description provided"}
- Primary Language: ${repoInfo.language || "Unknown"}
- Stars: ${repoInfo.stars}
- Topics: ${repoInfo.topics.join(", ") || "None"}

## Complete File Tree (${fileStructure.length} files detected)
${fileList}

## Full Source Code
Below is the entire codebase packaged in [File: path] format. Analyze every file thoroughly.

${codebaseTextBlock}

---

Based on your deep reading of the ACTUAL SOURCE CODE above, produce a comprehensive analysis.

CRITICAL RULES:
1. Respond ONLY with valid JSON. No markdown, no explanation, no code blocks.
2. Your response must start with { and end with }.
3. Every claim must be traceable to actual code you read — do not hallucinate features.
4. Be specific: reference actual file names, function names, and patterns you observed.

{
  "summary": "2-3 sentence description of what this project ACTUALLY does, based on source code analysis (not just the README)",
  "techStack": ["Every technology, framework, and library actually used — inferred from imports, package.json, config files"],
  "architecture": "Detailed description of the architectural pattern. Reference specific directories and files. (e.g., 'Next.js App Router with lib/ for business logic separation, API routes in app/api/, shared types in lib/types/')",
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
  "entryPoints": ["List actual entry point files found in the codebase"]
}`;
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
                    summary: `${repoInfo.fullName}: ${repoInfo.description || "A GitHub repository"}`,
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
        console.log(`📊 Prompt size: ~${Math.round(prompt.length / 1000)}K characters`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Gemini API response received");
        console.log(`📝 Response length: ${text.length} chars`);
        if (response.usageMetadata) {
            console.log(`📊 Tokens — input: ${response.usageMetadata.promptTokenCount}, output: ${response.usageMetadata.candidatesTokenCount}, total: ${response.usageMetadata.totalTokenCount}`);
        }

        // Extract JSON — handle both raw JSON and markdown-wrapped JSON
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("❌ JSON parsing failed, raw response:", text.substring(0, 500));
            throw new Error("Could not find JSON in AI response");
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        const analysis = JSON.parse(jsonText);

        return { analysis, usageMetadata: response.usageMetadata };
    } catch (error) {
        console.error("❌ Gemini API error:", error);

        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
        }

        return {
            analysis: {
                summary: `${repoInfo.fullName} project. ${repoInfo.description || "Unable to perform detailed analysis."}`,
                techStack: repoInfo.language ? [repoInfo.language] : ["Unknown"],
                architecture: "Analysis failed — please try again",
                keyFeatures: ["Unable to complete analysis. Please try again."],
            },
            usageMetadata: undefined,
        };
    }
}

/**
 * Generate quick summary (fast version)
 *
 * Use cases:
 * - Viewing multiple projects at a glance in dashboard
 * - Showing quick preview before full analysis
 */
export async function generateQuickSummary(repoInfo: GitHubRepo): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Briefly describe this GitHub repository in one sentence:

Name: ${repoInfo.fullName}
Description: ${repoInfo.description || "No description"}
Main Language: ${repoInfo.language || "Unknown"}

Provide a concise 1-2 sentence summary focusing on the core purpose.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text().trim();
    } catch (error) {
        console.error("Quick summary generation failed:", error);
        return repoInfo.description || `${repoInfo.fullName} project`;
    }
}
