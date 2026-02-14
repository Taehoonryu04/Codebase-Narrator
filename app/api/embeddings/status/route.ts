import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * GET /api/embeddings/status?repo=owner/repo
 *
 * Returns the latest embedding job status for the authenticated user + repo.
 * Used by the chat page to show progress while embeddings are being generated.
 */
export async function GET(request: NextRequest) {
    // Auth
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Authentication required." },
            { status: 401 }
        );
    }

    const userId = session.user.id;
    const repo = request.nextUrl.searchParams.get("repo");

    if (!repo) {
        return NextResponse.json(
            { error: "Missing 'repo' query parameter." },
            { status: 400 }
        );
    }

    const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch latest job for this user + repo
    const { data, error } = await admin
        .from("embedding_jobs")
        .select("status, total_chunks, embedded_chunks, created_at, completed_at, error_message")
        .eq("user_id", userId)
        .eq("repo_full_name", repo)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("❌ Failed to fetch embedding status:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch embedding status." },
            { status: 500 }
        );
    }

    if (!data) {
        return NextResponse.json({ status: "none" });
    }

    const progressPct =
        data.total_chunks > 0
            ? Math.round((data.embedded_chunks / data.total_chunks) * 100)
            : 0;

    return NextResponse.json({
        status: data.status,
        totalChunks: data.total_chunks,
        embeddedChunks: data.embedded_chunks,
        progressPct,
        createdAt: data.created_at,
        completedAt: data.completed_at,
        errorMessage: data.error_message,
    });
}
