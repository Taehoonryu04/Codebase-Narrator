import { createClient } from "@supabase/supabase-js";
import { embedText } from "./embeddings";
import { randomUUID } from "crypto";

// Service-role client for server-side vector operations (bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

const BATCH_DELAY_MS = 200;

// ~500 tokens ≈ ~2000 characters
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

/** Minimal chunk shape used internally and stored in the DB. */
export interface CodeChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
    startLine: number;
    endLine: number;
}

/**
 * Enriched chunk returned from hybrid search.
 * Carries RRF fusion metadata on top of the base CodeChunk fields.
 * Exported for use by the chat route and the frontend types.
 */
export interface SourceChunk extends CodeChunk {
    rrfScore: number;
    matchedBy: "vector" | "keyword" | "both";
}

/**
 * Split a file's content into overlapping chunks of ~500 tokens.
 * Line numbers are computed from character offsets (1-indexed).
 */
export function chunkFile(filePath: string, content: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < content.length) {
        const end = Math.min(start + CHUNK_SIZE, content.length);
        const chunkContent = content.slice(start, end);

        // Count newlines before start/end positions to get 1-indexed line numbers
        const startLine = content.slice(0, start).split("\n").length;
        const endLine = content.slice(0, end).split("\n").length;

        chunks.push({
            filePath,
            chunkIndex: index++,
            content: chunkContent,
            startLine,
            endLine,
        });

        if (end === content.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Chunk, embed, and upsert file contents into Supabase code_embeddings table.
 * Uses atomic swap: old embeddings remain searchable until new batch is fully ready.
 * Progress is tracked in the embedding_jobs table for frontend polling.
 */
export async function storeEmbeddings(
    userId: string,
    repoFullName: string,
    fileContents: Array<{ path: string; content: string | null }>
): Promise<void> {
    const supabase = getSupabaseAdmin();
    const batchId = randomUUID();

    // Build all chunks
    const allChunks: CodeChunk[] = [];
    for (const file of fileContents) {
        if (!file.content) continue;
        allChunks.push(...chunkFile(file.path, file.content));
    }

    if (allChunks.length === 0) {
        console.log("⚠️ No chunks to embed — skipping");
        return;
    }

    // Create job record for progress tracking
    const { error: jobError } = await supabase
        .from("embedding_jobs")
        .insert({
            user_id: userId,
            repo_full_name: repoFullName,
            batch_id: batchId,
            status: "in_progress",
            total_chunks: allChunks.length,
            embedded_chunks: 0,
        });

    if (jobError) {
        console.error("❌ Failed to create embedding job:", jobError.message);
        throw jobError;
    }

    console.log(`📦 Embedding ${allChunks.length} chunks for ${repoFullName} (batch ${batchId.slice(0, 8)})...`);

    try {
        // Embed chunks sequentially with progress updates
        const embeddings: number[][] = [];

        for (let i = 0; i < allChunks.length; i++) {
            const text = `File: ${allChunks[i].filePath}\n\n${allChunks[i].content}`;
            const embedding = await embedText(text);
            embeddings.push(embedding);

            // Update progress every 10 chunks
            if ((i + 1) % 10 === 0 || i === allChunks.length - 1) {
                await supabase
                    .from("embedding_jobs")
                    .update({ embedded_chunks: i + 1 })
                    .eq("batch_id", batchId);
            }

            // Rate-limit delay between embeddings
            if (i < allChunks.length - 1) {
                await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
            }
        }

        // Insert new embeddings with batch_id
        const rows = allChunks.map((chunk, i) => ({
            user_id: userId,
            repo_full_name: repoFullName,
            file_path: chunk.filePath,
            chunk_index: chunk.chunkIndex,
            content: chunk.content,
            start_line: chunk.startLine,
            end_line: chunk.endLine,
            embedding: embeddings[i],
            batch_id: batchId,
        }));

        const { error: insertError } = await supabase
            .from("code_embeddings")
            .insert(rows);

        if (insertError) {
            throw insertError;
        }

        // Atomic swap: delete old embeddings (different batch_id)
        const { error: deleteError } = await supabase
            .from("code_embeddings")
            .delete()
            .eq("user_id", userId)
            .eq("repo_full_name", repoFullName)
            .neq("batch_id", batchId);

        if (deleteError) {
            console.warn("⚠️ Old embedding cleanup failed (non-critical):", deleteError.message);
        }

        // Mark job completed
        await supabase
            .from("embedding_jobs")
            .update({
                status: "completed",
                embedded_chunks: allChunks.length,
                completed_at: new Date().toISOString(),
            })
            .eq("batch_id", batchId);

        console.log(`✅ Stored ${rows.length} embeddings for ${repoFullName} (batch ${batchId.slice(0, 8)})`);
    } catch (err) {
        // Mark job failed
        await supabase
            .from("embedding_jobs")
            .update({
                status: "failed",
                error_message: err instanceof Error ? err.message : "Unknown error",
                completed_at: new Date().toISOString(),
            })
            .eq("batch_id", batchId);

        // Clean up any partially inserted new-batch rows
        await supabase
            .from("code_embeddings")
            .delete()
            .eq("user_id", userId)
            .eq("repo_full_name", repoFullName)
            .eq("batch_id", batchId);

        console.error(`❌ Embedding failed for ${repoFullName} (batch ${batchId.slice(0, 8)}):`, err);
        throw err;
    }
}

type RpcRow = {
    file_path: string;
    chunk_index: number;
    content: string;
    start_line: number;
    end_line: number;
};

function rowToCodeChunk(r: RpcRow): CodeChunk {
    return {
        filePath: r.file_path,
        chunkIndex: r.chunk_index,
        content: r.content,
        startLine: r.start_line ?? 1,
        endLine: r.end_line ?? 1,
    };
}

/**
 * Combine two ranked result lists using Reciprocal Rank Fusion.
 * score(d) = Σ 1/(k + rank(d)) across lists; k=60 is standard.
 * Deduplicates by filePath::chunkIndex key.
 * Returns SourceChunk[] with rrfScore and matchedBy populated.
 */
function reciprocalRankFusion(
    vectorResults: CodeChunk[],
    keywordResults: CodeChunk[],
    topK: number,
    k = 60
): SourceChunk[] {
    const scores = new Map<string, { chunk: CodeChunk; score: number; matchedBy: "vector" | "keyword" | "both" }>();

    const addResults = (list: CodeChunk[], source: "vector" | "keyword") => {
        list.forEach((chunk, rank) => {
            const key = `${chunk.filePath}::${chunk.chunkIndex}`;
            const prev = scores.get(key);
            const rrfScore = 1 / (k + rank + 1);
            scores.set(key, {
                chunk,
                score: (prev?.score ?? 0) + rrfScore,
                matchedBy: prev ? "both" : source,
            });
        });
    };

    addResults(vectorResults, "vector");
    addResults(keywordResults, "keyword");

    return [...scores.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((v) => ({
            ...v.chunk,
            rrfScore: v.score,
            matchedBy: v.matchedBy,
        }));
}

/**
 * Hybrid search: runs vector similarity + keyword (FTS) search in parallel,
 * then fuses results with Reciprocal Rank Fusion.
 * Degrades gracefully to pure vector search if keyword search fails or returns nothing.
 */
export async function searchSimilarChunks(
    userId: string,
    repoFullName: string,
    query: string,
    topK: number = 8
): Promise<SourceChunk[]> {
    const supabase = getSupabaseAdmin();
    const fetchCount = topK * 2; // wider candidate set before fusion

    // Embed query and run keyword search concurrently
    const [queryEmbedding, keywordResultRaw] = await Promise.all([
        embedText(query),
        supabase.rpc("keyword_search_code_chunks", {
            match_user_id: userId,
            match_repo: repoFullName,
            keyword_query: query,
            match_count: fetchCount,
        }),
    ]);

    // Vector search depends on embedding (runs after)
    const { data: vectorData, error: vectorError } = await supabase.rpc("match_code_chunks", {
        query_embedding: queryEmbedding,
        match_user_id: userId,
        match_repo: repoFullName,
        match_count: fetchCount,
    });

    if (vectorError) {
        console.error("❌ Vector search failed:", vectorError.message);
        throw vectorError;
    }

    const vectorChunks: CodeChunk[] = (vectorData ?? []).map(rowToCodeChunk);

    const keywordChunks: CodeChunk[] =
        !keywordResultRaw.error && keywordResultRaw.data
            ? keywordResultRaw.data.map(rowToCodeChunk)
            : [];

    if (keywordResultRaw.error) {
        console.warn("⚠️ Keyword search failed (vector-only fallback):", keywordResultRaw.error.message);
    }

    console.log(`🔍 Hybrid search: ${vectorChunks.length} vector + ${keywordChunks.length} keyword results`);

    return reciprocalRankFusion(vectorChunks, keywordChunks, topK);
}

/**
 * Format retrieved chunks into a context block for the chat prompt.
 * Includes file path and line range so Gemini can cite specific locations.
 */
export function buildRagContext(chunks: SourceChunk[]): string {
    if (chunks.length === 0) return "";

    return chunks
        .map((c) => `[File: ${c.filePath}, Lines: ${c.startLine}-${c.endLine}]\n${c.content}`)
        .join("\n\n---\n\n");
}
