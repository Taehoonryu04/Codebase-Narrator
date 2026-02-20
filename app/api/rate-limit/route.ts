import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRateLimitStatus, isDonor, isAdmin } from "@/lib/rate-limit";

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

        const status = await getRateLimitStatus(session.user.id, session.user.email);

        const userEmail = session.user.email ?? null;
        const tier =
            isAdmin(userEmail) ? "admin"
            : isDonor(userEmail) ? "donor"
            : "free";

        return NextResponse.json({ ...status, tier });
    } catch (error) {
        console.error("❌ Failed to fetch rate limit status:", error);
        return NextResponse.json(
            { error: "Failed to fetch rate limit status" },
            { status: 500 }
        );
    }
}
