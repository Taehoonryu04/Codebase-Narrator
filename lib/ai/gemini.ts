import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GitHubRepo, FileNode } from "../types";

/**
 * Gemini AI Client Initialization
 *
 * Concept:
 * - Google Generative AI SDK
 * - gemini-1.5-flash: Fast and efficient model for code analysis
 * - API Key from environment variables
 *
 * Model Selection Guide (as of 2026):
 * - gemini-2.0-flash: Fast and stable model for code analysis (Currently used)
 * - gemini-2.5-flash: Newer model with extended context (1M tokens)
 * - gemini-2.5-pro: Most capable but slower
 * - Note: gemini-1.5-* models have been deprecated
 */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Create analysis prompt for codebase
 *
 * Prompt Engineering Strategy:
 * 1. Clear role definition (You are a senior architect)
 * 2. Structured output request (JSON format)
 * 3. Specific analysis items
 */
function createAnalysisPrompt(
    repoInfo: GitHubRepo,
    fileStructure: FileNode[],
    fileContents: Array<{ path: string; content: string | null }>
): string {
    // Format file list for readability
    const fileList = fileStructure.map((file) => `- ${file.path}`).join("\n");

    // Include main file contents (first 500 lines to avoid being too long)
    const relevantContents = fileContents
        .filter((f) => f.content !== null)
        .map((f) => {
            const lines = f.content!.split("\n").slice(0, 500).join("\n");
            return `\n### ${f.path}\n\`\`\`\n${lines}\n\`\`\``;
        })
        .join("\n");

    return `You are a world-class senior software architect and code analyst.
Analyze the GitHub repository below and provide clear, insightful explanations.

## Repository Information
- Name: ${repoInfo.fullName}
- Description: ${repoInfo.description || "No description"}
- Main Language: ${repoInfo.language || "Unknown"}
- Stars: ${repoInfo.stars}
- Topics: ${repoInfo.topics.join(", ") || "None"}

## File Structure
${fileList}

## Key File Contents
${relevantContents}

---

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown code blocks, explanations, or other text.
Your response must start with { and end with }.

Provide the analysis in the following JSON format:

{
  "summary": "A clear 2-3 sentence description of what this project does",
  "techStack": ["List of technologies used (e.g., React, Next.js, TypeScript, Tailwind CSS)"],
  "architecture": "Description of the architectural pattern and structure (e.g., MVC, Clean Architecture, Monorepo, etc.)",
  "keyFeatures": [
    "Key feature 1 (be specific)",
    "Key feature 2",
    "Key feature 3"
  ],
  "codeQuality": {
    "score": 85,
    "strengths": ["Strength 1", "Strength 2"],
    "improvements": ["Improvement area 1", "Improvement area 2"]
  },
  "dataFlow": "Description of how data flows through the system (e.g., API → Service → DB)",
  "entryPoints": ["main.ts", "app/page.tsx", "etc. - list of entry point files"]
}

Remember: Output ONLY the JSON object, nothing else.`;
}

/**
 * Gemini API로 코드베이스 분석하기
 *
 * API 호출 흐름:
 * 1. 프롬프트 생성
 * 2. Gemini API 호출
 * 3. 응답 파싱 (JSON 추출)
 * 4. 에러 핸들링
 */
export async function analyzeCodebase(
    repoInfo: GitHubRepo,
    fileStructure: FileNode[],
    fileContents: Array<{ path: string; content: string | null }>
): Promise<{
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
}> {
    try {
        // Check if we have enough content to analyze
        const filesWithContent = fileContents.filter((f) => f.content !== null);

        if (filesWithContent.length === 0) {
            console.warn("⚠️ No file contents available for analysis");
            return {
                summary: `${repoInfo.fullName}: ${repoInfo.description || "A GitHub repository"}`,
                techStack: repoInfo.language ? [repoInfo.language] : ["Unknown"],
                architecture: "Insufficient data - repository appears to contain only documentation files",
                keyFeatures: [
                    "Unable to analyze - no source code files found",
                    "This may be a documentation-only repository",
                ],
            };
        }
        // 1. Model selection (using gemini-2.5-flash)
        // gemini-2.5-flash: Newest, fast, supports up to 1M tokens
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 2. Generate prompt
        const prompt = createAnalysisPrompt(repoInfo, fileStructure, fileContents);

        // 3. Call API
        console.log("🤖 Starting Gemini API call...");
        console.log(`📊 Analyzing ${fileContents.filter(f => f.content !== null).length} files with content`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Gemini API response received");
        console.log(`📝 Response preview: ${text.substring(0, 200)}...`);

        // 4. Extract JSON (remove markdown code blocks if present)
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("❌ JSON parsing failed, raw response:", text);
            throw new Error("Could not find JSON in AI response");
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        const analysis = JSON.parse(jsonText);

        return analysis;
    } catch (error) {
        console.error("❌ Gemini API error:", error);

        // Log detailed error information
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        // Return default analysis result on error
        return {
            summary: `${repoInfo.fullName} project. ${repoInfo.description || "Unable to perform detailed analysis."}`,
            techStack: repoInfo.language ? [repoInfo.language] : ["Unknown"],
            architecture: "Analysis failed",
            keyFeatures: ["Unable to complete analysis. Please try again."],
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
