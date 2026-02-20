import { prisma } from "@/lib/db/prisma";

/**
 * Per-user rate limiting (24-hour rolling window)
 *
 * Tiers (production):
 * - Anonymous / signed-in (no donation): 1 analysis · 2 chats per day
 * - Donor: 5 analyses · 20 chats per day
 * - Admin: unlimited (9999)
 *
 * Donor emails: DONOR_EMAILS env var (comma-separated).
 * Admin email:  ADMIN_EMAIL env var (single address).
 * userId = Supabase Auth user ID (same as Analysis.userId)
 */

export const RATE_LIMITS = {
    analysis: 1,
    chat: 2,
} as const;

export const DONOR_RATE_LIMITS = {
    analysis: 5,
    chat: 20,
} as const;

export const ADMIN_RATE_LIMITS = {
    analysis: 9999,
    chat: 9999,
} as const;

export function isDonor(email: string | null | undefined): boolean {
    if (!email) return false;
    const donors = (process.env.DONOR_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return donors.includes(email.toLowerCase());
}

export function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    const adminEmail = process.env.ADMIN_EMAIL;
    return !!adminEmail && email.toLowerCase() === adminEmail.toLowerCase();
}

function limitsFor(email: string | null | undefined) {
    if (isAdmin(email)) return ADMIN_RATE_LIMITS;
    if (isDonor(email)) return DONOR_RATE_LIMITS;
    return RATE_LIMITS;
}

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
export async function checkAndIncrementAnalysis(userId: string, email?: string | null): Promise<RateLimitResult> {
    const limits = limitsFor(email);
    const now = new Date();
    const existing = await prisma.rateLimit.findUnique({ where: { userId } });

    if (!existing || isWindowExpired(existing.windowStart)) {
        await prisma.rateLimit.upsert({
            where: { userId },
            update: { analysisCount: 1, windowStart: now },
            create: { id: crypto.randomUUID(), userId, analysisCount: 1, windowStart: now, updatedAt: now },
        });
        return {
            allowed: true,
            current: 1,
            limit: limits.analysis,
            remaining: limits.analysis - 1,
            resetAt: new Date(now.getTime() + WINDOW_MS),
        };
    }

    if (existing.analysisCount >= limits.analysis) {
        return {
            allowed: false,
            current: existing.analysisCount,
            limit: limits.analysis,
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
        limit: limits.analysis,
        remaining: limits.analysis - updated.analysisCount,
        resetAt: resetAt(updated.windowStart),
    };
}

/**
 * Check chat rate limit and increment counter.
 * Used by the Phase 3 chat endpoint.
 */
export async function checkAndIncrementChat(userId: string, email?: string | null): Promise<RateLimitResult> {
    const limits = limitsFor(email);
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
            limit: limits.chat,
            remaining: limits.chat - 1,
            resetAt: new Date(now.getTime() + WINDOW_MS),
        };
    }

    if (existing.chatCount >= limits.chat) {
        return {
            allowed: false,
            current: existing.chatCount,
            limit: limits.chat,
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
        limit: limits.chat,
        remaining: limits.chat - updated.chatCount,
        resetAt: resetAt(updated.windowStart),
    };
}

/**
 * Read-only status for the current user's rate limit usage.
 * Used by GET /api/rate-limit.
 */
export async function getRateLimitStatus(userId: string, email?: string | null): Promise<RateLimitStatus> {
    const limits = limitsFor(email);
    const now = new Date();
    const record = await prisma.rateLimit.findUnique({ where: { userId } });

    if (!record || isWindowExpired(record.windowStart)) {
        const reset = new Date(now.getTime() + WINDOW_MS);
        return {
            analysis: { current: 0, limit: limits.analysis, remaining: limits.analysis, resetAt: reset },
            chat: { current: 0, limit: limits.chat, remaining: limits.chat, resetAt: reset },
        };
    }

    const reset = resetAt(record.windowStart);
    return {
        analysis: {
            current: record.analysisCount,
            limit: limits.analysis,
            remaining: Math.max(0, limits.analysis - record.analysisCount),
            resetAt: reset,
        },
        chat: {
            current: record.chatCount,
            limit: limits.chat,
            remaining: Math.max(0, limits.chat - record.chatCount),
            resetAt: reset,
        },
    };
}
