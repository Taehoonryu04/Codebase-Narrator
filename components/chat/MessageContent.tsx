"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), { ssr: false });

const components: Components = {
    code({ className, children, node: _node, ...props }) {
        const lang = /language-(\w+)/.exec(className ?? "")?.[1];
        const codeStr = String(children).replace(/\n$/, "");

        if (lang === "mermaid") {
            return <MermaidDiagram code={codeStr} />;
        }

        if (lang || codeStr.includes("\n")) {
            return (
                <pre className="my-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-x-auto text-xs">
                    <code className="block p-4 font-mono text-neutral-800 dark:text-neutral-200">
                        {codeStr}
                    </code>
                </pre>
            );
        }

        return (
            <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200" {...props}>
                {children}
            </code>
        );
    },
    p({ children }) {
        return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
    },
    ul({ children }) {
        return <ul className="mb-2 pl-4 space-y-1 list-disc">{children}</ul>;
    },
    ol({ children }) {
        return <ol className="mb-2 pl-4 space-y-1 list-decimal">{children}</ol>;
    },
    li({ children }) {
        return <li className="leading-relaxed">{children}</li>;
    },
    h1({ children }) {
        return <h1 className="text-base font-semibold mb-2 mt-3">{children}</h1>;
    },
    h2({ children }) {
        return <h2 className="text-sm font-semibold mb-2 mt-3">{children}</h2>;
    },
    h3({ children }) {
        return <h3 className="text-sm font-medium mb-1 mt-2">{children}</h3>;
    },
    blockquote({ children }) {
        return (
            <blockquote className="my-2 pl-3 border-l-2 border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 italic">
                {children}
            </blockquote>
        );
    },
    strong({ children }) {
        return <strong className="font-semibold">{children}</strong>;
    },
    hr() {
        return <hr className="my-3 border-neutral-200 dark:border-neutral-700" />;
    },
};

export default function MessageContent({ content }: { content: string }) {
    return (
        <div className="text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
