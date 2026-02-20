"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingPaths } from "@/components/ui/floating-paths";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import MessageContent from "@/components/chat/MessageContent";
import { SAMPLE_ANALYSIS, SAMPLE_QA } from "@/data/sample-analysis";
import type { SourceChunk, SampleQA } from "@/data/sample-analysis";

type Tab = "analysis" | "chat";

const PAGE_TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "analysis", label: "Analysis", icon: "📊" },
    { id: "chat", label: "Chat Demo", icon: "💬" },
];

export default function SamplePage() {
    const [activeTab, setActiveTab] = useState<Tab>("analysis");

    // Chat demo state
    const [sending, setSending] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
    const [completedAnswer, setCompletedAnswer] = useState<{
        content: string;
        sources: SourceChunk[];
    } | null>(null);
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
    const [activeSource, setActiveSource] = useState<SourceChunk | null>(null);

    // Typewriter buffer refs (mirrors app/chat/page.tsx exactly)
    const bufferRef = useRef<string>("");
    const displayedRef = useRef<string>("");
    const streamDoneRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sourcesRef = useRef<SourceChunk[]>([]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const playAnswer = useCallback((qa: SampleQA) => {
        // Stop any running typewriter
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Reset visible state
        setCompletedAnswer(null);
        setStreamingMessage("");
        setSending(true);
        setActiveQuestion(qa.id);
        setActiveSource(null);

        // Load buffer with the full answer (same as SSE chunk accumulation)
        bufferRef.current = qa.answer;
        displayedRef.current = "";
        sourcesRef.current = qa.sources;
        streamDoneRef.current = true; // already "done" — no SSE to wait for

        intervalRef.current = setInterval(() => {
            if (bufferRef.current.length === 0) {
                if (streamDoneRef.current) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    // Read final values synchronously — same pattern as chat page
                    const finalContent = displayedRef.current;
                    const sources = sourcesRef.current;
                    setCompletedAnswer({ content: finalContent, sources });
                    setStreamingMessage(null);
                    setSending(false);
                }
                return;
            }
            // Dynamic speed: drain faster when buffer builds up (identical to chat page)
            const charsToShow =
                bufferRef.current.length > 200 ? 6
                : bufferRef.current.length > 80 ? 3
                : 1;
            const chars = bufferRef.current.slice(0, charsToShow);
            bufferRef.current = bufferRef.current.slice(charsToShow);
            displayedRef.current += chars;
            setStreamingMessage((prev) => (prev !== null ? prev + chars : chars));
        }, 16); // ~60fps base tick
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
            {/* Fixed Background */}
            <div className="fixed inset-0 pointer-events-none">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 py-6">
                    <motion.a
                        href="/"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                        <span className="mr-2">←</span>
                        <span className="font-medium">Back to Home</span>
                    </motion.a>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mt-4 text-neutral-900 dark:text-white"
                    >
                        Featured Sample
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-600 dark:text-neutral-400 mt-2"
                    >
                        Real AI analysis of{" "}
                        <a
                            href="https://github.com/Taehoonryu04/codebase-narrator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            Taehoonryu04/codebase-narrator
                        </a>{" "}
                        — no login required.
                    </motion.p>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                {/* Page-level tab bar */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 mb-8"
                >
                    {PAGE_TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors select-none cursor-pointer
                                    ${active
                                        ? "text-neutral-900 dark:text-white"
                                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {active && (
                                    <motion.div
                                        layoutId="sample-tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    {activeTab === "analysis" ? (
                        <motion.div
                            key="analysis-tab"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.18 }}
                        >
                            {/* Sample banner */}
                            <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-5 py-4 flex items-start gap-3">
                                <span className="text-amber-500 text-lg shrink-0 mt-0.5">⚠</span>
                                <div>
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        Sample Repository
                                    </p>
                                    <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
                                        This is a pre-generated analysis of the Codebase Narrator project itself.
                                        All content was produced by a real Gemini 2.5 Flash analysis run — not
                                        fabricated. New analyses are currently restricted to the administrator.
                                        The underlying model is updated periodically, so analysis quality can improve over time.
                                    </p>
                                </div>
                            </div>

                            <AnalysisResult result={SAMPLE_ANALYSIS} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-tab"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.18 }}
                        >
                            {/* Chat banner */}
                            <div className="mb-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-5 py-4 flex items-start gap-3">
                                <span className="text-blue-500 text-lg shrink-0 mt-0.5">💡</span>
                                <div>
                                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                        Sample Chat
                                    </p>
                                    <p className="mt-0.5 text-sm text-blue-700 dark:text-blue-400">
                                        These are curated responses from a real RAG chat session on this codebase.
                                        Click a question to see the AI response with source traceability.
                                        Live responses vary each run — the AI is non-deterministic.
                                        The underlying model is updated periodically, so answer quality can improve over time.
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Question buttons */}
                                <div className="flex flex-col gap-2">
                                    {SAMPLE_QA.map((qa) => (
                                        <button
                                            key={qa.id}
                                            onClick={() => !sending && playAnswer(qa)}
                                            disabled={sending}
                                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all
                                                ${activeQuestion === qa.id
                                                    ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                                                    : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                                }
                                                disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <span className="mr-2 opacity-60">❓</span>
                                            {qa.question}
                                        </button>
                                    ))}
                                </div>

                                {/* Chat bubble area */}
                                <AnimatePresence>
                                    {/* Streaming bubble */}
                                    {sending && (
                                        <motion.div
                                            key="streaming-bubble"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="flex justify-start"
                                        >
                                            <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm text-sm leading-relaxed text-neutral-900 dark:text-white whitespace-pre-wrap">
                                                {streamingMessage && streamingMessage.length > 0 ? (
                                                    <>
                                                        {streamingMessage}
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

                                    {/* Completed answer bubble */}
                                    {completedAnswer && !sending && (
                                        <motion.div
                                            key="completed-bubble"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm text-sm leading-relaxed text-neutral-900 dark:text-white">
                                                <MessageContent content={completedAnswer.content} />
                                            </div>

                                            {/* Source chips */}
                                            {completedAnswer.sources.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {Array.from(
                                                        new Map(
                                                            completedAnswer.sources.map((s) => [s.filePath, s])
                                                        ).values()
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
                                        </motion.div>
                                    )}

                                    {/* Empty state */}
                                    {!sending && !completedAnswer && (
                                        <motion.div
                                            key="empty-state"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-12 text-neutral-400 dark:text-neutral-500 text-sm"
                                        >
                                            Select a question above to see a sample AI response.
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Source viewer modal — identical to app/chat/page.tsx */}
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
