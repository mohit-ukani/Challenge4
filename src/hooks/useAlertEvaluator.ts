import { useMemo } from 'react';
import { TelemetryPayload, ContextPayload } from '../core/types';
import { evaluateTelemetry, EvaluationResult } from '../core/alert-evaluator';

/**
 * Custom React Hook that returns memoized telemetry alerts and reasoning.
 * Prevents redundant computations when telemetry inputs remain unchanged.
 *
 * @param telemetry Telemetry data object
 * @param context Context metadata object
 */
export function useAlertEvaluator(
  telemetry: TelemetryPayload,
  context: ContextPayload
): EvaluationResult {
  return useMemo(() => {
    return evaluateTelemetry(telemetry, context);
  }, [
    telemetry.zone_id,
    telemetry.current_crowd_density,
    telemetry.ambient_noise_levels,
    telemetry.incident_flag,
    context.local_time,
    context.stadium_capacity_limit,
    context.language_preference,
  ]);
}
