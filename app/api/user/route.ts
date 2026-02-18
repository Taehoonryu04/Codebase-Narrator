import { NextResponse } from "next/server";
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
 * DELETE /api/user
 *
 * Deletes the authenticated user's account and all associated data.
 * Order of deletion:
 *   1. Supabase vector data (code_embeddings, embedding_jobs)
 *   2. Prisma records (Analysis, RateLimit)
 *   3. Supabase Auth user (invalidates all sessions)
 */
export async function DELETE() {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const supabaseAdmin = getSupabaseAdmin();

        // 1. Delete all vector embeddings for this user
        const { error: embeddingsError } = await supabaseAdmin
            .from("code_embeddings")
            .delete()
            .eq("user_id", userId);

        if (embeddingsError) {
            console.warn("⚠️ Failed to delete embeddings (continuing):", embeddingsError.message);
        } else {
            console.log(`🗑️ Deleted code_embeddings for user ${userId}`);
        }

        // 2. Delete all embedding job records for this user
        const { error: jobsError } = await supabaseAdmin
            .from("embedding_jobs")
            .delete()
            .eq("user_id", userId);

        if (jobsError) {
            console.warn("⚠️ Failed to delete embedding_jobs (continuing):", jobsError.message);
        }

        // 3. Delete all analysis history from Prisma
        await prisma.analysis.deleteMany({ where: { userId } });
        console.log(`🗑️ Deleted analysis records for user ${userId}`);

        // 4. Delete rate limit record from Prisma
        await prisma.rateLimit.deleteMany({ where: { userId } });

        // 5. Delete the Supabase Auth user — this invalidates all sessions
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authDeleteError) {
            console.error("❌ Failed to delete Supabase Auth user:", authDeleteError.message);
            return NextResponse.json(
                { error: "Failed to delete account. Please try again." },
                { status: 500 }
            );
        }

        console.log(`✅ Account fully deleted for user ${userId}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Account deletion failed:", error);
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
