import React from "react";
import { GeminiAnalysisResult } from "../core/gemini-service";
import { AnalysisState } from "../hooks/useGeminiAnalysis";
import { SystemStatus } from "../core/types";
import { useI18n } from "../hooks/useI18n";

interface AIAnalystPanelProps {
  result: GeminiAnalysisResult | null;
  analysisState: AnalysisState;
  errorMessage: string | null;
  lastAnalyzedAt: number | null;
  systemStatus: SystemStatus;
  locale: string;
  onReanalyze: () => void;
}

/**
 * AI Situational Analyst Panel.
 * Displays Gemini-generated briefing, recommended actions, and crowd management tips.
 * Auto-updates on status transitions; supports manual re-analysis.
 * fully translated and screen reader accessible (aria-live polite log region).
 */
export const AIAnalystPanel: React.FC<AIAnalystPanelProps> = React.memo(
  ({
    result,
    analysisState,
    errorMessage,
    lastAnalyzedAt,
    systemStatus,
    locale,
    onReanalyze,
  }) => {
    const { t } = useI18n(locale as any);

    const statusAccent =
      systemStatus === "alert"
        ? "var(--accent-danger)"
        : systemStatus === "warning"
          ? "var(--accent-warning)"
          : "var(--accent)";

    const formatTime = (ts: number) => {
      const d = new Date(ts);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    return (
      <section
        className="card-panel"
        aria-labelledby="ai-analyst-title"
        style={{ gridColumn: "1 / -1" }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "var(--space-3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            {/* Gemini spark icon - decorative */}
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `radial-gradient(circle at 40% 40%, oklch(0.75 0.18 165), oklch(0.45 0.2 260))`,
                fontSize: "14px",
              }}
            >
              ✦
            </span>
            <div>
              <h2 id="ai-analyst-title" style={{ fontSize: "1rem", margin: 0 }}>
                {t("ai.title")}
              </h2>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-tertiary)",
                  margin: 0,
                }}
              >
                {t("ai.subtitle")}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            {lastAnalyzedAt && analysisState !== "loading" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t("ai.last_updated", { time: formatTime(lastAnalyzedAt) })}
              </span>
            )}
            <button
              onClick={onReanalyze}
              disabled={analysisState === "loading"}
              aria-label={
                analysisState === "loading"
                  ? t("ai.analyzing")
                  : t("ai.reanalyze")
              }
              style={{
                padding: "var(--space-1) var(--space-3)",
                backgroundColor:
                  analysisState === "loading"
                    ? "var(--bg-surface-elevated)"
                    : "transparent",
                border: `1px solid ${statusAccent}`,
                borderRadius: "var(--radius)",
                color:
                  analysisState === "loading"
                    ? "var(--text-tertiary)"
                    : statusAccent,
                cursor: analysisState === "loading" ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                fontWeight: "600",
                transition: "all var(--transition-fast)",
                letterSpacing: "0.04em",
              }}
            >
              {analysisState === "loading"
                ? t("ai.analyzing")
                : t("ai.reanalyze")}
            </button>
          </div>
        </div>

        {/* Screen Reader Live Announcements Container */}
        <div
          role="log"
          aria-live="polite"
          aria-atomic="false"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {/* Loading State */}
          {analysisState === "loading" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
                padding: "var(--space-2) 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <div className="ai-spinner" aria-hidden="true" />
                <span
                  style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
                >
                  {t("ai.loading_message")}
                </span>
              </div>
              {/* Skeleton lines */}
              <div
                className="ai-skeleton"
                style={{ width: "100%", height: "14px" }}
              />
              <div
                className="ai-skeleton"
                style={{ width: "80%", height: "14px" }}
              />
              <div
                className="ai-skeleton"
                style={{ width: "90%", height: "14px" }}
              />
            </div>
          )}

          {/* Error State */}
          {analysisState === "error" && errorMessage && (
            <div
              role="alert"
              style={{
                backgroundColor: "var(--bg-danger-mute)",
                border: "1px solid var(--accent-danger)",
                borderRadius: "var(--radius)",
                padding: "var(--space-3)",
                fontSize: "0.85rem",
              }}
            >
              <strong
                style={{
                  color: "var(--accent-danger)",
                  display: "block",
                  marginBottom: "var(--space-1)",
                }}
              >
                {t("ai.error_title")}
              </strong>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                }}
              >
                {errorMessage}
              </span>
              {errorMessage.includes("VITE_GEMINI_API_KEY") && (
                <p
                  style={{
                    color: "var(--text-tertiary)",
                    marginTop: "var(--space-2)",
                    fontSize: "0.8rem",
                  }}
                >
                  {t("ai.key_hint")}
                </p>
              )}
            </div>
          )}

          {/* Idle State (no analysis yet) */}
          {analysisState === "idle" && !result && (
            <p
              style={{
                color: "var(--text-tertiary)",
                fontStyle: "italic",
                fontSize: "0.9rem",
              }}
            >
              {t("ai.waiting")}
            </p>
          )}

          {/* Success State */}
          {analysisState === "success" && result && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              {/* Briefing */}
              <div
                style={{
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: `1px solid ${statusAccent}`,
                  borderLeft: `3px solid ${statusAccent}`,
                  borderRadius: "var(--radius)",
                  padding: "var(--space-4)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    lineHeight: "1.7",
                    color: "var(--text-primary)",
                  }}
                >
                  {result.briefing}
                </p>
              </div>

              {/* Actions + Tips Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "var(--space-4)",
                }}
              >
                {/* Recommended Actions */}
                {result.recommendedActions.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      padding: "var(--space-3)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-3)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "var(--space-2)",
                      }}
                    >
                      {t("ai.actions_header")}
                    </h3>
                    <ol
                      style={{
                        margin: 0,
                        paddingLeft: "var(--space-4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                      }}
                    >
                      {result.recommendedActions.map((action, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-primary)",
                            lineHeight: "1.5",
                          }}
                        >
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Crowd Management Tips */}
                {result.crowdManagementTips.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      padding: "var(--space-3)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-3)",
                        borderBottom: "1px solid var(--border)",
                        paddingBottom: "var(--space-2)",
                      }}
                    >
                      {t("ai.tips_header")}
                    </h3>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "var(--space-4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                      }}
                    >
                      {result.crowdManagementTips.map((tip, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-primary)",
                            lineHeight: "1.5",
                          }}
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  },
);

AIAnalystPanel.displayName = "AIAnalystPanel";
