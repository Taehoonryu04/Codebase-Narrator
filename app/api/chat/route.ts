import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementChat, windowLabel } from "@/lib/rate-limit";
import { searchSimilarChunks, buildRagContext } from "@/lib/ai/rag";
import { chatRequestSchema, formatZodError } from "@/lib/validation";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * POST /api/chat
 *
 * RAG-powered codebase Q&A chat endpoint.
 *
 * Flow:
 * 1. Auth check
 * 2. Zod validation
 * 3. Chat rate limit check
 * 4. Embed query → similarity search → build RAG context
 * 5. Gemini generateContent with system prompt + history + user message
 * 6. Return { reply, sources }
 */
export async function POST(request: NextRequest) {
    try {
        // Step 1: Auth
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required. Sign in to use codebase chat." },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Step 2: Validate
        const body = await request.json();
        const validation = chatRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: formatZodError(validation.error) },
                { status: 400 }
            );
        }

        const { repoFullName, message, history } = validation.data;

        // Step 3: Rate limit
        const rateLimit = await checkAndIncrementChat(userId);
        if (!rateLimit.allowed) {
            const retryAfterSecs = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000);
            return NextResponse.json(
                {
                    error: `Chat limit reached (${rateLimit.limit}/${windowLabel()}). Resets at ${rateLimit.resetAt.toLocaleString()}.`,
                    resetAt: rateLimit.resetAt.toISOString(),
                },
                {
                    status: 429,
                    headers: { "Retry-After": String(retryAfterSecs) },
                }
            );
        }

        // Step 4: RAG retrieval
        console.log(`💬 Chat request: "${message.slice(0, 60)}..." for ${repoFullName}`);
        const chunks = await searchSimilarChunks(userId, repoFullName, message, 8);

        if (chunks.length === 0) {
            return NextResponse.json({
                reply: "No codebase embeddings found for this repository. Please run an analysis first so I can index the code.",
                sources: [],
            });
        }

        const ragContext = buildRagContext(chunks);
        const sources = [...new Set(chunks.map((c) => c.filePath))];
        console.log(`🔍 Retrieved ${chunks.length} chunks from ${sources.length} files`);

        // Step 5: Build prompt and call Gemini
        const systemPrompt = `You are an expert software engineer helping a developer understand a codebase.

You have been given relevant code snippets from the repository "${repoFullName}" retrieved via semantic search.

## Relevant Code Context
${ragContext}

---

Answer the user's question about this codebase using the code context above.
- Be specific: reference actual file names, function names, and line-level details from the context.
- If the context doesn't contain enough information, say so clearly rather than guessing.
- Keep answers concise and technical.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build contents array: system context as first user turn, then history, then current message
        const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I have reviewed the code context and am ready to answer questions about this codebase." }] },
            ...history.map((h) => ({
                role: h.role as "user" | "model",
                parts: [{ text: h.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        const result = await model.generateContent({ contents });
        const reply = result.response.text().trim();

        console.log(`✅ Chat response: ${reply.length} chars, ${sources.length} sources`);

        return NextResponse.json({ reply, sources });
    } catch (error) {
        console.error("❌ Chat error:", error);
        return NextResponse.json(
            { error: "Failed to generate response. Please try again." },
            { status: 500 }
        );
    }
}
