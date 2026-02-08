import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Client (Browser-side)
 *
 * Creates a Supabase client for use in Client Components
 * Automatically handles session management and auth state
 *
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon/public key
 *
 * Get these from: Supabase Dashboard → Settings → API
 */

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
