"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingPaths } from "@/components/ui/floating-paths";
import Link from "next/link";
import MessageContent from "@/components/chat/MessageContent";

interface HistoryItem {
    id: string;
    repoFullName: string;
    repoUrl: string;
    analyzedAt: string;
}

interface SourceChunk {
    filePath: string;
    chunkIndex: number;
    content: string;
    startLine: number;
    endLine: number;
    rrfScore: number;
    matchedBy: "vector" | "keyword" | "both";
}

interface ChatStats {
    ragRetrievalMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
}

interface ChatMessage {
    role: "user" | "model";
    content: string;
    sources?: SourceChunk[];
    stats?: ChatStats;
}

export default function ChatPage() {
    const { user, loading: authLoading, signInWithGitHub } = useAuth();
    const searchParams = useSearchParams();
    const repoParam = searchParams.get("repo");

    const [selectedRepo, setSelectedRepo] = useState<string>(repoParam ?? "");
    const [repos, setRepos] = useState<HistoryItem[]>([]);
    const [reposLoading, setReposLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState<{ content: string; sources: SourceChunk[] } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [chatRemaining, setChatRemaining] = useState<number | null>(null);
    const [activeSource, setActiveSource] = useState<SourceChunk | null>(null);
    const [embeddingStatus, setEmbeddingStatus] = useState<{
        status: "none" | "in_progress" | "completed" | "failed";
        progressPct: number;
        totalChunks: number;
        embeddedChunks: number;
        errorMessage?: string;
    } | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Typewriter buffer refs
    const bufferRef = useRef<string>("");
    const sourcesRef = useRef<SourceChunk[]>([]);
    const statsRef = useRef<ChatStats | null>(null);
    const streamDoneRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const displayedRef = useRef<string>("");  // tracks what's been typed out

    // Starts the typewriter interval. Owns setSending(false) on completion.
    const startTypewriter = useCallback(() => {
        bufferRef.current = "";
        sourcesRef.current = [];
        statsRef.current = null;
        streamDoneRef.current = false;
        displayedRef.current = "";
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (bufferRef.current.length === 0) {
                if (streamDoneRef.current) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    // Read final values synchronously — no nested setter
                    const finalContent = displayedRef.current;
                    const sources = sourcesRef.current;
                    const stats = statsRef.current ?? undefined;
                    setMessages((msgs) => [
                        ...msgs,
                        { role: "model", content: finalContent, sources, stats },
                    ]);
                    setStreamingMessage(null);
                    setSending(false);
                    inputRef.current?.focus();
                }
                return;
            }
            // Dynamic speed: drain faster when buffer builds up
            const charsToShow =
                bufferRef.current.length > 200 ? 6
                : bufferRef.current.length > 80 ? 3
                : 1;
            const chars = bufferRef.current.slice(0, charsToShow);
            bufferRef.current = bufferRef.current.slice(charsToShow);
            displayedRef.current += chars;
            setStreamingMessage((prev) =>
                prev ? { ...prev, content: prev.content + chars } : prev
            );
        }, 16); // ~60fps base tick
    }, []);

    // Fetch user's analyzed repos for the selector
    const fetchRepos = useCallback(async () => {
        setReposLoading(true);
        try {
            const res = await fetch("/api/history");
            if (res.ok) {
                const data: HistoryItem[] = await res.json();
                setRepos(data);
                // Auto-select if only one repo and no param
                if (!repoParam && data.length === 1) {
                    setSelectedRepo(data[0].repoFullName);
                }
            }
        } finally {
            setReposLoading(false);
        }
    }, [repoParam]);

    // Fetch rate limit status
    const fetchRateLimit = useCallback(async () => {
        try {
            const res = await fetch("/api/rate-limit");
            if (res.ok) {
                const data = await res.json();
                setChatRemaining(data.chat?.remaining ?? null);
            }
        } catch {
            // non-blocking
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchRepos();
            fetchRateLimit();
        }
    }, [user, fetchRepos, fetchRateLimit]);

    // Poll embedding status when a repo is selected
    useEffect(() => {
        if (!user || !selectedRepo) {
            setEmbeddingStatus(null);
            return;
        }

        let active = true;
        let pollTimer: ReturnType<typeof setTimeout>;

        const poll = async () => {
            try {
                const res = await fetch(`/api/embeddings/status?repo=${encodeURIComponent(selectedRepo)}`);
                if (!active || !res.ok) return;
                const data = await res.json();
                setEmbeddingStatus(data);
                if (data.status === "in_progress") {
                    pollTimer = setTimeout(poll, 2000);
                }
            } catch { /* non-blocking */ }
        };

        poll();
        return () => { active = false; clearTimeout(pollTimer); };
    }, [user, selectedRepo]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage?.content]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedRepo || sending) return;

        const userMessage = input.trim();
        setInput("");
        setError(null);

        const newMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: userMessage },
        ];
        setMessages(newMessages);
        setSending(true);

        // Build history for API (exclude the message we just added)
        const history = messages.map((m) => ({ role: m.role, content: m.content }));

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoFullName: selectedRepo,
                    message: userMessage,
                    history,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Failed to get response");
                setMessages(messages);
                setSending(false);
                inputRef.current?.focus();
                return;
            }

            setStreamingMessage({ content: "", sources: [] });
            startTypewriter(); // owns setSending(false) on completion

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            let sseBuffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    sseBuffer += decoder.decode(value, { stream: true });
                    const lines = sseBuffer.split("\n");
                    sseBuffer = lines.pop() ?? "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const event = JSON.parse(line.slice(6));

                        if (event.type === "chunk") {
                            bufferRef.current += event.text;
                        } else if (event.type === "done") {
                            sourcesRef.current = event.sources;
                            statsRef.current = event.stats ?? null;
                            streamDoneRef.current = true;
                        } else if (event.type === "error") {
                            setError(event.message ?? "Stream interrupted.");
                            streamDoneRef.current = true;
                        }
                    }
                }
            } catch {
                setError("Network error. Please try again.");
                streamDoneRef.current = true;
            }

            setChatRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
        } catch {
            setError("Network error. Please try again.");
            setMessages(messages);
            setStreamingMessage(null);
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ── Render states ──────────────────────────────────────────────

    return (
        <div className="relative h-full w-full bg-white dark:bg-neutral-950 flex flex-col overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            href="/"
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
                        >
                            &larr; Home
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold text-neutral-900 dark:text-white truncate">
                                Codebase Chat
                            </h1>
                            {selectedRepo && (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                                    {selectedRepo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {chatRemaining !== null && (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {chatRemaining} msgs left today
                            </span>
                        )}
                        {/* Repo selector */}
                        {user && repos.length > 1 && (
                            <select
                                value={selectedRepo}
                                onChange={(e) => {
                                    setSelectedRepo(e.target.value);
                                    setMessages([]);
                                    setError(null);
                                }}
                                className="text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5
                                    bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                                    focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                            >
                                <option value="">Select a repo</option>
                                {repos.map((r) => (
                                    <option key={r.id} value={r.repoFullName}>
                                        {r.repoFullName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Auth loading */}
                {authLoading && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900 dark:border-white" />
                    </div>
                )}

                {/* Not signed in */}
                {!authLoading && !user && (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 shadow-lg text-center max-w-sm"
                        >
                            <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                Sign in to chat
                            </p>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                                Chat requires an account to index your repositories.
                            </p>
                            <button
                                onClick={signInWithGitHub}
                                className="px-6 py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                                    hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold transition-colors"
                            >
                                Sign in with GitHub
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* No repo selected / no history */}
                {!authLoading && user && !reposLoading && !selectedRepo && (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 shadow-lg text-center max-w-sm"
                        >
                            {repos.length === 0 ? (
                                <>
                                    <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                        No analyzed repositories
                                    </p>
                                    <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                                        Analyze a repository first to enable codebase chat.
                                    </p>
                                    <Link
                                        href="/analyze"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                                            bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                                            hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold transition-colors"
                                    >
                                        Go to Analyze &rarr;
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                                        Select a repository
                                    </p>
                                    <div className="space-y-2">
                                        {repos.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => setSelectedRepo(r.repoFullName)}
                                                className="w-full text-left px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                                                    hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors
                                                    text-neutral-900 dark:text-white text-sm font-medium"
                                            >
                                                {r.repoFullName}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Chat view */}
                {!authLoading && user && selectedRepo && (
                    <>
                        {/* Embedding progress banner */}
                        <AnimatePresence>
                            {embeddingStatus?.status === "in_progress" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="shrink-0 border-b border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm"
                                >
                                    <div className="max-w-3xl mx-auto px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0 animate-spin rounded-full h-4 w-4 border-2 border-blue-300 dark:border-blue-600 border-t-blue-600 dark:border-t-blue-300" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                    Indexing your code... ({embeddingStatus.progressPct}%)
                                                </p>
                                                <div className="mt-1.5 h-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${embeddingStatus.progressPct}%` }}
                                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                                                    {embeddingStatus.embeddedChunks} / {embeddingStatus.totalChunks} chunks embedded
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                {messages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16 text-neutral-400 dark:text-neutral-300"
                                    >
                                        {embeddingStatus?.status === "in_progress" ? (
                                            <>
                                                <p className="text-lg font-medium mb-2">Your codebase is being indexed</p>
                                                <p className="text-sm">Chat will be ready once indexing completes. You can start asking once it finishes.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-lg font-medium mb-2">Ask anything about the codebase</p>
                                                <p className="text-sm">e.g. &ldquo;How does authentication work?&rdquo; or &ldquo;Explain the data flow&rdquo;</p>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                <AnimatePresence initial={false}>
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[80%] ${msg.role === "user" ? "order-1" : ""}`}>
                                                <div
                                                    className={`rounded-2xl px-4 py-3
                                                        ${msg.role === "user"
                                                            ? "text-sm leading-relaxed whitespace-pre-wrap bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-br-sm"
                                                            : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-bl-sm shadow-sm"
                                                        }`}
                                                >
                                                    {msg.role === "user"
                                                        ? msg.content
                                                        : <MessageContent content={msg.content} />
                                                    }
                                                </div>

                                                {/* Per-message stats */}
                                                {msg.role === "model" && msg.stats && (
                                                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-400 dark:text-neutral-400">
                                                        <span>RAG {(msg.stats.ragRetrievalMs / 1000).toFixed(2)}s</span>
                                                        <span>·</span>
                                                        <span>{msg.stats.totalTokens.toLocaleString()} tokens</span>
                                                        <span>·</span>
                                                        <span>${msg.stats.estimatedCostUsd.toFixed(4)}</span>
                                                    </div>
                                                )}

                                                {/* Source chips */}
                                                {msg.role === "model" && msg.sources && msg.sources.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {/* Deduplicate by filePath, keep first (highest RRF) chunk per file */}
                                                        {Array.from(
                                                            new Map(msg.sources.map((s) => [s.filePath, s])).values()
                                                        ).map((src) => (
                                                            <button
                                                                key={`${src.filePath}::${src.chunkIndex}`}
                                                                onClick={() => setActiveSource(src)}
                                                                title={`${src.filePath} · lines ${src.startLine}–${src.endLine} · ${src.matchedBy}`}
                                                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                                                                    bg-neutral-100 dark:bg-neutral-800
                                                                    text-neutral-600 dark:text-neutral-300
                                                                    border border-neutral-200 dark:border-neutral-700
                                                                    hover:bg-neutral-200 dark:hover:bg-neutral-700
                                                                    hover:border-neutral-400 dark:hover:border-neutral-500
                                                                    transition-colors cursor-pointer"
                                                            >
                                                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                                                                    <path d="M2 2h8M2 6h5M2 10h3" />
                                                                </svg>
                                                                <span className="truncate max-w-[180px]">
                                                                    {src.filePath.split("/").slice(-2).join("/")}
                                                                </span>
                                                                <span className="opacity-50 shrink-0">:{src.startLine}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Streaming bubble / typing indicator */}
                                {sending && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="max-w-[80%] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-sm leading-relaxed text-neutral-900 dark:text-white whitespace-pre-wrap">
                                            {streamingMessage && streamingMessage.content.length > 0 ? (
                                                <>
                                                    {streamingMessage.content}
                                                    <span className="inline-block w-0.5 h-4 bg-neutral-400 dark:bg-neutral-300 ml-0.5 align-text-bottom animate-pulse" />
                                                </>
                                            ) : (
                                                <div className="flex gap-1 items-center h-4">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-400"
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={bottomRef} />
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="px-4 pb-2"
                                >
                                    <div className="max-w-3xl mx-auto">
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 flex items-center justify-between">
                                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                            <button
                                                onClick={() => setError(null)}
                                                className="text-red-400 hover:text-red-600 ml-2 text-lg leading-none"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="relative z-10 px-4 py-4 shrink-0">
                            <div className="max-w-3xl mx-auto flex gap-3 items-end">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ask about ${selectedRepo}...`}
                                    rows={1}
                                    disabled={sending}
                                    className="flex-1 resize-none rounded-xl border border-neutral-200 dark:border-neutral-700
                                        bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
                                        px-4 py-3 text-sm leading-relaxed
                                        placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                                        focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600
                                        disabled:opacity-50
                                        max-h-40 overflow-y-auto"
                                    style={{ minHeight: "48px" }}
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
                                    }}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || sending}
                                    className="shrink-0 h-12 w-12 rounded-xl flex items-center justify-center
                                        bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                                        hover:bg-neutral-800 dark:hover:bg-neutral-100
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition-colors"
                                    aria-label="Send"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 1l7 7-7 7M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </button>
                            </div>
                            <p className="max-w-3xl mx-auto mt-1.5 text-xs text-neutral-400 dark:text-neutral-400">
                                Enter to send &middot; Shift+Enter for new line
                            </p>
                        </div>
                    </>
                )}
            </main>

            {/* Source viewer modal */}
            <AnimatePresence>
                {activeSource && (
                    <motion.div
                        key="source-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setActiveSource(null)}
                    >
                        <motion.div
                            key="source-modal"
                            initial={{ opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="relative w-full max-w-2xl max-h-[80vh] flex flex-col
                                bg-white dark:bg-neutral-900
                                border border-neutral-200 dark:border-neutral-700
                                rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                                <div className="min-w-0">
                                    <p className="text-sm font-mono font-medium text-neutral-900 dark:text-white truncate">
                                        {activeSource.filePath}
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                        Lines {activeSource.startLine}–{activeSource.endLine}
                                        <span className="mx-1.5 opacity-40">·</span>
                                        <span className={
                                            activeSource.matchedBy === "both"
                                                ? "text-violet-500 dark:text-violet-400"
                                                : activeSource.matchedBy === "vector"
                                                ? "text-blue-500 dark:text-blue-400"
                                                : "text-amber-500 dark:text-amber-400"
                                        }>
                                            {activeSource.matchedBy === "both" ? "vector + keyword" : activeSource.matchedBy}
                                        </span>
                                        <span className="mx-1.5 opacity-40">·</span>
                                        score {activeSource.rrfScore.toFixed(4)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveSource(null)}
                                    className="shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-xl leading-none"
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Code content */}
                            <div className="overflow-auto flex-1 p-5">
                                <pre className="text-xs leading-relaxed font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap break-words">
                                    {activeSource.content}
                                </pre>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
