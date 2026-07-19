import { TelemetryPayload, ContextPayload, SystemStatus } from "./types";
import { translate } from "./i18n";

export interface EvaluationResult {
  system_status: SystemStatus;
  reasoning_chain: string;
  warnings: string[];
}

/**
 * Explicit, deterministic evaluation function (Explainable AI - XAI).
 * Analyzes stadium telemetry and context payloads under strict constraints.
 *
 * Evaluation Rules:
 * 1. If crowd density > 80% OR incident_flag is true, system status is immediately "alert".
 * 2. Otherwise, if crowd density > 60% OR ambient noise > 95 dB, system status is "warning".
 * 3. Otherwise, system status is "nominal".
 *
 * Generates a structured reasoning chain detailing variable triggers.
 * All output strings are fully translated based on language_preference.
 */
export function evaluateTelemetry(
  telemetry: TelemetryPayload,
  context: ContextPayload,
): EvaluationResult {
  const warnings: string[] = [];
  const reasoningSteps: string[] = [];
  let status: SystemStatus = "nominal";
  const lang = context.language_preference;

  const params = {
    time: context.local_time,
    zone: telemetry.zone_id,
    density: telemetry.current_crowd_density,
    noise: telemetry.ambient_noise_levels,
  };

  // Check Alert Conditions
  const isCrowdDensityAlert = telemetry.current_crowd_density > 80;
  const isIncidentAlert = telemetry.incident_flag;

  if (isCrowdDensityAlert || isIncidentAlert) {
    status = "alert";

    if (isCrowdDensityAlert) {
      const msg = translate("reasoning.density_alert", params, lang);
      warnings.push(msg);
      reasoningSteps.push(msg);
    }

    if (isIncidentAlert) {
      const msg = translate("reasoning.incident_flag", params, lang);
      warnings.push(msg);
      reasoningSteps.push(msg);
    }
  }
  // Check Warning Conditions
  else {
    const isCrowdDensityWarning = telemetry.current_crowd_density > 60;
    const isNoiseWarning = telemetry.ambient_noise_levels > 95;

    if (isCrowdDensityWarning || isNoiseWarning) {
      status = "warning";

      if (isCrowdDensityWarning) {
        const msg = translate("reasoning.density_warning", params, lang);
        warnings.push(msg);
        reasoningSteps.push(msg);
      }

      if (isNoiseWarning) {
        const msg = translate("reasoning.noise_warning", params, lang);
        warnings.push(msg);
        reasoningSteps.push(msg);
      }
    }
  }

  // Handle Nominal Case
  if (status === "nominal") {
    const msg = translate("reasoning.nominal", params, lang);
    reasoningSteps.push(msg);
  }

  // Combine reasoning steps into a cohesive explicit tracing string
  const reasoning_chain = reasoningSteps.join(" ");

  return {
    system_status: status,
    reasoning_chain,
    warnings,
  };
}
