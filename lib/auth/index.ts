import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { encryptToken } from "./encryption";

/**
 * NextAuth.js v5 Configuration
 *
 * Features:
 * - GitHub OAuth provider with repo access scope
 * - Prisma adapter for database sessions
 * - Custom callbacks to store encrypted GitHub token
 * - Extended session with user ID and GitHub login
 *
 * Environment Variables Required:
 * - GITHUB_CLIENT_ID: GitHub OAuth App Client ID
 * - GITHUB_CLIENT_SECRET: GitHub OAuth App Client Secret
 * - NEXTAUTH_SECRET: Session encryption secret (generate with: openssl rand -base64 32)
 * - NEXTAUTH_URL: Base URL for OAuth callbacks (http://localhost:3000 in dev)
 * - TOKEN_ENCRYPTION_KEY: 32-byte key for token encryption (generate with: openssl rand -hex 32)
 *
 * OAuth Flow:
 * 1. User clicks "Sign in with GitHub"
 * 2. Redirected to GitHub OAuth consent screen
 * 3. User authorizes with scopes: read:user, user:email, repo
 * 4. GitHub redirects back with authorization code
 * 5. NextAuth exchanges code for access token
 * 6. signIn callback: Encrypt and store token in database
 * 7. session callback: Add user ID and GitHub login to session
 * 8. User is signed in
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    // Request access to private repositories
                    // Scopes: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],

    callbacks: {
        /**
         * Triggered when user signs in
         *
         * Stores encrypted GitHub access token in User table
         */
        async signIn({ user, account, profile }) {
            if (account?.provider === "github" && account.access_token) {
                try {
                    // Encrypt GitHub token
                    const encryptedToken = encryptToken(account.access_token);

                    // Store in database
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            githubId: profile?.id?.toString(),
                            githubLogin: (profile as any)?.login, // GitHub username
                            githubTokenEncrypted: encryptedToken,
                        },
                    });

                    console.log(`✅ GitHub token encrypted and stored for user: ${user.email}`);
                } catch (error) {
                    console.error("❌ Failed to store GitHub token:", error);
                    return false; // Prevent sign-in on encryption failure
                }
            }

            return true;
        },

        /**
         * Triggered when session is accessed (client-side or server-side)
         *
         * Adds user ID and GitHub login to session object
         */
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                session.user.githubLogin = (user as any).githubLogin || null;
            }
            return session;
        },
    },

    pages: {
        signIn: "/", // Redirect to home page for sign-in (not a separate /signin page)
    },

    session: {
        strategy: "database", // Use database sessions (more secure for OAuth tokens)
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    debug: process.env.NODE_ENV === "development",
});
