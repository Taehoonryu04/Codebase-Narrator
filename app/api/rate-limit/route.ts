import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRateLimitStatus } from "@/lib/rate-limit";

/**
 * GET /api/rate-limit
 *
 * Returns the current user's rate limit status.
 * Used by the frontend to display usage counters.
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const status = await getRateLimitStatus(session.user.id);

        return NextResponse.json(status);
    } catch (error) {
        console.error("❌ Failed to fetch rate limit status:", error);
        return NextResponse.json(
            { error: "Failed to fetch rate limit status" },
            { status: 500 }
        );
    }
}
