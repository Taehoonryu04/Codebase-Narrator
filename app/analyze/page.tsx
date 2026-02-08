"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { RepoInputForm } from "@/components/analyze/RepoInputForm";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { FloatingPaths } from "@/components/ui/floating-paths";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";

/**
 * Inner component that reads search params (must be inside Suspense)
 */
function AnalyzeContent() {
    const searchParams = useSearchParams();
    const [repoUrl, setRepoUrl] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResultType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const autoTriggered = useRef(false);

    // Auto-analyze from query params (e.g., from History re-analyze)
    useEffect(() => {
        const repoParam = searchParams.get("repo");
        const autoParam = searchParams.get("auto");

        if (repoParam && autoParam === "true" && !autoTriggered.current) {
            autoTriggered.current = true;
            handleAnalyze(repoParam);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleAnalyze = async (url: string) => {
        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setRepoUrl(url);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    repoUrl: url,
                    maxFiles: 50,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsAnalyzing(false);
        }
    };

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
                        Repository Analysis
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-600 dark:text-neutral-400 mt-2"
                    >
                        Enter a GitHub URL and AI will analyze the codebase
                    </motion.p>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-12">
                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <RepoInputForm
                        onSubmit={handleAnalyze}
                        isLoading={isAnalyzing}
                        initialUrl={searchParams.get("repo") ?? ""}
                    />
                </motion.div>

                {/* Loading State */}
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto mt-12 text-center"
                    >
                        <div className="inline-flex items-center justify-center space-x-2 text-neutral-600 dark:text-neutral-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white" />
                            <span className="text-lg font-medium">Analyzing...</span>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-4">
                            Fetching repository information and performing AI analysis.
                            <br />
                            Please wait (approximately 10-30 seconds)
                        </p>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto mt-12"
                    >
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                            <h3 className="text-red-900 dark:text-red-200 font-semibold mb-2">
                                Analysis Failed
                            </h3>
                            <p className="text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Analysis Result */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12"
                    >
                        <AnalysisResult result={result} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}

/**
 * Analysis Page (Client Component)
 *
 * Wrapped in Suspense for useSearchParams() support.
 * Supports auto-analyze via query params: ?repo={url}&auto=true
 */
export default function AnalyzePage() {
    return (
        <Suspense fallback={
            <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white" />
            </div>
        }>
            <AnalyzeContent />
        </Suspense>
    );
}
