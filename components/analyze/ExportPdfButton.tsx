"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { AnalysisPdfDocument } from "./AnalysisPdfDocument";
import type { AnalysisResult, AnalysisStats } from "@/lib/types";

interface ExportPdfButtonProps {
    result: AnalysisResult;
    stats?: AnalysisStats;
}

export function ExportPdfButton({ result, stats }: ExportPdfButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleExport() {
        if (loading) return;
        setLoading(true);
        try {
            const generatedAt = new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            const blob = await pdf(
                <AnalysisPdfDocument
                    result={result}
                    stats={stats}
                    generatedAt={generatedAt}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${result.repoInfo.name}-analysis.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium text-white transition-colors"
        >
            {loading ? (
                <>
                    <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Generating…</span>
                </>
            ) : (
                <>
                    <span>↓</span>
                    <span>Export PDF</span>
                </>
            )}
        </button>
    );
}
