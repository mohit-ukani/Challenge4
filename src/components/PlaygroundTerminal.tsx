import React, { useState, useEffect } from "react";
import { TelemetryPayload, ContextPayload, Locale } from "../core/types";
import { useI18n } from "../hooks/useI18n";

interface PlaygroundTerminalProps {
  onInjectRawPayload: (rawJsonString: string) => boolean;
  onInjectDirectState: (
    telemetry: TelemetryPayload,
    context: ContextPayload,
  ) => void;
  onReset: () => void;
  validationErrors: string[];
  validationPassed: boolean | null;
  hadSanitizationAlert: boolean;
  locale: string;
}

/**
 * Playground panel for evaluators.
 * Features presets, validation logging, and XSS attack mitigation banners.
 */
// Static preset templates defined outside of the component to prevent garbage collection churn
const PRESET_ALPHA_TELEMETRY = {
  zone_id: "ZONE-A1",
  current_crowd_density: 42,
  ambient_noise_levels: 65,
  incident_flag: false,
};

const PRESET_BETA_TELEMETRY = {
  zone_id: "ZONE-B3",
  current_crowd_density: 92,
  ambient_noise_levels: 110,
  incident_flag: true,
};

const PRESET_GAMMA_RAW = `{
  "zone_id": "",
  "current_crowd_density": "ninety-two-percent",
  "ambient_noise_levels": 300,
  "incident_flag": "malformed_string_flag",
  "local_time": "twenty-four-hours",
  "stadium_capacity_limit": -500
}`;

export const PlaygroundTerminal: React.FC<PlaygroundTerminalProps> = React.memo(
  ({
    onInjectRawPayload,
    onInjectDirectState,
    onReset,
    validationErrors,
    validationPassed,
    hadSanitizationAlert,
    locale,
  }) => {
    const { t } = useI18n(locale as any);
    const [jsonText, setJsonText] = useState("");

    // Sync JSON text field with presets on initial load or reset
    useEffect(() => {
      const alphaInit = {
        telemetry: PRESET_ALPHA_TELEMETRY,
        context: {
          local_time: "14:30",
          stadium_capacity_limit: 80000,
          language_preference: locale as Locale,
        },
      };
      setJsonText(JSON.stringify(alphaInit, null, 2));
    }, [locale]);

    const handleApplyPresetAlpha = () => {
      const data = {
        telemetry: PRESET_ALPHA_TELEMETRY,
        context: {
          local_time: "14:30",
          stadium_capacity_limit: 80000,
          language_preference: locale as Locale,
        },
      };
      setJsonText(JSON.stringify(data, null, 2));
      onInjectDirectState(data.telemetry, data.context);
    };

    const handleApplyPresetBeta = () => {
      const data = {
        telemetry: PRESET_BETA_TELEMETRY,
        context: {
          local_time: "20:15",
          stadium_capacity_limit: 80000,
          language_preference: locale as Locale,
        },
      };
      setJsonText(JSON.stringify(data, null, 2));
      onInjectDirectState(data.telemetry, data.context);
    };

    const handleApplyPresetGamma = () => {
      setJsonText(PRESET_GAMMA_RAW);
      onInjectRawPayload(PRESET_GAMMA_RAW);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onInjectRawPayload(jsonText);
    };

    const handleReset = () => {
      const data = {
        telemetry: PRESET_ALPHA_TELEMETRY,
        context: {
          local_time: "14:30",
          stadium_capacity_limit: 80000,
          language_preference: locale as Locale,
        },
      };
      setJsonText(JSON.stringify(data, null, 2));
      onReset();
    };

    return (
      <aside className="aside-panel" aria-labelledby="terminal-title">
        <h2
          id="terminal-title"
          style={{
            fontSize: "1.2rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {t("ui.terminal_title")}
        </h2>

        {/* Preset scenario validation panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <h3 style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {t("ui.presets")}
          </h3>
          <button
            onClick={handleApplyPresetAlpha}
            style={{
              textAlign: "left",
              padding: "var(--space-2) var(--space-3)",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {t("ui.preset_alpha")}
          </button>
          <button
            onClick={handleApplyPresetBeta}
            style={{
              textAlign: "left",
              padding: "var(--space-2) var(--space-3)",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {t("ui.preset_beta")}
          </button>
          <button
            onClick={handleApplyPresetGamma}
            style={{
              textAlign: "left",
              padding: "var(--space-2) var(--space-3)",
              backgroundColor: "var(--bg-surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {t("ui.preset_gamma")}
          </button>
        </div>

        {/* Raw JSON input textarea */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <label
            htmlFor="raw-json-textarea"
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {t("ui.raw_json")}
          </label>
          <textarea
            id="raw-json-textarea"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "var(--space-3)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              lineHeight: "1.4",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "var(--space-2)",
                backgroundColor: "var(--accent)",
                color: "var(--bg-primary)",
                border: "none",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {t("ui.submit")}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "var(--space-2) var(--space-4)",
                backgroundColor: "var(--bg-surface-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {t("ui.reset")}
            </button>
          </div>
        </form>

        {/* XSS Security Alert Banner */}
        {hadSanitizationAlert && (
          <div
            role="alert"
            style={{
              backgroundColor: "var(--bg-danger-mute)",
              border: "1px solid var(--accent-danger)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius)",
              color: "var(--accent-danger)",
              fontSize: "0.8rem",
              fontWeight: "bold",
              lineHeight: "1.4",
            }}
          >
            {t("ui.xss_alert")}
          </div>
        )}

        {/* Validation status logger */}
        <div
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "var(--space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            fontSize: "0.8rem",
          }}
        >
          <span style={{ fontWeight: "bold", color: "var(--text-secondary)" }}>
            {t("ui.validator_errors")}
          </span>
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {validationPassed === true && (
              <span style={{ color: "var(--accent)" }}>
                ✓ {t("ui.validator_success")}
              </span>
            )}
            {validationErrors.map((err, i) => (
              <span
                key={i}
                style={{ color: "var(--accent-warning)", display: "block" }}
              >
                ! {err}
              </span>
            ))}
            {validationPassed === null && validationErrors.length === 0 && (
              <span
                style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}
              >
                {t("ui.waiting_stream")}
              </span>
            )}
          </div>
        </div>
      </aside>
    );
  },
);

PlaygroundTerminal.displayName = "PlaygroundTerminal";
