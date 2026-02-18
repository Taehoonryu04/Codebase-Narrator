"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
    AnalysisResult as AnalysisResultType,
    AnalysisStats,
    AuditSeverity,
    HealthAudit,
} from "@/lib/types";

interface AnalysisResultProps {
    result: AnalysisResultType;
    stats?: AnalysisStats;
}

// ─── Severity Badge ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
    AuditSeverity,
    { label: string; classes: string }
> = {
    critical: {
        label: "Critical",
        classes:
            "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    },
    high: {
        label: "Warning",
        classes:
            "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    },
    medium: {
        label: "Info",
        classes:
            "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    },
    low: {
        label: "Low",
        classes:
            "bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
    },
};

function SeverityBadge({ severity }: { severity: AuditSeverity }) {
    const cfg = SEVERITY_CONFIG[severity];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}>
            {cfg.label}
        </span>
    );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({
    score,
    label,
    color,
}: {
    score: number;
    label: string;
    color: string;
}) {
    const r = 30;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="80" height="80" className="-rotate-90">
                <circle
                    cx="40"
                    cy="40"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-neutral-200 dark:text-neutral-700"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                />
            </svg>
            <span className="text-2xl font-bold text-neutral-900 dark:text-white -mt-14">
                {score}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-8">
                {label}
            </span>
        </div>
    );
}

// ─── Finding Card ─────────────────────────────────────────────────────────────

interface FindingCardProps {
    severity: AuditSeverity;
    title: string;
    description: string;
    file?: string;
    recommendation: string;
    badge?: string;
}

function FindingCard({ severity, title, description, file, recommendation, badge }: FindingCardProps) {
    const leftBar: Record<AuditSeverity, string> = {
        critical: "border-l-red-500",
        high: "border-l-orange-400",
        medium: "border-l-blue-400",
        low: "border-l-neutral-400",
    };

    return (
        <div
            className={`border-l-4 ${leftBar[severity]} bg-white dark:bg-neutral-900 rounded-r-xl border border-l-0 border-neutral-200 dark:border-neutral-800 p-4 space-y-2`}
        >
            <div className="flex items-center gap-2 flex-wrap">
                <SeverityBadge severity={severity} />
                {badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        {badge}
                    </span>
                )}
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            {file && (
                <code className="text-xs text-neutral-500 dark:text-neutral-500 font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {file}
                </code>
            )}
            <div className="flex items-start gap-1.5 pt-1">
                <span className="text-green-500 text-xs mt-0.5 shrink-0">→</span>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">{recommendation}</p>
            </div>
        </div>
    );
}

// ─── Health Audit Tab ─────────────────────────────────────────────────────────

function HealthAuditTab({ audit }: { audit: HealthAudit }) {
    return (
        <div className="space-y-8">
            {/* Score overview */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-6">
                    Health Scores
                </h3>
                <div className="flex justify-around flex-wrap gap-6">
                    <ScoreRing
                        score={audit.security.score}
                        label="Security"
                        color="#ef4444"
                    />
                    <ScoreRing
                        score={audit.maintainability.index}
                        label="Maintainability"
                        color="#3b82f6"
                    />
                    <ScoreRing
                        score={audit.architecture.rating}
                        label="Architecture"
                        color="#a855f7"
                    />
                </div>
                {audit.architecture.pattern && (
                    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                        Detected pattern:{" "}
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            {audit.architecture.pattern}
                        </span>
                    </p>
                )}
            </div>

            {/* Security findings */}
            <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                    <span>🔒</span> Security
                </h3>
                {audit.security.findings.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No security issues detected.</p>
                ) : (
                    <div className="space-y-3">
                        {audit.security.findings.map((f, i) => (
                            <FindingCard key={i} {...f} />
                        ))}
                    </div>
                )}
            </div>

            {/* Maintainability findings */}
            <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                    <span>🔧</span> Maintainability
                </h3>
                {audit.maintainability.findings.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No maintainability issues detected.</p>
                ) : (
                    <div className="space-y-3">
                        {audit.maintainability.findings.map((f, i) => (
                            <FindingCard
                                key={i}
                                severity={f.severity}
                                title={f.title}
                                description={f.description}
                                file={f.file}
                                recommendation={f.recommendation}
                                badge={f.type.replace(/_/g, " ")}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Architecture findings */}
            <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                    <span>🏛️</span> Architecture
                </h3>
                {audit.architecture.findings.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No architectural concerns detected.</p>
                ) : (
                    <div className="space-y-3">
                        {audit.architecture.findings.map((f, i) => (
                            <FindingCard key={i} {...f} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ result }: { result: AnalysisResultType }) {
    const { analysis, fileStructure, analyzedFiles, totalFiles } = result;

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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

            {/* Code Quality */}
            {analysis.codeQuality && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
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
                                    {analysis.codeQuality.strengths.map((s, i) => (
                                        <li key={i}>+ {s}</li>
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
                                    {analysis.codeQuality.improvements.map((imp, i) => (
                                        <li key={i}>→ {imp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Data Flow */}
            {analysis.dataFlow && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
                >
                    <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white flex items-center">
                        <span className="mr-2">🔄</span>
                        Data Flow
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">{analysis.dataFlow}</p>
                </motion.div>
            )}

            {/* Entry Points */}
            {analysis.entryPoints && analysis.entryPoints.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
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

            {/* File Structure */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
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

// ─── Root Component ───────────────────────────────────────────────────────────

type Tab = "overview" | "health";

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "health", label: "Health Audit", icon: "🩺" },
];

export function AnalysisResult({ result, stats }: AnalysisResultProps) {
    const { repoInfo, analysis } = result;
    const effectiveStats = stats ?? result.stats;
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const hasAudit = !!analysis.healthAudit;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
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

            {/* Tab Bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-0"
            >
                {TABS.map((tab) => {
                    const disabled = tab.id === "health" && !hasAudit;
                    const active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => !disabled && setActiveTab(tab.id)}
                            disabled={disabled}
                            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors select-none
                                ${active
                                    ? "text-neutral-900 dark:text-white"
                                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                                }
                                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {disabled && (
                                <span className="text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">
                                    N/A
                                </span>
                            )}
                            {active && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === "overview" ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.18 }}
                    >
                        <OverviewTab result={result} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="health"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.18 }}
                    >
                        {analysis.healthAudit ? (
                            <HealthAuditTab audit={analysis.healthAudit} />
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
