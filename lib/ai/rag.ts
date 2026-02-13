import { createClient } from "@supabase/supabase-js";
import { embedText, embedBatch } from "./embeddings";

// Service-role client for server-side vector operations (bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// ~500 tokens ≈ ~2000 characters
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;

export interface CodeChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
}

/**
 * Split a file's content into overlapping chunks of ~500 tokens.
 */
export function chunkFile(filePath: string, content: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < content.length) {
        const end = Math.min(start + CHUNK_SIZE, content.length);
        chunks.push({
            filePath,
            chunkIndex: index++,
            content: content.slice(start, end),
        });
        if (end === content.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }

    return chunks;
}

/**
 * Chunk, embed, and upsert file contents into Supabase code_embeddings table.
 * Deletes existing embeddings for this user+repo before inserting fresh ones.
 */
export async function storeEmbeddings(
    userId: string,
    repoFullName: string,
    fileContents: Array<{ path: string; content: string | null }>
): Promise<void> {
    const supabase = getSupabaseAdmin();

    // Delete stale embeddings for this repo
    const { error: deleteError } = await supabase
        .from("code_embeddings")
        .delete()
        .eq("user_id", userId)
        .eq("repo_full_name", repoFullName);

    if (deleteError) {
        console.error("❌ Failed to delete old embeddings:", deleteError.message);
        throw deleteError;
    }

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

    console.log(`📦 Embedding ${allChunks.length} chunks for ${repoFullName}...`);

    // Embed all chunk texts
    const texts = allChunks.map((c) => `File: ${c.filePath}\n\n${c.content}`);
    const embeddings = await embedBatch(texts);

    // Insert rows
    const rows = allChunks.map((chunk, i) => ({
        user_id: userId,
        repo_full_name: repoFullName,
        file_path: chunk.filePath,
        chunk_index: chunk.chunkIndex,
        content: chunk.content,
        embedding: embeddings[i],
    }));

    const { error: insertError } = await supabase
        .from("code_embeddings")
        .insert(rows);

    if (insertError) {
        console.error("❌ Failed to insert embeddings:", insertError.message);
        throw insertError;
    }

    console.log(`✅ Stored ${rows.length} embeddings for ${repoFullName}`);
}

/**
 * Combine two ranked result lists using Reciprocal Rank Fusion.
 * score(d) = Σ 1/(k + rank(d)) across lists; k=60 is standard.
 * Deduplicates by filePath::chunkIndex key.
 */
function reciprocalRankFusion(
    vectorResults: CodeChunk[],
    keywordResults: CodeChunk[],
    topK: number,
    k = 60
): CodeChunk[] {
    const scores = new Map<string, { chunk: CodeChunk; score: number }>();

    const addResults = (list: CodeChunk[]) => {
        list.forEach((chunk, rank) => {
            const key = `${chunk.filePath}::${chunk.chunkIndex}`;
            const prev = scores.get(key);
            const rrfScore = 1 / (k + rank + 1);
            scores.set(key, { chunk, score: (prev?.score ?? 0) + rrfScore });
        });
    };

    addResults(vectorResults);
    addResults(keywordResults);

    return [...scores.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((v) => v.chunk);
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
): Promise<CodeChunk[]> {
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

    const vectorChunks: CodeChunk[] = (vectorData ?? []).map(
        (r: { file_path: string; chunk_index: number; content: string }) => ({
            filePath: r.file_path,
            chunkIndex: r.chunk_index,
            content: r.content,
        })
    );

    const keywordChunks: CodeChunk[] =
        !keywordResultRaw.error && keywordResultRaw.data
            ? keywordResultRaw.data.map(
                  (r: { file_path: string; chunk_index: number; content: string }) => ({
                      filePath: r.file_path,
                      chunkIndex: r.chunk_index,
                      content: r.content,
                  })
              )
            : [];

    if (keywordResultRaw.error) {
        console.warn("⚠️ Keyword search failed (vector-only fallback):", keywordResultRaw.error.message);
    }

    console.log(`🔍 Hybrid search: ${vectorChunks.length} vector + ${keywordChunks.length} keyword results`);

    return reciprocalRankFusion(vectorChunks, keywordChunks, topK);
}

/**
 * Format retrieved chunks into a context block for the chat prompt.
 */
export function buildRagContext(chunks: CodeChunk[]): string {
    if (chunks.length === 0) return "";

    return chunks
        .map((c) => `[File: ${c.filePath}]\n${c.content}`)
        .join("\n\n---\n\n");
}
