"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl pointer-events-auto">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors text-xl leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            {/* Header */}
                            <div className="mb-5">
                                <div className="text-3xl mb-2">☕</div>
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                    Support Codebase Narrator
                                </h2>
                            </div>

                            {/* Main message */}
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
                                This project runs on Gemini Free Tier. Every donation goes{" "}
                                <strong className="text-neutral-800 dark:text-neutral-200">directly</strong> toward
                                upgrading the API plan — which will increase quotas and open full analysis access to
                                the public.
                            </p>

                            {/* Info box */}
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 mb-5">
                                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-amber-500">•</span>
                                        Higher API quotas → more analyses per day
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-amber-500">•</span>
                                        Full public access to live repository analysis
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5 text-amber-500">•</span>
                                        Donors receive admin-level access (full analysis + chat)
                                    </li>
                                </ul>
                            </div>

                            {/* Donor access note */}
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-6 leading-relaxed">
                                After donating, send me a DM on GitHub (
                                <a
                                    href="https://github.com/Taehoonryu04"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                                >
                                    @Taehoonryu04
                                </a>
                                ) with your email to activate full access.
                            </p>

                            {/* CTA row */}
                            <div className="flex gap-3 flex-wrap">
                                <a
                                    href="https://buymeacoffee.com/taehoonryu04"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                                        bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                                >
                                    ☕ Buy Me a Coffee
                                </a>
                                <Link
                                    href="/samples/codebase-narrator"
                                    onClick={onClose}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                                        border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300
                                        hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Explore Sample →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
