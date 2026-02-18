"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RepoInputForm } from "@/components/analyze/RepoInputForm";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { FloatingPaths } from "@/components/ui/floating-paths";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";

const ANALYSIS_STEPS = [
    { icon: "🔗", label: "Connecting to repository..." },
    { icon: "🗂", label: "Mapping file tree & scoring relevance..." },
    { icon: "📄", label: "Fetching priority source files..." },
    { icon: "🧠", label: "Running deep AI analysis..." },
    { icon: "✨", label: "Finalizing insights..." },
];

/**
 * Inner component that reads search params (must be inside Suspense)
 */
function AnalyzeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResultType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [adminOnly, setAdminOnly] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const autoTriggered = useRef(false);
    const stepTimersRef = useRef<NodeJS.Timeout[]>([]);

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
        setAdminOnly(false);
        setCurrentStep(0);

        // Steps 0→1→2→3 advance quickly (~1.5s each) mirroring fast GitHub API calls.
        // Step 3 ("Running deep AI analysis") holds until Gemini responds.
        // Step 4 ("Finalizing insights") shows briefly after response arrives.
        const timers: NodeJS.Timeout[] = [
            setTimeout(() => setCurrentStep(1), 1500),
            setTimeout(() => setCurrentStep(2), 3000),
            setTimeout(() => setCurrentStep(3), 5000),
        ];
        stepTimersRef.current = timers;
        const clearTimers = () => timers.forEach(clearTimeout);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl: url, maxFiles: 50 }),
            });

            const data = await response.json();

            if (response.status === 403 && data.adminOnly) {
                clearTimers();
                setAdminOnly(true);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            // Step 4: briefly show "Finalizing" before revealing results
            clearTimers();
            setCurrentStep(4);
            await new Promise((resolve) => setTimeout(resolve, 700));
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            clearTimers();
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
                <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-xl mx-auto mt-12"
                    >
                        {/* Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8">
                            {/* Shimmer accent along top */}
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-neutral-900 dark:via-white to-transparent animate-pulse" />

                            {/* Orbital spinner */}
                            <div className="flex justify-center mb-6">
                                <div className="relative h-16 w-16">
                                    {/* Outer ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                                        style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Inner ring (counter-rotate) */}
                                    <motion.div
                                        className="absolute inset-2 rounded-full border-2 border-neutral-300 dark:border-neutral-600"
                                        style={{ borderBottomColor: "transparent", borderLeftColor: "transparent" }}
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Center dot pulse */}
                                    <motion.div
                                        className="absolute inset-5 rounded-full bg-neutral-900 dark:bg-white"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </div>
                            </div>

                            {/* Step label with crossfade */}
                            <div className="text-center mb-6 h-7 relative">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={currentStep}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-lg font-medium text-neutral-800 dark:text-neutral-200 absolute inset-x-0"
                                    >
                                        {ANALYSIS_STEPS[currentStep].icon}{" "}
                                        {ANALYSIS_STEPS[currentStep].label}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Progress dots */}
                            <div className="flex justify-center gap-2 mb-6">
                                {ANALYSIS_STEPS.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`h-2 rounded-full ${
                                            i <= currentStep
                                                ? "bg-neutral-900 dark:bg-white"
                                                : "bg-neutral-300 dark:bg-neutral-700"
                                        }`}
                                        animate={{ width: i === currentStep ? 24 : 8 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    />
                                ))}
                            </div>

                            {/* Subtext */}
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-500">
                                Deep-scanning repository structure, scoring files, and running AI analysis.
                                <br />
                                This may take up to 1–2 minutes for larger repositories.
                            </p>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>

                {/* Admin-only card */}
                {adminOnly && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto mt-12"
                    >
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
                            <h3 className="text-amber-800 dark:text-amber-300 font-semibold mb-2 text-lg">
                                Analysis is currently admin-only
                            </h3>
                            <p className="text-amber-700 dark:text-amber-400 text-sm mb-5">
                                To maintain free-tier infrastructure stability, new analyses are restricted to the
                                administrator. Explore the featured sample to see the full product experience.
                            </p>
                            <button
                                onClick={() => router.push("/samples/codebase-narrator")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm
                                    bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600
                                    text-white transition-colors"
                            >
                                Explore Featured Sample
                                <span>→</span>
                            </button>
                        </div>
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
