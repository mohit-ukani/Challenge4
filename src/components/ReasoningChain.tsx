import React from "react";
import { useI18n } from "../hooks/useI18n";

interface ReasoningChainProps {
  reasoningChain: string;
  locale: string;
}

/**
 * Explainable AI (XAI) output panel.
 * Explicitly traces state variables. Rendered inside a polite live region (aria-live="polite").
 */
export const ReasoningChain: React.FC<ReasoningChainProps> = React.memo(
  ({ reasoningChain, locale }) => {
    const { t } = useI18n(locale as any);

    // Function to highlight variables in reasoning chain (e.g. Zone, percentage values, HH:MM times)
    const renderHighlightedChain = (text: string) => {
      if (!text) return null;

      // Simple parser to wrap numbers, percentages, times, and Zone IDs in styling
      const parts = text.split(
        /(\bZone\s+\w+|\b\d+%\b|\b\d{2}:\d{2}\b|\b\d+\s+dB\b)/gi,
      );

      return parts.map((part, idx) => {
        // Check if match pattern to style differently
        const isVariable =
          /Zone\s+\w+/i.test(part) ||
          /\d+%/i.test(part) ||
          /\d{2}:\d{2}/.test(part) ||
          /\d+\s+dB/i.test(part);

        if (isVariable) {
          return (
            <code
              key={idx}
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--accent)",
                backgroundColor: "var(--bg-primary)",
                padding: "2px 4px",
                borderRadius: "2px",
                fontWeight: "600",
                fontSize: "0.9em",
              }}
            >
              {part}
            </code>
          );
        }
        return <span key={idx}>{part}</span>;
      });
    };

    return (
      <section
        className="card-panel"
        aria-labelledby="xai-title"
        style={{ flex: 1 }}
      >
        <h2 id="xai-title" className="card-panel-title">
          {t("ui.xai_header")}
        </h2>

        {/* Screen Reader Polite Live Region container */}
        <div
          id="xai-reasoning-output"
          aria-live="polite"
          aria-atomic="true"
          style={{
            backgroundColor: "var(--bg-surface-elevated)",
            padding: "var(--space-4)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            minHeight: "80px",
            fontSize: "0.95rem",
            lineHeight: "1.7",
            color: "var(--text-primary)",
          }}
        >
          {reasoningChain ? (
            <p style={{ margin: 0 }}>
              {renderHighlightedChain(reasoningChain)}
            </p>
          ) : (
            <p
              style={{
                color: "var(--text-tertiary)",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {t("ui.trace_loading")}
            </p>
          )}
        </div>
      </section>
    );
  },
);

ReasoningChain.displayName = "ReasoningChain";
