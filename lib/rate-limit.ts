import { prisma } from "@/lib/db/prisma";

/**
 * Per-user rate limiting (24-hour rolling window)
 *
 * Limits:
 * - Analysis: 5 per day (free tier)
 * - Chat:     50 per day (free tier)
 *
 * userId = Supabase Auth user ID (same as Analysis.userId)
 */

export const RATE_LIMITS = {
    analysis: 9999, // TODO: set to 5 before production
    chat: 9999,     // TODO: set to 50 before production
} as const;

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export function windowLabel(): string {
    const hours = WINDOW_MS / (60 * 60 * 1000);
    if (hours >= 24) return "day";
    const mins = WINDOW_MS / (60 * 1000);
    if (mins >= 60) return `${hours}h`;
    return `${mins}min`;
}

export interface RateLimitResult {
    allowed: boolean;
    current: number;
    limit: number;
    remaining: number;
    resetAt: Date;
}

export interface RateLimitStatus {
    analysis: Omit<RateLimitResult, "allowed">;
    chat: Omit<RateLimitResult, "allowed">;
}

function isWindowExpired(windowStart: Date): boolean {
    return Date.now() - windowStart.getTime() > WINDOW_MS;
}

function resetAt(windowStart: Date): Date {
    return new Date(windowStart.getTime() + WINDOW_MS);
}

/**
 * Check rate limit and increment counter atomically.
 * If the 24-hour window has expired, resets counters before checking.
 *
 * @returns RateLimitResult — allowed=false if limit exceeded
 */
export async function checkAndIncrementAnalysis(userId: string): Promise<RateLimitResult> {
    const now = new Date();
    const existing = await prisma.rateLimit.findUnique({ where: { userId } });

    if (!existing || isWindowExpired(existing.windowStart)) {
        // New window: reset and count this request as 1
        await prisma.rateLimit.upsert({
            where: { userId },
            update: { analysisCount: 1, windowStart: now },
            create: { id: crypto.randomUUID(), userId, analysisCount: 1, windowStart: now, updatedAt: now },
        });
        return {
            allowed: true,
            current: 1,
            limit: RATE_LIMITS.analysis,
            remaining: RATE_LIMITS.analysis - 1,
            resetAt: new Date(now.getTime() + WINDOW_MS),
        };
    }

    if (existing.analysisCount >= RATE_LIMITS.analysis) {
        return {
            allowed: false,
            current: existing.analysisCount,
            limit: RATE_LIMITS.analysis,
            remaining: 0,
            resetAt: resetAt(existing.windowStart),
        };
    }

    const updated = await prisma.rateLimit.update({
        where: { userId },
        data: { analysisCount: { increment: 1 } },
    });

    return {
        allowed: true,
        current: updated.analysisCount,
        limit: RATE_LIMITS.analysis,
        remaining: RATE_LIMITS.analysis - updated.analysisCount,
        resetAt: resetAt(updated.windowStart),
    };
}

/**
 * Check chat rate limit and increment counter.
 * Used by the Phase 3 chat endpoint.
 */
export async function checkAndIncrementChat(userId: string): Promise<RateLimitResult> {
    const now = new Date();
    const existing = await prisma.rateLimit.findUnique({ where: { userId } });

    if (!existing || isWindowExpired(existing.windowStart)) {
        await prisma.rateLimit.upsert({
            where: { userId },
            update: { chatCount: 1, windowStart: now },
            create: { id: crypto.randomUUID(), userId, chatCount: 1, windowStart: now, updatedAt: now },
        });
        return {
            allowed: true,
            current: 1,
            limit: RATE_LIMITS.chat,
            remaining: RATE_LIMITS.chat - 1,
            resetAt: new Date(now.getTime() + WINDOW_MS),
        };
    }

    if (existing.chatCount >= RATE_LIMITS.chat) {
        return {
            allowed: false,
            current: existing.chatCount,
            limit: RATE_LIMITS.chat,
            remaining: 0,
            resetAt: resetAt(existing.windowStart),
        };
    }

    const updated = await prisma.rateLimit.update({
        where: { userId },
        data: { chatCount: { increment: 1 } },
    });

    return {
        allowed: true,
        current: updated.chatCount,
        limit: RATE_LIMITS.chat,
        remaining: RATE_LIMITS.chat - updated.chatCount,
        resetAt: resetAt(updated.windowStart),
    };
}

/**
 * Read-only status for the current user's rate limit usage.
 * Used by GET /api/rate-limit.
 */
export async function getRateLimitStatus(userId: string): Promise<RateLimitStatus> {
    const now = new Date();
    const record = await prisma.rateLimit.findUnique({ where: { userId } });

    if (!record || isWindowExpired(record.windowStart)) {
        const reset = new Date(now.getTime() + WINDOW_MS);
        return {
            analysis: { current: 0, limit: RATE_LIMITS.analysis, remaining: RATE_LIMITS.analysis, resetAt: reset },
            chat: { current: 0, limit: RATE_LIMITS.chat, remaining: RATE_LIMITS.chat, resetAt: reset },
        };
    }

    const reset = resetAt(record.windowStart);
    return {
        analysis: {
            current: record.analysisCount,
            limit: RATE_LIMITS.analysis,
            remaining: Math.max(0, RATE_LIMITS.analysis - record.analysisCount),
            resetAt: reset,
        },
        chat: {
            current: record.chatCount,
            limit: RATE_LIMITS.chat,
            remaining: Math.max(0, RATE_LIMITS.chat - record.chatCount),
            resetAt: reset,
        },
    };
}
