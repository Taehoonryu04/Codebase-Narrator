"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export interface HistoryItem {
    id: string;
    repoUrl: string;
    repoOwner: string;
    repoName: string;
    repoFullName: string;
    analyzedFiles: number;
    totalFiles: number;
    analyzedAt: string;
}

interface HistoryCardProps {
    item: HistoryItem;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

function getRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

export function HistoryCard({ item, onDelete, isDeleting }: HistoryCardProps) {
    const router = useRouter();

    const handleReanalyze = () => {
        const params = new URLSearchParams({
            repo: item.repoUrl,
            auto: "true",
        });
        router.push(`/analyze?${params.toString()}`);
    };

    const handleDelete = () => {
        if (confirm(`Delete analysis history for ${item.repoFullName}?`)) {
            onDelete(item.id);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-4">
                {/* Repo Info */}
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
                        {item.repoFullName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <span title={new Date(item.analyzedAt).toLocaleString()}>
                            {getRelativeTime(item.analyzedAt)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                        <span>
                            {item.analyzedFiles}/{item.totalFiles} files analyzed
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleReanalyze}
                        className="px-4 py-2 text-sm font-medium rounded-lg
                            bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                            hover:bg-neutral-800 dark:hover:bg-neutral-100
                            transition-colors"
                    >
                        Re-analyze
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-2 text-sm rounded-lg
                            text-red-600 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-900/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
