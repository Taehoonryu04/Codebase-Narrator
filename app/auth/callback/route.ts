import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth Callback Route
 *
 * Handles OAuth callback from GitHub
 * Exchanges authorization code for session
 * Redirects user back to the app
 *
 * Flow:
 * 1. User signs in with GitHub
 * 2. GitHub redirects to this route with code
 * 3. Exchange code for session
 * 4. Redirect to home page
 */

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Error exchanging code for session:", error);
            return NextResponse.redirect(`${origin}/?error=auth_failed`);
        }
    }

    // Redirect to home page
    return NextResponse.redirect(`${origin}/`);
}
