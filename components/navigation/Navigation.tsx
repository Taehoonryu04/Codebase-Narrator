"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";

/**
 * Navigation Component
 *
 * Global navigation bar with auth state
 * Shows SignIn button for anonymous users
 * Shows UserMenu for authenticated users
 */

export function Navigation() {
    const { user, loading } = useAuth();

    return (
        <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    >
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Codebase Narrator
                        </span>
                    </Link>

                    {/* Nav Links + Auth Section */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <Link
                                    href="/history"
                                    className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                                >
                                    History
                                </Link>
                                <Link
                                    href="/chat"
                                    className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                                >
                                    Chat
                                </Link>
                            </>
                        )}
                        {loading ? (
                            <div className="w-32 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
                        ) : user ? (
                            <UserMenu />
                        ) : (
                            <SignInButton />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
