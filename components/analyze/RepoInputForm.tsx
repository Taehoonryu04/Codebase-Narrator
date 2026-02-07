"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RepoInputFormProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

/**
 * GitHub Repository URL Input Form
 *
 * Features:
 * - URL input
 * - Client-side validation
 * - Quick example URL input
 */
export function RepoInputForm({ onSubmit, isLoading }: RepoInputFormProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    // Example repository list
    const exampleRepos = [
        "https://github.com/vercel/next.js",
        "https://github.com/facebook/react",
        "https://github.com/shadcn-ui/ui",
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!url.trim()) {
            setError("Please enter a GitHub URL");
            return;
        }

        if (!url.toLowerCase().includes("github.com")) {
            setError("Please enter a valid GitHub URL");
            return;
        }

        setError("");
        onSubmit(url);
    };

    const handleExampleClick = (exampleUrl: string) => {
        setUrl(exampleUrl);
        setError("");
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="repo-url"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                        GitHub Repository URL
                    </label>
                    <input
                        id="repo-url"
                        type="text"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            setError("");
                        }}
                        placeholder="https://github.com/username/repository"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700
                        bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                        placeholder:text-neutral-400 dark:placeholder:text-neutral-500
                        focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all"
                    />
                    {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                    hover:bg-neutral-800 dark:hover:bg-neutral-100 py-3 px-6 rounded-lg
                    font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-neutral-900" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <span>Start Analysis</span>
                            <span>→</span>
                        </>
                    )}
                </Button>
            </form>

            {/* Example Repositories */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Try with example repositories:
                </p>
                <div className="flex flex-wrap gap-2">
                    {exampleRepos.map((repo) => (
                        <button
                            key={repo}
                            type="button"
                            onClick={() => handleExampleClick(repo)}
                            disabled={isLoading}
                            className="text-xs px-3 py-1.5 rounded-full
                            bg-neutral-100 dark:bg-neutral-800
                            text-neutral-700 dark:text-neutral-300
                            hover:bg-neutral-200 dark:hover:bg-neutral-700
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {repo.replace("https://github.com/", "")}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
