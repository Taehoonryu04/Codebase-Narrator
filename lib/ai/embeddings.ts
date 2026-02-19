import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EMBEDDING_MODEL = "gemini-embedding-001";
const BATCH_SIZE = 1;
const BATCH_DELAY_MS = 500;

// Retry config for 429 rate-limit responses
const MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 15_000; // 15s → 30s → 60s → 120s

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedTextWithRetry(text: string, attempt = 0): Promise<number[]> {
    try {
        const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
        const result = await model.embedContent({
            content: { role: "user", parts: [{ text }] },
            outputDimensionality: 768,
        } as Parameters<typeof model.embedContent>[0]);
        return result.embedding.values;
    } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if (status === 429 && attempt < MAX_RETRIES) {
            const waitMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
            console.warn(
                `⏳ Embedding rate limited (429), retry ${attempt + 1}/${MAX_RETRIES} in ${waitMs / 1000}s...`
            );
            await sleep(waitMs);
            return embedTextWithRetry(text, attempt + 1);
        }
        throw err;
    }
}

/**
 * Embed a single text string using Gemini gemini-embedding-001.
 * Returns a 768-dimension vector (MRL truncation of gemini-embedding-001).
 * Retries up to MAX_RETRIES times with exponential backoff on 429.
 */
export async function embedText(text: string): Promise<number[]> {
    return embedTextWithRetry(text);
}

/**
 * Embed multiple texts in small batches to respect Gemini rate limits.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map(embedText));
        results.push(...batchResults);

        if (i + BATCH_SIZE < texts.length) {
            await sleep(BATCH_DELAY_MS);
        }
    }

    return results;
}
