"use client";

import { useEffect, useId, useState } from "react";

interface MermaidDiagramProps {
    code: string;
}

// Fix common AI-generated Mermaid violations before passing to the renderer.
function sanitizeMermaid(raw: string): string {
    return raw
        .split("\n")
        .map((line) => {
            // Strip trailing semicolons (AI often adds them; not valid in flowchart TD)
            line = line.replace(/;\s*$/, "");
            // Remove parentheses inside square-bracket labels [...]
            line = line.replace(/\[([^\]]*)\]/g, (_, inner) => `[${inner.replace(/[()]/g, "")}]`);
            // Remove parentheses inside curly-brace labels {...}
            line = line.replace(/\{([^}]*)\}/g, (_, inner) => `{${inner.replace(/[()]/g, "")}}`);
            // Replace dots in node IDs (e.g. D6.1 -> D6_1).
            // Node IDs appear at the start of a line or after whitespace, before [ { ( --> ---
            line = line.replace(/\b(\w+)\.(\w+)\b(?=\s*(?:[\[{(]|-->|--))/g, "$1_$2");
            return line;
        })
        .join("\n");
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
    const id = useId().replace(/:/g, "_");
    const [error, setError] = useState<string | null>(null);
    const [svgContent, setSvgContent] = useState<string>("");
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const mermaid = (await import("mermaid")).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
                    securityLevel: "loose",
                });
                const { svg } = await mermaid.render(`mermaid_${id}`, sanitizeMermaid(code));
                if (!cancelled) setSvgContent(svg);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to render diagram");
            }
        })();
        return () => { cancelled = true; };
    }, [code, id]);

    const handleDownload = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.svg";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (error) {
        return (
            <div className="my-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Diagram (parse error — showing source)
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {code}
                </pre>
            </div>
        );
    }

    if (!svgContent) {
        return (
            <div className="my-3 flex items-center gap-2 text-xs text-neutral-400">
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Rendering diagram…
            </div>
        );
    }

    return (
        <>
            <div className="my-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-xs text-neutral-400 font-medium">Diagram</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            title="Download SVG"
                            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
                        >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 2v8M5 7l3 3 3-3M2 12h12" />
                            </svg>
                            SVG
                        </button>
                        <button
                            onClick={() => setFullscreen(true)}
                            title="Full screen"
                            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
                        >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3" />
                            </svg>
                            Expand
                        </button>
                    </div>
                </div>
                {/* Diagram */}
                <div
                    className="overflow-x-auto p-4 flex justify-center"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            </div>

            {/* Fullscreen modal */}
            {fullscreen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setFullscreen(false)}
                >
                    <div
                        className="bg-white dark:bg-neutral-950 rounded-2xl max-w-[90vw] max-h-[90vh] overflow-auto shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Diagram</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex items-center gap-1.5"
                                >
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 2v8M5 7l3 3 3-3M2 12h12" />
                                    </svg>
                                    Download SVG
                                </button>
                                <button
                                    onClick={() => setFullscreen(false)}
                                    className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                                >
                                    ✕ Close
                                </button>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                    </div>
                </div>
            )}
        </>
    );
}
