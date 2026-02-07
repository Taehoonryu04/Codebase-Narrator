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
}
