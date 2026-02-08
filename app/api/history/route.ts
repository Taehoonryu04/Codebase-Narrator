import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/history
 *
 * Returns the authenticated user's analysis history.
 * Results are ordered by analyzedAt (newest first).
 * The full `result` JSON is excluded for performance.
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

        const history = await prisma.analysis.findMany({
            where: { userId: session.user.id },
            select: {
                id: true,
                repoUrl: true,
                repoOwner: true,
                repoName: true,
                repoFullName: true,
                analyzedFiles: true,
                totalFiles: true,
                analyzedAt: true,
            },
            orderBy: { analyzedAt: "desc" },
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error("❌ Failed to fetch history:", error);
        return NextResponse.json(
            { error: "Failed to fetch analysis history" },
            { status: 500 }
        );
    }
}
