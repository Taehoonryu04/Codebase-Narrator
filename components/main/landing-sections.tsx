"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { DonationModal } from "@/components/main/DonationModal";

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────────
function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ── Auth badge ────────────────────────────────────────────────────────────────
function Badge({ type }: { type: "free" | "login" }) {
    if (type === "free") {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
                bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400
                border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Free · No login required
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
            bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400
            border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Requires GitHub sign-in
        </span>
    );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({
    step,
    title,
    description,
    detail,
    auth,
    delay,
}: {
    step: string;
    title: string;
    description: string;
    detail: string;
    auth: "free" | "login";
    delay: number;
}) {
    return (
        <Reveal delay={delay} className="h-full">
            <div className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                        {step}
                    </span>
                    <Badge type={auth} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                    {description}
                </p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    {detail}
                </p>
            </div>
        </Reveal>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
    return (
        <Reveal delay={delay} className="text-center">
            <div className="py-8 px-4">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {value}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{label}</div>
            </div>
        </Reveal>
    );
}

// ── Animated chat mockup ──────────────────────────────────────────────────────
function ChatPreview() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const messages = [
        { role: "user", text: "How does authentication work in this repo?" },
        { role: "ai",   text: "Authentication uses NextAuth.js v5 with GitHub OAuth. The flow starts in lib/auth/ → NextAuth config → Supabase session storage. Provider tokens are passed through to enable private repo access." },
        { role: "user", text: "Which files handle rate limiting?" },
        { role: "ai",   text: "Rate limiting lives in lib/rate-limit.ts. It uses a Prisma RateLimit table to track analysisCount and chatCount per user in 24-hour rolling windows, returning 429 with Retry-After headers when exceeded." },
    ];

    const sourceChips = [
        { file: "lib/rate-limit.ts", line: "12", badge: "both", color: "violet" },
        { file: "app/api/analyze/route.ts", line: "58", badge: "vector", color: "blue" },
    ];

    return (
        <div ref={ref} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-lg">
            <div className="border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">Codebase Chat — vercel/next.js</span>
            </div>
            <div className="p-4 space-y-3">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.25 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed
                            ${msg.role === "user"
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {/* Source citation chips */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.4 }}
                    className="flex flex-wrap gap-1.5 pt-1"
                >
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 self-center mr-1">Sources:</span>
                    {sourceChips.map((chip) => (
                        <span key={chip.file} className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors
                            ${chip.color === "violet"
                                ? "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50"
                                : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                            }`}>
                            <span>{chip.file}:{chip.line}</span>
                            <span className={`text-[9px] font-semibold px-1 rounded
                                ${chip.color === "violet" ? "text-violet-500 dark:text-violet-400" : "text-blue-500 dark:text-blue-400"}`}>
                                {chip.badge}
                            </span>
                        </span>
                    ))}
                </motion.div>
                {/* Per-message stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1.6 }}
                    className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-600 pt-0.5"
                >
                    <span>RAG 1.2s</span>
                    <span>·</span>
                    <span>842 tokens</span>
                    <span>·</span>
                    <span>$0.0001</span>
                </motion.div>
            </div>
        </div>
    );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function LandingSections() {
    const [showDonation, setShowDonation] = useState(false);

    return (
        <div className="bg-white dark:bg-neutral-950">

            {/* ── Access tiers ──────────────────────────────── */}
            <section className="py-16 px-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                <div className="container mx-auto max-w-4xl">
                    <Reveal className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">What you can do</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">Some features are free. Others unlock after signing in.</p>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Free */}
                        <Reveal delay={0.1}>
                            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-neutral-900 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">Free · No login required</span>
                                </div>
                                <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                                    {[
                                        "Analyze any public GitHub repository",
                                        "Full AI codebase breakdown (architecture, tech stack, data flow)",
                                        "Code quality score with actionable feedback",
                                        "Key features and entry point detection",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <svg className="mt-0.5 w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 16 16">
                                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                        {/* Login required */}
                        <Reveal delay={0.2}>
                            <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-neutral-900 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400 tracking-wide uppercase">Requires GitHub sign-in</span>
                                </div>
                                <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                                    {[
                                        "Analyze private repositories using your GitHub token",
                                        "Save analysis history — revisit any past result",
                                        "Codebase Chat — ask questions about any analyzed repo",
                                        "Rate limits: 1 analysis · 2 chats per day (donors: 5 analyses · 20 chats)",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <svg className="mt-0.5 w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 16 16">
                                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── Current Status ────────────────────────────── */}
            <section className="py-8 px-4 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/40">
                <div className="container mx-auto max-w-4xl">
                    <Reveal>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">Current Status</span>
                                </div>
                                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                    Live analysis runs on a free-tier Gemini API quota. Until a donation funds an API upgrade,
                                    new analyses are restricted to the administrator.{" "}
                                    <strong className="font-semibold">Donors receive full access immediately</strong>{" "}
                                    — 5 analyses and 20 chats per day. Try the sample below to see the full feature set.
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0 flex-wrap">
                                <button
                                    onClick={() => setShowDonation(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                                        bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600
                                        text-white transition-colors"
                                >
                                    ☕ Support
                                </button>
                                <Link
                                    href="/samples/codebase-narrator"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                                        border border-amber-400 dark:border-amber-600
                                        text-amber-700 dark:text-amber-400
                                        hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                                >
                                    Try Sample →
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Reveal className="text-center mb-16">
                        <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">How it works</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-neutral-900 dark:text-white">
                            From URL to insight in seconds
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-lg max-w-2xl mx-auto">
                            Paste any GitHub repository URL and get a deep, AI-powered breakdown of the entire codebase.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            step="Step 01"
                            title="Paste a GitHub URL"
                            description="Public repositories work without any account — 1 free analysis per day as a guest. Sign in with GitHub to save history and analyze private repositories."
                            detail="Supports any github.com/owner/repo URL. No cloning, no local setup required."
                            auth="free"
                            delay={0.1}
                        />
                        <FeatureCard
                            step="Step 02"
                            title="AI reads every file"
                            description="Gemini 2.5 Flash ingests the entire file tree and source code — up to 50 files, 1M token context — producing a structured, evidence-based analysis."
                            detail="Files are priority-ranked by importance before selection — entry points, manifests, and source dirs always come first."
                            auth="free"
                            delay={0.2}
                        />
                        <FeatureCard
                            step="Step 03"
                            title="Chat with the codebase"
                            description="Ask questions in plain English. RAG-powered retrieval finds the most relevant code chunks and gives the AI real context to answer from. Sign-in required."
                            detail="Answers reference actual file names and functions — not guesswork."
                            auth="login"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats bar ─────────────────────────────────── */}
            <section className="border-y border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 py-4 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800">
                        <StatCard value="1M" label="token context window" delay={0.1} />
                        <StatCard value="50" label="files per analysis" delay={0.2} />
                        <StatCard value="768" label="dim vector embeddings" delay={0.3} />
                        <StatCard value="Hybrid" label="vector + keyword search" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* ── Chat feature ──────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Reveal>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Codebase Chat</span>
                                    <Badge type="login" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white">
                                    Talk to any repo like a senior engineer
                                </h2>
                            </Reveal>
                            <Reveal delay={0.15}>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-6 text-lg leading-relaxed">
                                    After analysis, every file is chunked, embedded with Gemini, and stored in a vector database.
                                    Your questions retrieve the most relevant code — giving the AI real context to answer from.
                                </p>
                                <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                                    Sign in with GitHub to unlock chat on any analyzed repository.
                                </p>
                            </Reveal>
                            <Reveal delay={0.25}>
                                <ul className="mt-8 space-y-3">
                                    {[
                                        "Source citations link answers to exact file paths and line numbers",
                                        "Auto-generated Mermaid diagrams for architecture and data flows",
                                        "Conversation history maintained across messages",
                                        "Works on any analyzed repo — public or private",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400">
                                            <span className="mt-0.5 w-5 h-5 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                    <path d="M2 5l2 2 4-4" stroke="white" className="dark:stroke-neutral-900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                        <Reveal delay={0.2}>
                            <ChatPreview />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── Advanced Chat Features ────────────────────── */}
            <section className="py-20 px-4 border-y border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                <div className="container mx-auto max-w-6xl">
                    <Reveal className="text-center mb-12">
                        <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Powered by the chat engine</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3 text-neutral-900 dark:text-white">
                            Beyond answers — real evidence
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-base max-w-xl mx-auto">
                            Every chat response is grounded in your actual source code.
                        </p>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Source Citations */}
                        <Reveal delay={0.1}>
                            <div className="rounded-2xl border border-violet-200 dark:border-violet-800/60 bg-white dark:bg-neutral-900 p-6 h-full flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Source Citations</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        Every answer links to the exact file and line number it came from. Click any citation chip to view the raw code snippet in-context.
                                    </p>
                                </div>
                                <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300">
                                        lib/rate-limit.ts:12 · both
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                                        app/api/chat/route.ts:58 · vector
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                        {/* Architectural Diagrams */}
                        <Reveal delay={0.2}>
                            <div className="rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-neutral-900 p-6 h-full flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Architectural Diagrams</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        Ask about a flow or system and get an interactive Mermaid diagram — download as SVG or expand fullscreen. Auto-generated from your actual code.
                                    </p>
                                </div>
                                <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-2.5 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        <span className="text-blue-500">flowchart</span> TD<br/>
                                        &nbsp;&nbsp;A[User Input] --&gt; B[Validation]<br/>
                                        &nbsp;&nbsp;B --&gt; C[GitHub API]<br/>
                                        &nbsp;&nbsp;C --&gt; D[Gemini AI]
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                        {/* Performance Monitoring */}
                        <Reveal delay={0.3}>
                            <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-neutral-900 p-6 h-full flex flex-col gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Performance Monitoring</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        Every analysis and chat message shows execution time, token usage, and estimated cost — full transparency into what the AI is doing.
                                    </p>
                                </div>
                                <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="flex items-center gap-1">⏱ <span className="font-mono text-neutral-700 dark:text-neutral-300">4.2s</span></span>
                                    <span className="flex items-center gap-1">🔢 <span className="font-mono text-neutral-700 dark:text-neutral-300">12,483</span></span>
                                    <span className="flex items-center gap-1">💰 <span className="font-mono text-neutral-700 dark:text-neutral-300">$0.0019</span></span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── Analysis breakdown ────────────────────────── */}
            <section className="py-28 px-4 bg-neutral-50 dark:bg-neutral-900/30">
                <div className="container mx-auto max-w-6xl">
                    <Reveal className="text-center mb-16">
                        <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">What you get</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-neutral-900 dark:text-white">
                            A complete picture of any codebase
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-base">
                            All of these are included in every analysis — free, no login required.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                title: "Architecture Overview",
                                desc: "Identifies the structural pattern — monorepo, MVC, feature-based — with specific directory references.",
                            },
                            {
                                title: "Tech Stack Detection",
                                desc: "Every framework, library, and tool inferred from imports, config files, and package manifests.",
                            },
                            {
                                title: "Data Flow Trace",
                                desc: "Follows data from user input through the system to final output, naming each step and file.",
                            },
                            {
                                title: "Key Features",
                                desc: "Surfaces the core capabilities of the project with evidence from the actual source code.",
                            },
                            {
                                title: "Code Quality Score",
                                desc: "Scored 0–100 with specific strengths and actionable improvement suggestions.",
                            },
                            {
                                title: "Entry Points",
                                desc: "Lists the actual files where execution begins — main files, API routes, CLI entrypoints.",
                            },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={0.05 * i}>
                                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 lg:w-2/3 mx-auto">
                        {[
                            {
                                title: "AI Health Audit",
                                desc: "Security, maintainability, and architecture scored independently — each with severity-ranked findings and specific recommendations.",
                            },
                            {
                                title: "PDF Export",
                                desc: "Download the full analysis as a vector PDF — cover block, all sections, and health audit with severity colors included.",
                            },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={0.05 * (6 + i)}>
                                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <Reveal>
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white">
                            Ready to understand any codebase?
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-4 text-lg">
                            Paste a GitHub URL and get a full AI analysis in under a minute. No login needed to start.
                        </p>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/analyze"
                                className="px-8 py-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                                    font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors text-base"
                            >
                                Start Analyzing →
                            </Link>
                            <Link
                                href="/history"
                                className="px-8 py-4 rounded-xl border border-neutral-200 dark:border-neutral-700
                                    text-neutral-700 dark:text-neutral-300 font-semibold
                                    hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors text-base"
                            >
                                View History
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────── */}
            <footer className="border-t border-neutral-100 dark:border-neutral-800 py-8 px-4">
                <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
                    <span>Codebase Narrator — AI-powered GitHub analysis</span>
                    <span>Built with Next.js · Gemini 2.5 Flash · Supabase</span>
                </div>
            </footer>

            <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
        </div>
    );
}
