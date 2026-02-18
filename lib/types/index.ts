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

export type AuditSeverity = "critical" | "high" | "medium" | "low";
export type MaintainabilityFindingType = "god_class" | "circular_dependency" | "complex_logic" | "other";

export interface SecurityFinding {
    severity: AuditSeverity;
    title: string;
    description: string;
    file?: string;
    recommendation: string;
}

export interface MaintainabilityFinding {
    type: MaintainabilityFindingType;
    severity: AuditSeverity;
    title: string;
    description: string;
    file?: string;
    recommendation: string;
}

export interface ArchitectureFinding {
    severity: AuditSeverity;
    title: string;
    description: string;
    recommendation: string;
}

export interface HealthAudit {
    security: {
        score: number;
        findings: SecurityFinding[];
    };
    maintainability: {
        index: number;
        findings: MaintainabilityFinding[];
    };
    architecture: {
        rating: number;
        pattern: string;
        findings: ArchitectureFinding[];
    };
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
        healthAudit?: HealthAudit;
    };
    analyzedFiles: number;
    totalFiles: number;
    timestamp: string;
    stats?: AnalysisStats;
}
