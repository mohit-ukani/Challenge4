import { TelemetryPayload, ContextPayload, ValidationResult } from "./types";

/**
 * Validates and normalizes/coerces raw input payload objects.
 * Never throws runtime errors. Gracefully falls back to defaults for missing or malformed inputs.
 *
 * @param parsedJson Unverified javascript object parsed from input textarea
 * @returns ValidationResult with coerced payloads and warning descriptions
 */
export function validatePayload(parsedJson: unknown): ValidationResult {
  const errors: string[] = [];

  // Initialize with fallback defaults
  const currentHourMin = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const defaultTelemetry: TelemetryPayload = {
    zone_id: "UNKNOWN",
    current_crowd_density: 0,
    ambient_noise_levels: 0,
    incident_flag: false,
  };

  const defaultContext: ContextPayload = {
    local_time: currentHourMin(),
    stadium_capacity_limit: 80000,
    language_preference: "en",
  };

  if (!parsedJson || typeof parsedJson !== "object") {
    return {
      isValid: false,
      telemetry: defaultTelemetry,
      context: defaultContext,
      errors: ["Input payload is missing or not a valid JSON object."],
    };
  }

  const raw = parsedJson as Record<string, unknown>;
  const telemetry = { ...defaultTelemetry };
  const context = { ...defaultContext };

  // --- Validate Telemetry Payload ---

  // 1. zone_id validation and coercion
  if ("zone_id" in raw) {
    if (raw.zone_id === null || raw.zone_id === undefined) {
      errors.push("Missing 'zone_id', using fallback default 'UNKNOWN'.");
    } else {
      telemetry.zone_id = String(raw.zone_id).trim();
      if (telemetry.zone_id === "") {
        telemetry.zone_id = "UNKNOWN";
        errors.push("Empty 'zone_id' corrected to default 'UNKNOWN'.");
      }
    }
  } else {
    errors.push(
      "Missing required field 'zone_id', using fallback default 'UNKNOWN'.",
    );
  }

  // 2. current_crowd_density validation and coercion (0-100)
  if ("current_crowd_density" in raw) {
    const rawDensity = raw.current_crowd_density;
    if (rawDensity === null || rawDensity === undefined) {
      errors.push("Missing 'current_crowd_density', using fallback default 0.");
    } else {
      const parsedDensity = Number(rawDensity);
      if (Number.isNaN(parsedDensity) || !Number.isFinite(parsedDensity)) {
        errors.push(
          `Malformed 'current_crowd_density' (${rawDensity}) coerced to 0.`,
        );
      } else {
        // Range clamping
        if (parsedDensity < 0) {
          telemetry.current_crowd_density = 0;
          errors.push(
            `Crowd density (${parsedDensity}%) clamped to minimum of 0%.`,
          );
        } else if (parsedDensity > 100) {
          telemetry.current_crowd_density = 100;
          errors.push(
            `Crowd density (${parsedDensity}%) clamped to maximum of 100%.`,
          );
        } else {
          telemetry.current_crowd_density = parsedDensity;
        }
      }
    }
  } else {
    errors.push(
      "Missing required field 'current_crowd_density', defaulting to 0.",
    );
  }

  // 3. ambient_noise_levels validation and coercion
  if ("ambient_noise_levels" in raw) {
    const rawNoise = raw.ambient_noise_levels;
    if (rawNoise === null || rawNoise === undefined) {
      errors.push("Missing 'ambient_noise_levels', defaulting to 0.");
    } else {
      const parsedNoise = Number(rawNoise);
      if (Number.isNaN(parsedNoise) || !Number.isFinite(parsedNoise)) {
        errors.push(
          `Malformed 'ambient_noise_levels' (${rawNoise}) coerced to 0 dB.`,
        );
      } else {
        if (parsedNoise < 0) {
          telemetry.ambient_noise_levels = 0;
          errors.push(
            `Ambient noise (${parsedNoise} dB) clamped to minimum of 0 dB.`,
          );
        } else if (parsedNoise > 200) {
          telemetry.ambient_noise_levels = 200;
          errors.push(
            `Ambient noise (${parsedNoise} dB) clamped to maximum of 200 dB.`,
          );
        } else {
          telemetry.ambient_noise_levels = parsedNoise;
        }
      }
    }
  } else {
    errors.push(
      "Missing required field 'ambient_noise_levels', defaulting to 0 dB.",
    );
  }

  // 4. incident_flag validation and coercion
  if ("incident_flag" in raw) {
    const rawFlag = raw.incident_flag;
    if (rawFlag === null || rawFlag === undefined) {
      errors.push("Missing 'incident_flag', defaulting to false.");
    } else {
      // Coerce truthy/falsy to strict boolean
      telemetry.incident_flag = Boolean(rawFlag);
      if (typeof rawFlag !== "boolean") {
        errors.push(
          `Coerced non-boolean 'incident_flag' (${rawFlag}) to ${telemetry.incident_flag}.`,
        );
      }
    }
  } else {
    errors.push("Missing required field 'incident_flag', defaulting to false.");
  }

  // --- Validate Context Payload ---
  const nested =
    raw.context && typeof raw.context === "object"
      ? (raw.context as Record<string, unknown>)
      : null;

  // 5. local_time validation (HH:MM)
  const timeVal =
    nested && "local_time" in nested
      ? nested.local_time
      : "local_time" in raw
        ? raw.local_time
        : undefined;
  if (timeVal !== undefined) {
    const rawTime = String(timeVal).trim();
    const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeFormatRegex.test(rawTime)) {
      context.local_time = rawTime;
    } else {
      errors.push(
        `Invalid 'local_time' format (${rawTime}), fallback to current time: ${context.local_time}.`,
      );
    }
  } else {
    errors.push(
      `Missing 'local_time' field, defaulting to current system time: ${context.local_time}.`,
    );
  }

  // 6. stadium_capacity_limit validation
  const capacityVal =
    nested && "stadium_capacity_limit" in nested
      ? nested.stadium_capacity_limit
      : "stadium_capacity_limit" in raw
        ? raw.stadium_capacity_limit
        : undefined;
  if (capacityVal !== undefined) {
    if (capacityVal === null) {
      errors.push(
        "Missing 'stadium_capacity_limit', using fallback default 80000.",
      );
    } else {
      const parsedCapacity = Number(capacityVal);
      if (
        Number.isNaN(parsedCapacity) ||
        !Number.isFinite(parsedCapacity) ||
        parsedCapacity <= 0
      ) {
        errors.push(
          `Invalid 'stadium_capacity_limit' (${capacityVal}), defaulting to 80000.`,
        );
      } else {
        context.stadium_capacity_limit = Math.floor(parsedCapacity);
      }
    }
  } else {
    errors.push("Missing 'stadium_capacity_limit', defaulting to 80000.");
  }

  // 7. language_preference validation
  const langVal =
    nested && "language_preference" in nested
      ? nested.language_preference
      : "language_preference" in raw
        ? raw.language_preference
        : undefined;
  if (langVal !== undefined) {
    const rawLang = String(langVal).trim().toLowerCase();
    if (
      rawLang === "en" ||
      rawLang === "es" ||
      rawLang === "fr" ||
      rawLang === "ar"
    ) {
      context.language_preference = rawLang;
    } else {
      errors.push(
        `Unsupported language '${rawLang}', fallback to 'en'. Supported: en, es, fr, ar.`,
      );
    }
  }

  return {
    isValid: true, // We successfully parsed and recovered state using defaults
    telemetry,
    context,
    errors,
  };
}
