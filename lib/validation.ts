import { z } from "zod";

/**
 * Zod 스키마 - 런타임 유효성 검사 + TypeScript 타입 추론
 *
 * 개념 설명:
 * - Zod는 TypeScript-first 스키마 선언 및 검증 라이브러리
 * - 런타임에 값을 검증하고, TypeScript 타입도 자동으로 추론
 * - API 엔드포인트에서 사용자 입력을 검증하는 데 필수적
 *
 * 장점:
 * 1. 런타임 안전성: 잘못된 데이터가 들어오면 즉시 에러 발생
 * 2. 타입 추론: schema.parse()의 반환값이 자동으로 타입화됨
 * 3. 에러 메시지: 어떤 필드가 잘못되었는지 명확히 알려줌
 */

/**
 * GitHub URL 검증 스키마
 *
 * 검증 규칙:
 * 1. 문자열이어야 함
 * 2. 최소 1글자 이상
 * 3. GitHub URL 형식 검증 (선택적)
 */
export const githubUrlSchema = z.object({
    url: z
        .string()
        .min(1, "Please enter a GitHub URL")
        .refine(
            (url) => {
                // Check if github.com is included
                const normalized = url.toLowerCase();
                return normalized.includes("github.com");
            },
            {
                message: "Please enter a valid GitHub URL (e.g., https://github.com/username/repo)",
            }
        ),
});

/**
 * 분석 요청 바디 스키마
 *
 * API 엔드포인트: POST /api/analyze
 */
export const analyzeRequestSchema = z.object({
    repoUrl: z.string().url("Invalid URL format"),
    includeContent: z.boolean().optional().default(true), // Whether to analyze file contents
    maxFiles: z.number().min(1).max(50).optional().default(20), // Maximum number of files to analyze
});

/**
 * 타입 추론 예시
 *
 * Zod의 강력한 기능: 스키마에서 TypeScript 타입을 자동 추론
 */
export type GithubUrlInput = z.infer<typeof githubUrlSchema>;
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;

/**
 * Custom error formatter
 *
 * Convert Zod errors to user-friendly messages
 */
export function formatZodError(error: z.ZodError): string {
    const firstError = error.errors[0];
    return firstError?.message || "Invalid input";
}

/**
 * 사용 예시:
 *
 * ```typescript
 * // API Route에서
 * const body = await request.json();
 * const result = analyzeRequestSchema.safeParse(body);
 *
 * if (!result.success) {
 *   return Response.json(
 *     { error: formatZodError(result.error) },
 *     { status: 400 }
 *   );
 * }
 *
 * const { repoUrl, includeContent } = result.data; // 타입 안전!
 * ```
 */
