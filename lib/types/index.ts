// GitHub Repository 관련 타입
export interface GitHubRepo {
    owner: string;
    name: string;
    fullName: string;
    description: string | null;
    url: string;
    stars: number;
    language: string | null;
    topics: string[];
}

// 파일 구조 타입
export interface FileNode {
    path: string;
    type: "file" | "dir";
    size?: number;
    content?: string;
}

// Performance & cost stats returned alongside analysis / chat
export interface AnalysisStats {
    executionTimeMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    totalFiles: number;
    filesSent: number;
    contextEfficiencyPct: number; // % of files filtered out before LLM
}

export interface ChatStats {
    ragRetrievalMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
}

// 분석 결과 타입
export interface AnalysisResult {
    repoInfo: GitHubRepo;
    fileStructure: FileNode[];
    analysis: {
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
    };
    analyzedFiles: number;
    totalFiles: number;
    timestamp: string;
    stats?: AnalysisStats;
}
