"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnalysisResult as AnalysisResultType, AnalysisStats } from "@/lib/types";

interface AnalysisResultProps {
    result: AnalysisResultType;
    stats?: AnalysisStats;
}

/**
 * Analysis Result Display Component
 *
 * Display content:
 * - Repository basic information
 * - AI analysis results (summary, tech stack, architecture, key features)
 * - File structure
 * - Code quality (if available)
 */
export function AnalysisResult({ result, stats }: AnalysisResultProps) {
    const { repoInfo, analysis, fileStructure, analyzedFiles, totalFiles } = result;
    const effectiveStats = stats ?? result.stats;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Repository Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-8 text-white"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{repoInfo.name}</h2>
                        <p className="text-neutral-300 mb-4">{repoInfo.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                            <a
                                href={repoInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 hover:underline"
                            >
                                <span>View on GitHub</span>
                                <span>↗</span>
                            </a>
                            <span>⭐ {repoInfo.stars.toLocaleString()}</span>
                            {repoInfo.language && <span>📝 {repoInfo.language}</span>}
                        </div>
                    </div>
                </div>

                {/* Performance Stats Bar */}
                {effectiveStats && (
                    <div className="mt-5 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium">
                            <span>⏱</span>
                            <span>{(effectiveStats.executionTimeMs / 1000).toFixed(1)}s</span>
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium">
                            <span>🔢</span>
                            <span>{effectiveStats.totalTokens.toLocaleString()} tokens</span>
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium">
                            <span>💰</span>
                            <span>${effectiveStats.estimatedCostUsd.toFixed(4)}</span>
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium">
                            <span>🔍</span>
                            <span>
                                {effectiveStats.filesSent}/{effectiveStats.totalFiles} files
                                {effectiveStats.contextEfficiencyPct > 0 && (
                                    <span className="ml-1 text-neutral-300">
                                        ({effectiveStats.contextEfficiencyPct}% filtered)
                                    </span>
                                )}
                            </span>
                        </span>
                    </div>
                )}

                {/* Topics */}
                {repoInfo.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {repoInfo.topics.map((topic) => (
                            <span
                                key={topic}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* AI Analysis Results - Grid Layout */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">📝</span>
                        Project Summary
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {analysis.summary}
                    </p>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">🛠️</span>
                        Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Architecture */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">🏗️</span>
                        Architecture
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">{analysis.architecture}</p>
                </motion.div>

                {/* Key Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">⚡</span>
                        Key Features
                    </h3>
                    <ul className="space-y-2">
                        {analysis.keyFeatures.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-start text-neutral-700 dark:text-neutral-300"
                            >
                                <span className="mr-2 mt-1">•</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Code Quality (if available) */}
                {analysis.codeQuality && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                            <span className="mr-2">✨</span>
                            Code Quality
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        Overall Score
                                    </span>
                                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {analysis.codeQuality.score}/100
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                                        style={{ width: `${analysis.codeQuality.score}%` }}
                                    />
                                </div>
                            </div>

                            {analysis.codeQuality.strengths.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                                        Strengths
                                    </h4>
                                    <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                                        {analysis.codeQuality.strengths.map((strength, index) => (
                                            <li key={index}>+ {strength}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {analysis.codeQuality.improvements.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">
                                        Areas for Improvement
                                    </h4>
                                    <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                                        {analysis.codeQuality.improvements.map((improvement, index) => (
                                            <li key={index}>→ {improvement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Data Flow (if available) */}
                {analysis.dataFlow && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                            <span className="mr-2">🔄</span>
                            Data Flow
                        </h3>
                        <p className="text-neutral-700 dark:text-neutral-300">{analysis.dataFlow}</p>
                    </motion.div>
                )}

                {/* Entry Points (if available) */}
                {analysis.entryPoints && analysis.entryPoints.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                            <span className="mr-2">🚀</span>
                            Entry Points
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.entryPoints.map((entry) => (
                                <span
                                    key={entry}
                                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-mono text-neutral-700 dark:text-neutral-300"
                                >
                                    {entry}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* File Structure */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">📁</span>
                        File Structure
                    </h3>
                    {analyzedFiles != null && totalFiles != null && (
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {analyzedFiles} analyzed / {totalFiles} detected
                        </span>
                    )}
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <ul className="space-y-1 font-mono text-sm text-neutral-700 dark:text-neutral-300">
                        {fileStructure.map((file) => (
                            <li key={file.path} className="flex items-center">
                                <span className="mr-2">{file.type === "dir" ? "📁" : "📄"}</span>
                                <span>{file.path}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    );
}
