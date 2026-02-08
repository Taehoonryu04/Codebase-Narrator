import crypto from "crypto";

/**
 * Token Encryption Utilities
 *
 * Encrypts GitHub access tokens using AES-256-GCM before storing in database
 *
 * Security Features:
 * - AES-256-GCM: Industry-standard authenticated encryption
 * - Random IV (Initialization Vector) for each encryption
 * - Authentication tag prevents tampering
 * - 32-byte encryption key (256 bits)
 *
 * Format: "iv:encrypted_token:auth_tag" (all base64 encoded)
 */

const ALGORITHM = "aes-256-gcm";
const KEY_ENV = process.env.TOKEN_ENCRYPTION_KEY || "";

// Validate encryption key on module load
if (!KEY_ENV) {
    console.warn("⚠️ TOKEN_ENCRYPTION_KEY not set - token encryption will fail");
}

const KEY = Buffer.from(KEY_ENV, "hex");

if (KEY.length !== 32 && KEY_ENV) {
    throw new Error(
        "TOKEN_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Generate with: openssl rand -hex 32"
    );
}

/**
 * Encrypt a GitHub access token using AES-256-GCM
 *
 * @param token - Plain text GitHub access token (e.g., "gho_...")
 * @returns Encrypted string in format "iv:encrypted:authTag" (base64)
 *
 * @example
 * const encrypted = encryptToken("gho_1234567890abcdef");
 * // Returns: "a1b2c3d4...==:e5f6g7h8...==:i9j0k1l2...=="
 */
export function encryptToken(token: string): string {
    if (!KEY_ENV) {
        throw new Error("TOKEN_ENCRYPTION_KEY environment variable is not set");
    }

    // Generate random 16-byte IV (96 bits recommended for GCM)
    const iv = crypto.randomBytes(16);

    // Create cipher with key and IV
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    // Encrypt token
    let encrypted = cipher.update(token, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Get authentication tag (prevents tampering)
    const authTag = cipher.getAuthTag().toString("base64");

    // Return concatenated string: iv:encrypted:authTag
    return `${iv.toString("base64")}:${encrypted}:${authTag}`;
}

/**
 * Decrypt a GitHub access token
 *
 * @param encryptedToken - Encrypted token in format "iv:encrypted:authTag"
 * @returns Plain text GitHub access token
 *
 * @throws Error if token format is invalid or decryption fails (tampered data)
 *
 * @example
 * const decrypted = decryptToken("a1b2...==:e5f6...==:i9j0...==");
 * // Returns: "gho_1234567890abcdef"
 */
export function decryptToken(encryptedToken: string): string {
    if (!KEY_ENV) {
        throw new Error("TOKEN_ENCRYPTION_KEY environment variable is not set");
    }

    // Parse encrypted token format
    const parts = encryptedToken.split(":");

    if (parts.length !== 3) {
        throw new Error("Invalid encrypted token format. Expected 'iv:encrypted:authTag'");
    }

    const [ivBase64, encryptedBase64, authTagBase64] = parts;

    // Convert from base64
    const iv = Buffer.from(ivBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    // Decrypt token
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
}
