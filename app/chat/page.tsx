"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingPaths } from "@/components/ui/floating-paths";
import Link from "next/link";

interface HistoryItem {
    id: string;
    repoFullName: string;
    repoUrl: string;
    analyzedAt: string;
}

interface ChatMessage {
    role: "user" | "model";
    content: string;
    sources?: string[];
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
    const [error, setError] = useState<string | null>(null);
    const [chatRemaining, setChatRemaining] = useState<number | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Failed to get response");
                // Remove the user message on error
                setMessages(messages);
                return;
            }

            setMessages([
                ...newMessages,
                { role: "model", content: data.reply, sources: data.sources ?? [] },
            ]);
            setChatRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
        } catch {
            setError("Network error. Please try again.");
            setMessages(messages);
        } finally {
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
                            href="/history"
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
                        >
                            &larr; History
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
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            <div className="max-w-3xl mx-auto space-y-4">
                                {messages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16 text-neutral-400 dark:text-neutral-600"
                                    >
                                        <p className="text-lg font-medium mb-2">Ask anything about the codebase</p>
                                        <p className="text-sm">e.g. &ldquo;How does authentication work?&rdquo; or &ldquo;Explain the data flow&rdquo;</p>
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
                                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                                                        ${msg.role === "user"
                                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-br-sm"
                                                            : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-bl-sm shadow-sm"
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>

                                                {/* Sources */}
                                                {msg.role === "model" && msg.sources && msg.sources.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {msg.sources.map((src) => (
                                                            <span
                                                                key={src}
                                                                className="inline-block text-xs px-2 py-0.5 rounded-full
                                                                    bg-neutral-100 dark:bg-neutral-800
                                                                    text-neutral-500 dark:text-neutral-400
                                                                    border border-neutral-200 dark:border-neutral-700"
                                                            >
                                                                {src}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Typing indicator */}
                                {sending && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                            <div className="flex gap-1 items-center h-4">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                    />
                                                ))}
                                            </div>
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
                        <div className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm px-4 py-4 shrink-0">
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
                                        placeholder:text-neutral-400 dark:placeholder:text-neutral-600
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
                            <p className="max-w-3xl mx-auto mt-1.5 text-xs text-neutral-400 dark:text-neutral-600">
                                Enter to send &middot; Shift+Enter for new line
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
