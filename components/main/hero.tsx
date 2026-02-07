"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingPaths } from "@/components/ui/floating-paths";

export function Hero({
    title = "AI Codebase Narrator",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-lg sm:text-xl md:text-2xl mb-12 text-white font-medium max-w-3xl mx-auto"
                        style={{
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        Transform your GitHub repository into an interactive visual story.
                        <br />
                        AI-powered analysis that reveals structure, data flow, and core logic.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <Link href="/analyze">
                            <Button
                                variant="ghost"
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md
                                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100
                                text-black dark:text-white transition-all duration-300
                                group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                hover:shadow-md dark:hover:shadow-neutral-800/50"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    Start Analyzing
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
