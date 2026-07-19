/**
 * System status states.
 * - 'nominal': Operating normally, density <= 60% and no incidents.
 * - 'warning': Elevated density (61-80%) or high noise levels.
 * - 'alert': Critical density (> 80%) or active security incident.
 */
export type SystemStatus = "nominal" | "warning" | "alert";

/**
 * Valid language/locale preferences for localized telemetry warnings and traces.
 */
export type Locale = "en" | "es" | "fr" | "ar";

/**
 * Core Telemetry Data Payload mapping to physical stadium sensor telemetry.
 * Must match the spec exactly: snake_case keys.
 */
export interface TelemetryPayload {
  /** Unique identifier of the stadium zone */
  zone_id: string;
  /** Current crowd density level in percent (0 - 100) */
  current_crowd_density: number;
  /** Ambient noise levels measured in decibels (dB) */
  ambient_noise_levels: number;
  /** Direct flag indicating a active/detected security incident */
  incident_flag: boolean;
}

/**
 * Context Payload mapping to structural tournament operations parameters.
 * Must match the spec exactly: snake_case keys.
 */
export interface ContextPayload {
  /** Local 24-hour clock time (HH:MM format) */
  local_time: string;
  /** Total maximum seating/standing capacity limit of the venue */
  stadium_capacity_limit: number;
  /** Active language selector for evaluation warnings */
  language_preference: Locale;
}

/**
 * Represents the complete read-only state of the Stadium operations.
 */
export interface StadiumState {
  /** Checked and sanitized telemetry payload */
  telemetry: TelemetryPayload;
  /** Operations context metadata */
  context: ContextPayload;
  /** Overall evaluated system state */
  system_status: SystemStatus;
  /** String detailing step-by-step evaluation checks */
  reasoning_chain: string;
  /** Localized array of specific issues found */
  warnings: string[];
  /** Epoch timestamp of last state update */
  last_updated: number;
}

/**
 * Results of payload schema validation and type coercion.
 */
export interface ValidationResult {
  /** True if input format is correct and coercion succeeded */
  isValid: boolean;
  /** Coerced/parsed telemetry data if partially valid, otherwise null */
  telemetry: TelemetryPayload | null;
  /** Coerced/parsed context data if partially valid, otherwise null */
  context: ContextPayload | null;
  /** Set of user-facing input format error messages */
  errors: string[];
}

/**
 * Result of the string/JSON sanitization process.
 */
export interface SanitizationResult {
  /** Fully sanitized XSS-safe raw string */
  sanitizedText: string;
  /** Flag specifying if any malicious script/injection was detected and neutralized */
  hadInjection: boolean;
}
