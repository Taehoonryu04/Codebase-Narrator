import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 *
 * Prevents multiple instances in development (hot reload creates new connections)
 *
 * Pattern from: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 *
 * In production: Single instance created once
 * In development: Instance stored in globalThis to survive hot reloads
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
