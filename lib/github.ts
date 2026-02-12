import { Octokit } from "@octokit/rest";
import type { GitHubRepo, FileNode } from "./types";

/**
 * GitHub API 클라이언트 초기화
 *
 * 개념 설명:
 * - Octokit: GitHub의 공식 JavaScript SDK
 * - Personal Access Token을 사용하면 rate limit이 5000/hour로 증가 (미사용 시 60/hour)
 * - Phase 2: 사용자별 OAuth token으로 private repo 접근 가능
 */

/**
 * 기본 Octokit 클라이언트 생성 (fallback용)
 * 익명 사용자의 경우 환경변수의 GITHUB_TOKEN 사용
 */
function getDefaultOctokit(): Octokit {
    return new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });
}

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
 *
 * @param octokit - Optional Octokit instance (uses user's OAuth token or default)
 */
export async function getRepoInfo(
    owner: string,
    repo: string,
    octokit?: Octokit
): Promise<GitHubRepo> {
    const client = octokit || getDefaultOctokit();
    const { data } = await client.rest.repos.get({
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
 *
 * @param octokit - Optional Octokit instance (uses user's OAuth token or default)
 */
export async function getRepoFileTree(
    owner: string,
    repo: string,
    maxDepth: number = 10,
    octokit?: Octokit
): Promise<FileNode[]> {
    try {
        const client = octokit || getDefaultOctokit();

        // 1. Get default branch info
        const { data: repoData } = await client.rest.repos.get({
            owner,
            repo,
        });

        const defaultBranch = repoData.default_branch;

        // 2. Get file list using Git Tree API
        const { data: treeData } = await client.rest.git.getTree({
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
                    /\.xml$/, // Android layouts, Maven pom, Spring config, etc.
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

        // Adaptive sort: highest-value source files first, so slice(0, maxFiles) picks them
        const primaryLanguage = repoData.language;
        importantFiles.sort((a, b) => scoreFile(a.path, primaryLanguage) - scoreFile(b.path, primaryLanguage));

        console.log(`✅ Found ${importantFiles.length} important files`);
        console.log(`📋 Top files (adaptive): ${importantFiles.slice(0, 10).map(f => f.path).join(", ")}`);
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
 *
 * @param octokit - Optional Octokit instance (uses user's OAuth token or default)
 */
export async function getFileContent(
    owner: string,
    repo: string,
    path: string,
    octokit?: Octokit
): Promise<string | null> {
    try {
        const client = octokit || getDefaultOctokit();
        const { data } = await client.rest.repos.getContent({
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
 * - Rate limit을 고려해서 한 번에 최대 10개씩만 요청
 * - 우선순위 정렬: 핵심 파일(entry points, config)을 먼저 가져옴
 *
 * @param octokit - Optional Octokit instance (uses user's OAuth token or default)
 */
export async function getMultipleFileContents(
    owner: string,
    repo: string,
    paths: string[],
    octokit?: Octokit
): Promise<Array<{ path: string; content: string | null }>> {
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
    if (/\/(migrations?|generated?|\.next)\//i.test("/" + path)) return 90;
    if (/\.(d\.ts|min\.js|min\.css|js\.map)$/.test(filename)) return 90;

    // Test files — catches both root-level test/ dirs and mid-path variants (e.g. app/src/test/..., androidTest/)
    if (/\.(test|spec|e2e)\.[^.]+$/.test(filename)) return 70;
    if (/(^|\/)(tests?|__tests__|specs?|androidTest)\//i.test(path)) return 70;

    // Docs
    if (/\.(md|txt|rst)$/i.test(filename)) return 60;

    // Root-level key manifests
    if (
        depth === 1 &&
        /^(package\.json|go\.mod|Cargo\.toml|pyproject\.toml|requirements\.txt|pom\.xml|build\.gradle|Gemfile|composer\.json)$/.test(filename)
    ) return 5;

    // Entry points (shallow depth only)
    if (depth <= 3 && /^(main|index|app|server|mod)\.[^.]+$/.test(filename)) return 10 + depth;

    // Core source directories
    const inSrcDir = /^(src|lib|app|pkg|internal|core|api|server|backend|frontend|pages|routes|handlers?|controllers?)\//i.test(path);
    if (inSrcDir) {
        const base = 20 + depth;
        // Language bonus inside src dirs
        const langBonus = matchesLanguage(filename, primaryLanguage) ? -5 : 0;
        return base + langBonus;
    }

    // Root-level source files
    if (depth === 1 && matchesLanguage(filename, primaryLanguage)) return 25;

    // UI resource files (Android layouts, iOS storyboards, etc.) — ahead of generic config
    if (/\/(res\/layout|res\/menu|res\/navigation|res\/drawable)\//i.test("/" + path) && /\.xml$/.test(filename)) return 30;

    // Other config/data files
    if (/\.(json|jsonc|yaml|yml|toml|ini|cfg|env\.example|prisma|graphql|proto|sql)$/.test(filename)) return 40;
    // Generic XML (pom.xml siblings, Spring config, etc.) — behind config, ahead of docs
    if (/\.xml$/.test(filename)) return 45;

    return 50 + depth * 2;
}

/** Returns true if the filename's extension matches the repo's primary language. */
function matchesLanguage(filename: string, primaryLanguage: string | null | undefined): boolean {
    if (!primaryLanguage) return false;
    const lang = primaryLanguage.toLowerCase();
    const extMap: Record<string, RegExp> = {
        typescript: /\.(ts|tsx)$/,
        javascript: /\.(js|jsx|mjs|cjs)$/,
        python: /\.py$/,
        go: /\.go$/,
        rust: /\.rs$/,
        java: /\.java$/,
        kotlin: /\.(kt|kts)$/,
        ruby: /\.rb$/,
        php: /\.php$/,
        "c#": /\.cs$/,
        "c++": /\.(cpp|cc|cxx|hpp|hxx)$/,
        c: /\.(c|h)$/,
        swift: /\.swift$/,
        scala: /\.(scala|sc)$/,
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

        const truncatedLines = file.content.split("\n").slice(0, maxLinesPerFile);
        const wasTruncated = file.content.split("\n").length > maxLinesPerFile;
        const suffix = wasTruncated ? `\n... (truncated at ${maxLinesPerFile} lines)` : "";

        blocks.push(`[File: ${file.path}]\n${truncatedLines.join("\n")}${suffix}`);
    }

    return blocks.join("\n\n");
}
