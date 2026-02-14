import { createClient } from "@supabase/supabase-js";

// Gemini 2.5 Flash pricing (USD per token)
const GEMINI_COSTS = {
    inputPerToken: 0.075 / 1_000_000,   // $0.075 / 1M input tokens
    outputPerToken: 0.30 / 1_000_000,   // $0.30  / 1M output tokens
} as const;

export function estimateCost(inputTokens: number, outputTokens: number): number {
    return (
        inputTokens * GEMINI_COSTS.inputPerToken +
        outputTokens * GEMINI_COSTS.outputPerToken
    );
}

function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export interface UsageLogData {
    userId?: string | null;
    ipAddress?: string | null;
    eventType: "analyze" | "chat";
    repoFullName?: string | null;
    executionTimeMs?: number;
    ragRetrievalMs?: number;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    totalFiles?: number;
    filesSent?: number;
    estimatedCostUsd?: number;
}

/** Fire-and-forget: insert a usage log row. Never throws. */
export function logUsage(data: UsageLogData): void {
    const supabase = getSupabaseAdmin();
    supabase
        .from("usage_logs")
        .insert({
            user_id: data.userId ?? null,
            ip_address: data.ipAddress ?? null,
            event_type: data.eventType,
            repo_full_name: data.repoFullName ?? null,
            execution_time_ms: data.executionTimeMs ?? null,
            rag_retrieval_ms: data.ragRetrievalMs ?? null,
            input_tokens: data.inputTokens ?? null,
            output_tokens: data.outputTokens ?? null,
            total_tokens: data.totalTokens ?? null,
            total_files: data.totalFiles ?? null,
            files_sent: data.filesSent ?? null,
            estimated_cost_usd: data.estimatedCostUsd ?? null,
        })
        .then(({ error }) => {
            if (error) console.warn("⚠️ logUsage failed:", error.message);
        });
}

/**
 * Check if an anonymous IP has already used their 1 free analysis today.
 * Returns true if allowed (under limit), false if limit reached.
 */
export async function checkAnonAnalysisLimit(ip: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
        .from("usage_logs")
        .select("id", { count: "exact", head: true })
        .is("user_id", null)
        .eq("ip_address", ip)
        .eq("event_type", "analyze")
        .gte("created_at", since);

    if (error) {
        console.warn("⚠️ checkAnonAnalysisLimit error:", error.message);
        return true; // fail open — don't block on DB error
    }

    return (count ?? 0) < 1;
}
