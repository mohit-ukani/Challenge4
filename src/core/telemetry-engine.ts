import {
  StadiumState,
  TelemetryPayload,
  ContextPayload,
  Locale,
} from "./types";
import { evaluateTelemetry } from "./alert-evaluator";

export type TelemetryAction =
  | {
      type: "UPDATE_STATE";
      payload: { telemetry: TelemetryPayload; context: ContextPayload };
    }
  | { type: "SET_LOCALE"; payload: Locale }
  | { type: "RESET" };

/**
 * Creates the initial nominal Stadium state.
 */
export function getInitialState(locale: Locale = "en"): StadiumState {
  const defaultTelemetry: TelemetryPayload = {
    zone_id: "Z-01",
    current_crowd_density: 45,
    ambient_noise_levels: 72,
    incident_flag: false,
  };

  const defaultContext: ContextPayload = {
    local_time: "18:00",
    stadium_capacity_limit: 80000,
    language_preference: locale,
  };

  const evaluation = evaluateTelemetry(defaultTelemetry, defaultContext);

  return {
    telemetry: defaultTelemetry,
    context: defaultContext,
    system_status: evaluation.system_status,
    reasoning_chain: evaluation.reasoning_chain,
    warnings: evaluation.warnings,
    last_updated: Date.now(),
  };
}

/**
 * Pure state reducer manager for stadium operations.
 * Separates presentation components from core state transformation logic.
 *
 * @param state Current StadiumState
 * @param action Triggered TelemetryAction
 * @returns New StadiumState (immutable update)
 */
export function telemetryReducer(
  state: StadiumState,
  action: TelemetryAction,
): StadiumState {
  switch (action.type) {
    case "UPDATE_STATE": {
      const { telemetry, context } = action.payload;

      // Calculate evaluation on updated state
      const evaluation = evaluateTelemetry(telemetry, context);

      return {
        telemetry,
        context,
        system_status: evaluation.system_status,
        reasoning_chain: evaluation.reasoning_chain,
        warnings: evaluation.warnings,
        last_updated: Date.now(),
      };
    }

    case "SET_LOCALE": {
      const updatedContext: ContextPayload = {
        ...state.context,
        language_preference: action.payload,
      };

      const evaluation = evaluateTelemetry(state.telemetry, updatedContext);

      return {
        ...state,
        context: updatedContext,
        system_status: evaluation.system_status,
        reasoning_chain: evaluation.reasoning_chain,
        warnings: evaluation.warnings,
        last_updated: Date.now(),
      };
    }

    case "RESET":
      return getInitialState();

    default:
      return state;
  }
}
