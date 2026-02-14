import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementChat, windowLabel } from "@/lib/rate-limit";
import { searchSimilarChunks, buildRagContext } from "@/lib/ai/rag";
import { chatRequestSchema, formatZodError } from "@/lib/validation";
import { logUsage, estimateCost } from "@/lib/usage";
import type { ChatStats } from "@/lib/types";

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
        const ragStart = Date.now();
        const chunks = await searchSimilarChunks(userId, repoFullName, message, 8);
        const ragRetrievalMs = Date.now() - ragStart;

        if (chunks.length === 0) {
            return NextResponse.json({
                reply: "No codebase embeddings found for this repository. Please run an analysis first so I can index the code.",
                sources: [],
            });
        }

        const ragContext = buildRagContext(chunks);
        // Deduplicate file paths for the log, but keep full SourceChunk[] for the client
        const uniqueFiles = [...new Set(chunks.map((c) => c.filePath))];
        console.log(`🔍 Retrieved ${chunks.length} chunks from ${uniqueFiles.length} files`);

        // Step 5: Build prompt and call Gemini
        const systemPrompt = `You are an expert software engineer helping a developer understand a codebase.

You have been given relevant code snippets from the repository "${repoFullName}" retrieved via semantic search.

## Relevant Code Context
${ragContext}

---

Answer the user's question about this codebase using the code context above.
- Be specific: reference actual file names, function names, and line-level details from the context.
- If the context doesn't contain enough information, say so clearly rather than guessing.
- Keep answers concise and technical.
- When explaining complex logic, data flows, class relationships, or system architecture, include a Mermaid.js diagram to visualize the structure. Use a fenced code block with the \`\`\`mermaid language tag. Prefer flowchart TD for flows, classDiagram for class relationships, and sequenceDiagram for request/response flows.
- When drawing data flow or request/response diagrams, always include: (1) authentication and rate-limit checks with their error exit paths, (2) the exact file/function responsible for each step based on the code context, (3) the complete response lifecycle including what the client does after receiving the response such as rendering, streaming buffers, or UI updates.
- CRITICAL Mermaid syntax rules you MUST follow or the diagram will fail to render:
  1. Node IDs must be alphanumeric only — no dots, dashes, or spaces. Use underscores: D6_1 not D6.1.
  2. Node labels inside [] or () or {} must contain plain text only. No parentheses (), no curly braces {}, no arrow symbols --> or ->, no pipe |, no colon :, no semicolon ;, no quotes.
  3. Never put an arrow symbol inside a label string. Write [RRF Top 8 Chunks] not [Reciprocal Rank Fusion --> Top-8].
  4. Keep labels short. Omit parens from function names: write checkAndIncrementChat not checkAndIncrementChat().
  5. subgraph titles must also contain plain text only — no parentheses. Write "subgraph Settings Activity" not "subgraph Settings Activity (com/example/Settings.java)".`;

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

        const streamStart = Date.now();
        const result = await model.generateContentStream({ contents });

        console.log(`✅ Streaming chat response started, ${uniqueFiles.length} sources`);

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ type: "chunk", text })}\n\n`)
                            );
                        }
                    }

                    // Capture token usage after stream completes
                    const response = await result.response;
                    const usageMetadata = response.usageMetadata;
                    const inputTokens = usageMetadata?.promptTokenCount ?? 0;
                    const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;
                    const totalTokens = usageMetadata?.totalTokenCount ?? 0;
                    const estimatedCostUsd = estimateCost(inputTokens, outputTokens);
                    const executionTimeMs = Date.now() - streamStart + ragRetrievalMs;

                    const stats: ChatStats = {
                        ragRetrievalMs,
                        inputTokens,
                        outputTokens,
                        totalTokens,
                        estimatedCostUsd,
                    };

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "done", sources: chunks, stats })}\n\n`)
                    );

                    // Log usage fire-and-forget
                    logUsage({
                        userId,
                        eventType: "chat",
                        repoFullName,
                        executionTimeMs,
                        ragRetrievalMs,
                        inputTokens,
                        outputTokens,
                        totalTokens,
                        estimatedCostUsd,
                    });
                } catch (err) {
                    console.error("❌ Stream error:", err);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Stream interrupted." })}\n\n`)
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("❌ Chat error:", error);
        return NextResponse.json(
            { error: "Failed to generate response. Please try again." },
            { status: 500 }
        );
    }
}
