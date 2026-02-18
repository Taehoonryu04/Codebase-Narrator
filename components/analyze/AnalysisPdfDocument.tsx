import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
} from "@react-pdf/renderer";
import type { AnalysisResult, AnalysisStats, AuditSeverity, HealthAudit } from "@/lib/types";

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1a1a1a",
        paddingTop: 48,
        paddingBottom: 56,
        paddingHorizontal: 48,
        lineHeight: 1.5,
    },

    // Cover / header
    coverBlock: {
        backgroundColor: "#171717",
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
    },
    coverRepo: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        marginBottom: 6,
    },
    coverDesc: {
        fontSize: 10,
        color: "#a3a3a3",
        marginBottom: 12,
    },
    coverMeta: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 8,
    },
    coverMetaItem: {
        fontSize: 9,
        color: "#d4d4d4",
    },
    coverLink: {
        fontSize: 9,
        color: "#60a5fa",
        textDecoration: "none",
    },
    coverTimestamp: {
        fontSize: 8,
        color: "#737373",
        marginTop: 8,
    },

    // Stats pills row
    statsRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
        flexWrap: "wrap",
    },
    statsPill: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        fontSize: 8,
        color: "#e5e5e5",
    },

    // Section
    sectionTitle: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: "#171717",
        marginBottom: 8,
        marginTop: 20,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",
    },

    // Body text
    body: {
        fontSize: 10,
        color: "#404040",
        lineHeight: 1.6,
    },

    // Tags (tech stack, topics)
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    tag: {
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
        paddingVertical: 3,
        paddingHorizontal: 8,
        fontSize: 9,
        color: "#525252",
    },
    tagMono: {
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
        paddingVertical: 3,
        paddingHorizontal: 8,
        fontSize: 9,
        color: "#525252",
        fontFamily: "Courier",
    },

    // Bullet list
    listItem: {
        flexDirection: "row",
        marginBottom: 4,
    },
    bullet: {
        width: 14,
        fontSize: 10,
        color: "#737373",
    },
    listText: {
        flex: 1,
        fontSize: 10,
        color: "#404040",
        lineHeight: 1.5,
    },

    // Code quality score bar
    scoreRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    scoreLabel: {
        fontSize: 9,
        color: "#737373",
    },
    scoreValue: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: "#171717",
    },
    barTrack: {
        backgroundColor: "#e5e5e5",
        borderRadius: 4,
        height: 6,
        marginBottom: 12,
    },
    barFill: {
        borderRadius: 4,
        height: 6,
        backgroundColor: "#22c55e",
    },
    strengthLabel: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#16a34a",
        marginBottom: 4,
        marginTop: 8,
    },
    improvementLabel: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#d97706",
        marginBottom: 4,
        marginTop: 8,
    },

    // Health audit
    scoreTable: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    scoreCell: {
        flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        padding: 10,
        alignItems: "center",
    },
    scoreCellValue: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        marginBottom: 2,
    },
    scoreCellLabel: {
        fontSize: 8,
        color: "#737373",
        textTransform: "uppercase",
    },
    scoreCellPattern: {
        fontSize: 8,
        color: "#a3a3a3",
        marginTop: 2,
        textAlign: "center",
    },

    // Finding card
    findingCard: {
        borderLeftWidth: 3,
        borderRadius: 4,
        padding: 10,
        marginBottom: 8,
        backgroundColor: "#fafafa",
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: "#e5e5e5",
        borderRightColor: "#e5e5e5",
        borderBottomColor: "#e5e5e5",
    },
    findingHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
        flexWrap: "wrap",
    },
    findingBadge: {
        borderRadius: 10,
        paddingVertical: 1,
        paddingHorizontal: 6,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
    },
    findingTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#171717",
        flex: 1,
    },
    findingDesc: {
        fontSize: 9,
        color: "#525252",
        lineHeight: 1.5,
        marginBottom: 4,
    },
    findingFile: {
        fontFamily: "Courier",
        fontSize: 8,
        color: "#737373",
        backgroundColor: "#f5f5f5",
        paddingVertical: 1,
        paddingHorizontal: 4,
        borderRadius: 3,
        marginBottom: 4,
    },
    findingRec: {
        fontSize: 9,
        color: "#15803d",
        lineHeight: 1.4,
    },
    findingRecArrow: {
        fontSize: 9,
        color: "#22c55e",
        marginRight: 4,
    },

    // Sub-section heading (within health audit)
    subHeading: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#262626",
        marginTop: 16,
        marginBottom: 8,
    },

    // Footer
    footer: {
        position: "absolute",
        bottom: 24,
        left: 48,
        right: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.5,
        borderTopColor: "#e5e5e5",
        paddingTop: 8,
    },
    footerText: {
        fontSize: 8,
        color: "#a3a3a3",
    },
    pageNumber: {
        fontSize: 8,
        color: "#a3a3a3",
    },
});

// ─── Severity helpers ─────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<AuditSeverity, { border: string; bg: string; text: string; label: string }> = {
    critical: { border: "#ef4444", bg: "#fef2f2", text: "#b91c1c", label: "Critical" },
    high:     { border: "#f97316", bg: "#fff7ed", text: "#c2410c", label: "Warning" },
    medium:   { border: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8", label: "Info" },
    low:      { border: "#a3a3a3", bg: "#fafafa", text: "#525252", label: "Low" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Footer({ repoName }: { repoName: string }) {
    return (
        <View style={S.footer} fixed>
            <Text style={S.footerText}>CodebaseNarrator · {repoName}</Text>
            <Text style={S.pageNumber} render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
            } />
        </View>
    );
}

function SectionTitle({ children }: { children: string }) {
    return <Text style={S.sectionTitle}>{children}</Text>;
}

function BulletList({ items }: { items: string[] }) {
    return (
        <View>
            {items.map((item, i) => (
                <View key={i} style={S.listItem}>
                    <Text style={S.bullet}>•</Text>
                    <Text style={S.listText}>{item}</Text>
                </View>
            ))}
        </View>
    );
}

function FindingCard({
    severity,
    title,
    description,
    file,
    recommendation,
    badge,
}: {
    severity: AuditSeverity;
    title: string;
    description: string;
    file?: string;
    recommendation: string;
    badge?: string;
}) {
    const cfg = SEVERITY_COLORS[severity];
    return (
        <View style={[S.findingCard, { borderLeftColor: cfg.border }]}>
            <View style={S.findingHeader}>
                <Text style={[S.findingBadge, { backgroundColor: cfg.bg, color: cfg.text }]}>
                    {cfg.label}
                </Text>
                {badge && (
                    <Text style={[S.findingBadge, { backgroundColor: "#f5f5f5", color: "#737373" }]}>
                        {badge}
                    </Text>
                )}
                <Text style={S.findingTitle}>{title}</Text>
            </View>
            <Text style={S.findingDesc}>{description}</Text>
            {file && <Text style={S.findingFile}>{file}</Text>}
            <View style={{ flexDirection: "row" }}>
                <Text style={S.findingRecArrow}>→</Text>
                <Text style={S.findingRec}>{recommendation}</Text>
            </View>
        </View>
    );
}

function HealthAuditSection({ audit }: { audit: HealthAudit }) {
    return (
        <View>
            <SectionTitle>Health Audit</SectionTitle>

            {/* Score table */}
            <View style={S.scoreTable}>
                <View style={S.scoreCell}>
                    <Text style={[S.scoreCellValue, { color: "#ef4444" }]}>{audit.security.score}</Text>
                    <Text style={S.scoreCellLabel}>Security</Text>
                </View>
                <View style={S.scoreCell}>
                    <Text style={[S.scoreCellValue, { color: "#3b82f6" }]}>{audit.maintainability.index}</Text>
                    <Text style={S.scoreCellLabel}>Maintainability</Text>
                </View>
                <View style={S.scoreCell}>
                    <Text style={[S.scoreCellValue, { color: "#a855f7" }]}>{audit.architecture.rating}</Text>
                    <Text style={S.scoreCellLabel}>Architecture</Text>
                    {audit.architecture.pattern && (
                        <Text style={S.scoreCellPattern}>{audit.architecture.pattern}</Text>
                    )}
                </View>
            </View>

            {/* Security findings */}
            <Text style={S.subHeading}>Security</Text>
            {audit.security.findings.length === 0 ? (
                <Text style={S.body}>No security issues detected.</Text>
            ) : (
                audit.security.findings.map((f, i) => (
                    <FindingCard key={i} {...f} />
                ))
            )}

            {/* Maintainability findings */}
            <Text style={S.subHeading}>Maintainability</Text>
            {audit.maintainability.findings.length === 0 ? (
                <Text style={S.body}>No maintainability issues detected.</Text>
            ) : (
                audit.maintainability.findings.map((f, i) => (
                    <FindingCard
                        key={i}
                        severity={f.severity}
                        title={f.title}
                        description={f.description}
                        file={f.file}
                        recommendation={f.recommendation}
                        badge={f.type.replace(/_/g, " ")}
                    />
                ))
            )}

            {/* Architecture findings */}
            <Text style={S.subHeading}>Architecture</Text>
            {audit.architecture.findings.length === 0 ? (
                <Text style={S.body}>No architectural concerns detected.</Text>
            ) : (
                audit.architecture.findings.map((f, i) => (
                    <FindingCard key={i} {...f} />
                ))
            )}
        </View>
    );
}

// ─── Main Document ────────────────────────────────────────────────────────────

interface Props {
    result: AnalysisResult;
    stats?: AnalysisStats;
    generatedAt: string;
}

export function AnalysisPdfDocument({ result, stats, generatedAt }: Props) {
    const { repoInfo, analysis } = result;
    const effectiveStats = stats ?? result.stats;

    return (
        <Document
            title={`${repoInfo.name} — Codebase Analysis`}
            author="CodebaseNarrator"
            subject="AI-generated repository analysis"
        >
            <Page size="A4" style={S.page}>
                <Footer repoName={repoInfo.name} />

                {/* Cover block */}
                <View style={S.coverBlock}>
                    <Text style={S.coverRepo}>{repoInfo.name}</Text>
                    {repoInfo.description && (
                        <Text style={S.coverDesc}>{repoInfo.description}</Text>
                    )}
                    <View style={S.coverMeta}>
                        <Link style={S.coverLink} src={repoInfo.url}>
                            {repoInfo.url}
                        </Link>
                        <Text style={S.coverMetaItem}>★ {repoInfo.stars.toLocaleString()}</Text>
                        {repoInfo.language && (
                            <Text style={S.coverMetaItem}>{repoInfo.language}</Text>
                        )}
                    </View>
                    {repoInfo.topics.length > 0 && (
                        <View style={S.tagRow}>
                            {repoInfo.topics.map((t) => (
                                <Text key={t} style={S.tag}>{t}</Text>
                            ))}
                        </View>
                    )}
                    {effectiveStats && (
                        <View style={S.statsRow}>
                            <Text style={S.statsPill}>
                                {(effectiveStats.executionTimeMs / 1000).toFixed(1)}s
                            </Text>
                            <Text style={S.statsPill}>
                                {effectiveStats.totalTokens.toLocaleString()} tokens
                            </Text>
                            <Text style={S.statsPill}>
                                ${effectiveStats.estimatedCostUsd.toFixed(4)}
                            </Text>
                            <Text style={S.statsPill}>
                                {effectiveStats.filesSent}/{effectiveStats.totalFiles} files analyzed
                            </Text>
                        </View>
                    )}
                    <Text style={S.coverTimestamp}>Generated {generatedAt}</Text>
                </View>

                {/* Summary */}
                <SectionTitle>Project Summary</SectionTitle>
                <Text style={S.body}>{analysis.summary}</Text>

                {/* Tech Stack */}
                <SectionTitle>Tech Stack</SectionTitle>
                <View style={S.tagRow}>
                    {analysis.techStack.map((t) => (
                        <Text key={t} style={S.tag}>{t}</Text>
                    ))}
                </View>

                {/* Architecture */}
                <SectionTitle>Architecture</SectionTitle>
                <Text style={S.body}>{analysis.architecture}</Text>

                {/* Key Features */}
                <SectionTitle>Key Features</SectionTitle>
                <BulletList items={analysis.keyFeatures} />

                {/* Code Quality */}
                {analysis.codeQuality && (
                    <View>
                        <SectionTitle>Code Quality</SectionTitle>
                        <View style={S.scoreRow}>
                            <Text style={S.scoreLabel}>Overall Score</Text>
                            <Text style={S.scoreValue}>{analysis.codeQuality.score}/100</Text>
                        </View>
                        <View style={S.barTrack}>
                            <View style={[S.barFill, { width: `${analysis.codeQuality.score}%` }]} />
                        </View>
                        {analysis.codeQuality.strengths.length > 0 && (
                            <View>
                                <Text style={S.strengthLabel}>Strengths</Text>
                                <BulletList items={analysis.codeQuality.strengths.map((s) => `+ ${s}`)} />
                            </View>
                        )}
                        {analysis.codeQuality.improvements.length > 0 && (
                            <View>
                                <Text style={S.improvementLabel}>Areas for Improvement</Text>
                                <BulletList items={analysis.codeQuality.improvements.map((s) => `→ ${s}`)} />
                            </View>
                        )}
                    </View>
                )}

                {/* Data Flow */}
                {analysis.dataFlow && (
                    <View>
                        <SectionTitle>Data Flow</SectionTitle>
                        <Text style={S.body}>{analysis.dataFlow}</Text>
                    </View>
                )}

                {/* Entry Points */}
                {analysis.entryPoints && analysis.entryPoints.length > 0 && (
                    <View>
                        <SectionTitle>Entry Points</SectionTitle>
                        <View style={S.tagRow}>
                            {analysis.entryPoints.map((e) => (
                                <Text key={e} style={S.tagMono}>{e}</Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Health Audit */}
                {analysis.healthAudit && (
                    <HealthAuditSection audit={analysis.healthAudit} />
                )}
            </Page>
        </Document>
    );
}
