import { Octokit } from "@octokit/rest";
import type { GitHubRepo, FileNode } from "./types";

/**
 * GitHub API 클라이언트 초기화
 *
 * 개념 설명:
 * - Octokit: GitHub의 공식 JavaScript SDK
 * - Personal Access Token을 사용하면 rate limit이 5000/hour로 증가 (미사용 시 60/hour)
 * - Phase 1에서는 public repo만 접근하므로 token 없이도 작동 가능
 */
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

/**
 * GitHub URL에서 owner와 repo 이름 추출
 *
 * 예시:
 * - https://github.com/vercel/next.js → { owner: "vercel", repo: "next.js" }
 * - github.com/facebook/react → { owner: "facebook", repo: "react" }
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
        // URL 정규화 (https:// 없는 경우 추가)
        const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
        const urlObj = new URL(normalizedUrl);

        // github.com이 아니면 null 반환
        if (!urlObj.hostname.includes("github.com")) {
            return null;
        }

        // pathname에서 owner와 repo 추출
        // /owner/repo 또는 /owner/repo.git 형식
        const pathParts = urlObj.pathname.split("/").filter(Boolean);

        if (pathParts.length < 2) {
            return null;
        }

        const owner = pathParts[0];
        const repo = pathParts[1].replace(/\.git$/, ""); // .git 제거

        return { owner, repo };
    } catch {
        return null;
    }
}

/**
 * GitHub 리포지토리 메타데이터 가져오기
 *
 * API 엔드포인트: GET /repos/{owner}/{repo}
 * 문서: https://docs.github.com/en/rest/repos/repos#get-a-repository
 */
export async function getRepoInfo(owner: string, repo: string): Promise<GitHubRepo> {
    const { data } = await octokit.rest.repos.get({
        owner,
        repo,
    });

    return {
        owner: data.owner.login,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        url: data.html_url,
        stars: data.stargazers_count,
        language: data.language,
        topics: data.topics || [],
    };
}

/**
 * Get repository file tree
 *
 * Strategy:
 * 1. Use Git Tree API to fetch all files at once
 * 2. Recursively explore subdirectories (recursive=1)
 * 3. Filter for important files (config files, source code, etc.)
 *
 * API Endpoint: GET /repos/{owner}/{repo}/git/trees/{tree_sha}
 */
export async function getRepoFileTree(
    owner: string,
    repo: string,
    maxDepth: number = 5
): Promise<FileNode[]> {
    try {
        // 1. Get default branch info
        const { data: repoData } = await octokit.rest.repos.get({
            owner,
            repo,
        });

        const defaultBranch = repoData.default_branch;

        // 2. Get file list using Git Tree API
        const { data: treeData } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: defaultBranch,
            recursive: "1", // Recursively get all files
        });

        // 3. Filter for important files
        console.log(`📁 Total files in tree: ${treeData.tree.length}`);

        const importantFiles = treeData.tree
            .filter((item) => {
                const path = item.path || "";
                const depth = path.split("/").length;

                // Only files, not directories
                if (item.type !== "blob") return false;

                // Depth limit
                if (depth > maxDepth) return false;

                // Ignore common directories
                if (
                    path.includes("node_modules/") ||
                    path.includes(".git/") ||
                    path.includes("dist/") ||
                    path.includes("build/") ||
                    path.includes("__pycache__/") ||
                    path.includes(".next/") ||
                    path.includes("target/") ||
                    path.includes("vendor/")
                ) {
                    return false;
                }

                // Check if file should be excluded (binary, images, etc.)
                const excludePatterns = [
                    // Binary files
                    /\.(png|jpg|jpeg|gif|ico|svg|webp|avif)$/i,
                    /\.(woff|woff2|ttf|eot|otf)$/i,
                    /\.(mp4|mp3|wav|avi|mov)$/i,
                    /\.(zip|tar|gz|rar|7z)$/i,
                    /\.(pdf|doc|docx|xls|xlsx)$/i,
                    // Lock files (too large/not useful)
                    /yarn\.lock$/,
                    /package-lock\.json$/,
                    /pnpm-lock\.yaml$/,
                    /Cargo\.lock$/,
                    /Gemfile\.lock$/,
                ];

                // Skip binary/media files
                if (excludePatterns.some((pattern) => pattern.test(path))) {
                    return false;
                }

                // Important file patterns (expanded and more permissive)
                const importantPatterns = [
                    // Documentation
                    /README/i,
                    /LICENSE/i,
                    /CHANGELOG/i,
                    /CONTRIBUTING/i,

                    // Configuration files
                    /package\.json$/,
                    /tsconfig.*\.json$/,
                    /\.config\.(js|ts|mjs|cjs|json)$/,
                    /next\.config/,
                    /vite\.config/,
                    /tailwind\.config/,
                    /webpack\.config/,
                    /babel\.config/,
                    /eslint/,
                    /prettier/,
                    /\.env\.example$/,
                    /Dockerfile$/,
                    /docker-compose/,
                    /Makefile$/,
                    /\.gitignore$/,
                    /\.nvmrc$/,
                    /\.node-version$/,

                    // JavaScript/TypeScript (more permissive)
                    /\.(tsx?|jsx?|mjs|cjs)$/,
                    /\.(json|jsonc)$/,

                    // Python
                    /\.py$/,
                    /requirements.*\.txt$/,
                    /setup\.py$/,
                    /pyproject\.toml$/,
                    /poetry\.lock$/,
                    /Pipfile$/,

                    // Rust
                    /\.rs$/,
                    /Cargo\.toml$/,

                    // Go
                    /\.go$/,
                    /go\.(mod|sum)$/,

                    // Java/Kotlin
                    /\.(java|kt|kts)$/,
                    /pom\.xml$/,
                    /build\.gradle(\.kts)?$/,

                    // C/C++
                    /\.(c|cpp|cc|cxx|h|hpp|hxx)$/,
                    /CMakeLists\.txt$/,

                    // Ruby
                    /\.rb$/,
                    /Gemfile$/,

                    // PHP
                    /\.php$/,
                    /composer\.json$/,

                    // CSS/SCSS
                    /\.(css|scss|sass|less|styl)$/,

                    // HTML/Templates
                    /\.(html|htm|ejs|hbs|pug|jade)$/,

                    // Shell scripts
                    /\.(sh|bash|zsh|fish)$/,

                    // Other languages
                    /\.(swift|m|mm)$/, // Swift/Objective-C
                    /\.(cs|fs|vb)$/, // .NET
                    /\.(scala|sc)$/, // Scala
                    /\.(clj|cljs|cljc)$/, // Clojure
                    /\.(elm|ex|exs|erl|hrl)$/, // Elm, Elixir, Erlang
                    /\.(lua|vim|r|R|jl)$/, // Lua, Vim, R, Julia

                    // Data/Config formats
                    /\.(yaml|yml|toml|ini|cfg)$/,
                    /\.(sql|graphql|proto|prisma)$/,
                    /\.md$/i, // Markdown files
                ];

                const matches = importantPatterns.some((pattern) => pattern.test(path));
                if (!matches && depth <= 2) {
                    // Log files in root/first level that don't match (for debugging)
                    console.log(`⚠️ Skipped (no pattern match): ${path}`);
                }
                return matches;
            })
            .map((item) => ({
                path: item.path || "",
                type: "file" as const,
                size: item.size,
            }));

        console.log(`✅ Found ${importantFiles.length} important files`);
        console.log(`📋 Sample files: ${importantFiles.slice(0, 10).map(f => f.path).join(", ")}`);
        return importantFiles;
    } catch (error) {
        console.error("Error fetching file tree:", error);
        throw new Error("Failed to fetch repository file tree");
    }
}

/**
 * 특정 파일의 내용 가져오기
 *
 * API 엔드포인트: GET /repos/{owner}/{repo}/contents/{path}
 *
 * 주의사항:
 * - 파일 크기가 1MB 이상이면 content가 null로 반환됨
 * - base64 인코딩된 상태로 반환되므로 디코딩 필요
 */
export async function getFileContent(
    owner: string,
    repo: string,
    path: string
): Promise<string | null> {
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
        });

        // 디렉토리거나 파일이 아니면 null 반환
        if (Array.isArray(data) || data.type !== "file") {
            return null;
        }

        // content가 없으면 null 반환
        if (!data.content) {
            return null;
        }

        // base64 디코딩
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return content;
    } catch (error) {
        console.error(`Error fetching file content for ${path}:`, error);
        return null;
    }
}

/**
 * 여러 파일의 내용을 병렬로 가져오기
 *
 * 최적화:
 * - Promise.all을 사용해서 병렬 처리
 * - Rate limit을 고려해서 한 번에 최대 5개씩만 요청
 */
export async function getMultipleFileContents(
    owner: string,
    repo: string,
    paths: string[]
): Promise<Array<{ path: string; content: string | null }>> {
    const BATCH_SIZE = 5;
    const results: Array<{ path: string; content: string | null }> = [];

    // 배치로 나누어서 처리
    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
        const batch = paths.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(async (path) => ({
                path,
                content: await getFileContent(owner, repo, path),
            }))
        );
        results.push(...batchResults);
    }

    return results;
}
