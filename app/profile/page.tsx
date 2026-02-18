"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface RateLimitEntry {
    current: number;
    limit: number;
    remaining: number;
    resetAt: string;
}

interface UsageStats {
    analysis: RateLimitEntry;
    chat: RateLimitEntry;
}

function UsageBar({ label, current, limit }: { label: string; current: number; limit: number }) {
    const pct = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
    const isHigh = pct >= 80;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                    {current} / {limit === 9999 ? "∞" : limit}
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${
                        limit === 9999
                            ? "bg-gradient-to-r from-blue-500 to-purple-500"
                            : isHigh
                            ? "bg-gradient-to-r from-amber-500 to-red-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${limit === 9999 ? 0 : pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

function DeleteModal({
    onCancel,
    onConfirm,
    loading,
}: {
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    const [inputValue, setInputValue] = useState("");
    const isConfirmed = inputValue === "delete";

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
                className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-6"
                initial={{ scale: 0.95, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-center text-neutral-900 dark:text-white mb-2">
                    Delete Account
                </h2>
                <p className="text-sm text-center text-neutral-600 dark:text-neutral-400 mb-6">
                    This will permanently delete your account, all analysis history, and vector embeddings. This action cannot be undone.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Type <span className="font-mono font-bold text-red-600 dark:text-red-400">delete</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="delete"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!isConfirmed || loading}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete Account"
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const [usage, setUsage] = useState<UsageStats | null>(null);
    const [usageLoading, setUsageLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [signOutLoading, setSignOutLoading] = useState(false);

    // Auth guard
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading, router]);

    const fetchUsage = useCallback(async () => {
        try {
            const res = await fetch("/api/rate-limit");
            if (res.ok) {
                const data = await res.json();
                setUsage(data);
            }
        } catch {
            // Non-blocking — usage display is best-effort
        } finally {
            setUsageLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchUsage();
    }, [user, fetchUsage]);

    const handleSignOut = async () => {
        setSignOutLoading(true);
        try {
            await signOut();
            router.push("/");
        } catch {
            setSignOutLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            const res = await fetch("/api/user", { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Deletion failed");
            }
            // Clear local session — ignore errors since the account is already
            // deleted server-side and the token is no longer valid.
            try { await signOut(); } catch { /* session already invalidated */ }
            router.push("/");
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Something went wrong");
            setDeleteLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    const githubUsername = user.user_metadata?.user_name || user.email?.split("@")[0] || "User";
    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const email = user.email;
    const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            {/* Floating background — matches other pages */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="min-h-screen py-12 px-4">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Manage your account and view usage
                        </p>
                    </motion.div>

                    {/* User Info Card */}
                    <motion.div
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                    >
                        <div className="flex items-center gap-4">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={githubUsername}
                                    className="w-16 h-16 rounded-full ring-2 ring-blue-500/20"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-blue-500/20">
                                    <span className="text-2xl font-bold text-white">
                                        {githubUsername[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                                    {githubUsername}
                                </p>
                                {email && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                                        {email}
                                    </p>
                                )}
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                    Member since {memberSince}
                                </p>
                            </div>
                            {/* GitHub badge */}
                            <div className="ml-auto flex-shrink-0">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                                    </svg>
                                    GitHub
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Usage Dashboard */}
                    <motion.div
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div>
                            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                                Usage (today)
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Resets every 24 hours
                            </p>
                        </div>

                        {usageLoading ? (
                            <div className="space-y-4">
                                <div className="h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                                <div className="h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                            </div>
                        ) : usage ? (
                            <>
                                <UsageBar
                                    label="Repository Analyses"
                                    current={usage.analysis.current}
                                    limit={usage.analysis.limit}
                                />
                                <UsageBar
                                    label="Chat Messages"
                                    current={usage.chat.current}
                                    limit={usage.chat.limit}
                                />
                            </>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Unable to load usage data.
                            </p>
                        )}

                        {/* Sustainability note */}
                        <div className="flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                To ensure sustainability on our free-tier infrastructure, new analyses are currently limited. Contact the admin for higher limits.
                            </p>
                        </div>
                    </motion.div>

                    {/* Account Actions */}
                    <motion.div
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                            Account
                        </h2>

                        {/* Sign Out */}
                        <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">Sign out</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    End your current session
                                </p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                disabled={signOutLoading}
                                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {signOutLoading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : null}
                                Sign out
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete account</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Permanently remove your account and all data
                                </p>
                            </div>
                            <button
                                onClick={() => { setDeleteError(null); setShowDeleteModal(true); }}
                                className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>

                        {deleteError && (
                            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
                                {deleteError}
                            </p>
                        )}
                    </motion.div>

                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteModal
                        onCancel={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteAccount}
                        loading={deleteLoading}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
