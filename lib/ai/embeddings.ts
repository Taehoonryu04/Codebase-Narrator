import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EMBEDDING_MODEL = "gemini-embedding-001";
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 200;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Embed a single text string using Gemini gemini-embedding-001.
 * Returns a 768-dimension vector (MRL truncation of gemini-embedding-001).
 */
export async function embedText(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent({
        content: { role: "user", parts: [{ text }] },
        outputDimensionality: 768,
    } as Parameters<typeof model.embedContent>[0]);
    return result.embedding.values;
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
