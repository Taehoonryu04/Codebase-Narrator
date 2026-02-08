/**
 * TypeScript Type Augmentation for NextAuth.js
 *
 * Extends NextAuth types to include custom fields:
 * - Session.user.id: User database ID
 * - Session.user.githubLogin: GitHub username
 * - User.githubLogin: GitHub username stored in database
 *
 * This allows TypeScript to recognize these fields when accessing session data:
 *
 * @example
 * const session = await auth();
 * if (session?.user) {
 *   console.log(session.user.id);          // TypeScript knows this exists
 *   console.log(session.user.githubLogin); // TypeScript knows this exists
 * }
 */

import "next-auth";

declare module "next-auth" {
    /**
     * Extended Session type with custom user fields
     */
    interface Session {
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            githubLogin?: string | null;
        };
    }

    /**
     * Extended User type (database model)
     */
    interface User {
        githubLogin?: string | null;
    }
}
