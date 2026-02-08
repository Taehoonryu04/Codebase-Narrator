"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * AuthContext - Global Authentication State
 *
 * Provides user authentication state and helper functions throughout the app
 *
 * Features:
 * - Automatic session management
 * - Real-time auth state updates
 * - GitHub OAuth sign in/out
 * - Loading states
 */

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGitHub: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const signInWithGitHub = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                scopes: "read:user user:email repo",
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("Error signing in with GitHub:", error);
            throw error;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    const value = {
        user,
        session,
        loading,
        signInWithGitHub,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Access authentication state and functions from any component
 *
 * @example
 * const { user, signInWithGitHub, signOut } = useAuth();
 *
 * if (user) {
 *   return <button onClick={signOut}>Sign Out</button>;
 * }
 * return <button onClick={signInWithGitHub}>Sign In with GitHub</button>;
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
