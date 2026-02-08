import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

/**
 * DELETE /api/history/[id]
 *
 * Deletes a specific analysis history entry.
 * Only the owner of the entry can delete it.
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify ownership before deleting
        const analysis = await prisma.analysis.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!analysis) {
            return NextResponse.json(
                { error: "Analysis not found" },
                { status: 404 }
            );
        }

        if (analysis.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Not authorized to delete this analysis" },
                { status: 403 }
            );
        }

        await prisma.analysis.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Failed to delete analysis:", error);
        return NextResponse.json(
            { error: "Failed to delete analysis" },
            { status: 500 }
        );
    }
}
