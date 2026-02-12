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
 * Embed a query and retrieve the top-k most similar code chunks via RPC.
 */
export async function searchSimilarChunks(
    userId: string,
    repoFullName: string,
    query: string,
    topK: number = 8
): Promise<CodeChunk[]> {
    const supabase = getSupabaseAdmin();

    const queryEmbedding = await embedText(query);

    const { data, error } = await supabase.rpc("match_code_chunks", {
        query_embedding: queryEmbedding,
        match_user_id: userId,
        match_repo: repoFullName,
        match_count: topK,
    });

    if (error) {
        console.error("❌ Similarity search failed:", error.message);
        throw error;
    }

    return (data ?? []).map((row: { file_path: string; chunk_index: number; content: string }) => ({
        filePath: row.file_path,
        chunkIndex: row.chunk_index,
        content: row.content,
    }));
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
