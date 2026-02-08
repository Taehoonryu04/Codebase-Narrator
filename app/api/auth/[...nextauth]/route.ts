/**
 * NextAuth.js API Route Handlers
 *
 * This file exports the GET and POST handlers from NextAuth.js configuration
 * The [...nextauth] catch-all route handles all auth-related requests:
 *
 * - GET  /api/auth/signin           - Sign in page
 * - GET  /api/auth/signout          - Sign out page
 * - POST /api/auth/signin/:provider - Initiate OAuth flow
 * - GET  /api/auth/callback/:provider - OAuth callback
 * - GET  /api/auth/session          - Get current session
 * - POST /api/auth/signout          - Sign out
 * - GET  /api/auth/csrf             - CSRF token
 * - GET  /api/auth/providers        - List providers
 *
 * Reference: https://authjs.dev/getting-started/installation?framework=next.js
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
