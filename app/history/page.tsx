"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingPaths } from "@/components/ui/floating-paths";
import { HistoryCard, type HistoryItem } from "@/components/history/HistoryCard";
import Link from "next/link";

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch("/api/history");
            if (!res.ok) {
                throw new Error("Failed to fetch history");
            }
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchHistory();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, fetchHistory]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete");
            }
            setHistory((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete");
        } finally {
            setDeletingId(null);
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
                        <span className="mr-2">&larr;</span>
                        <span className="font-medium">Back to Home</span>
                    </motion.a>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mt-4 text-neutral-900 dark:text-white"
                    >
                        Analysis History
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-600 dark:text-neutral-400 mt-2"
                    >
                        Your previously analyzed repositories
                    </motion.p>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Auth Loading */}
                    {authLoading && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center gap-2 text-neutral-500">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900 dark:border-white" />
                                <span>Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Not Authenticated */}
                    {!authLoading && !user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 shadow-lg">
                                <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                    Sign in to view your history
                                </p>
                                <p className="text-neutral-500 dark:text-neutral-400">
                                    Sign in with GitHub to see your past analyses and re-analyze repositories.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Loading */}
                    {user && loading && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center gap-2 text-neutral-500">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900 dark:border-white" />
                                <span>Loading history...</span>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {user && !loading && !error && history.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 shadow-lg">
                                <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                    No analyses yet
                                </p>
                                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                                    Start by analyzing a GitHub repository.
                                </p>
                                <Link
                                    href="/analyze"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                                        bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                                        hover:bg-neutral-800 dark:hover:bg-neutral-100
                                        font-semibold transition-colors"
                                >
                                    <span>Go to Analyze</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* History List */}
                    {user && !loading && history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {history.map((item) => (
                                    <HistoryCard
                                        key={item.id}
                                        item={item}
                                        onDelete={handleDelete}
                                        isDeleting={deletingId === item.id}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
