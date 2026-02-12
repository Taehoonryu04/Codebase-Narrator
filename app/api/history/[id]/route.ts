import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/db/prisma";

function getSupabaseAdmin() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

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
            select: { userId: true, repoFullName: true },
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

        // Cascade: delete embeddings for this repo
        const supabaseAdmin = getSupabaseAdmin();
        const { error: embeddingDeleteError } = await supabaseAdmin
            .from("code_embeddings")
            .delete()
            .eq("user_id", session.user.id)
            .eq("repo_full_name", analysis.repoFullName);

        if (embeddingDeleteError) {
            console.error("⚠️ Failed to delete embeddings (non-blocking):", embeddingDeleteError.message);
        } else {
            console.log(`🗑️ Deleted embeddings for ${analysis.repoFullName}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Failed to delete analysis:", error);
        return NextResponse.json(
            { error: "Failed to delete analysis" },
            { status: 500 }
        );
    }
}
