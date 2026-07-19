import { useReducer, useState, useCallback } from 'react';
import { StadiumState, Locale, TelemetryPayload, ContextPayload } from '../core/types';
import { telemetryReducer, getInitialState } from '../core/telemetry-engine';
import { sanitizeInput, decodeSanitizedText } from '../core/input-sanitizer';
import { validatePayload } from '../core/validators';

export interface TelemetryEngineHook {
  state: StadiumState;
  validationErrors: string[];
  validationPassed: boolean | null;
  hadSanitizationAlert: boolean;
  updateTelemetryAndContext: (rawJsonString: string) => boolean;
  updateDirectState: (telemetry: TelemetryPayload, context: ContextPayload) => void;
  setLocale: (locale: Locale) => void;
  reset: () => void;
}

/**
 * Custom React Hook connecting presentation components to the Telemetry Engine logic.
 * Encapsulates reducer logic, input sanitization, and verification pipelines.
 */
export function useTelemetryEngine(initialLocale: Locale = 'en'): TelemetryEngineHook {
  const [state, dispatch] = useReducer(telemetryReducer, getInitialState(initialLocale));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);
  const [hadSanitizationAlert, setHadSanitizationAlert] = useState<boolean>(false);

  /**
   * Main entry pipeline for playground data updates.
   * Runs raw string payloads through Sanitization, Safe Parsing, and Validation.
   *
   * @param rawJsonString Raw input string from textarea
   * @returns true if state successfully updated, false otherwise
   */
  const updateTelemetryAndContext = useCallback((rawJsonString: string): boolean => {
    // 1. Sanitization (XSS Defense)
    const { sanitizedText, hadInjection } = sanitizeInput(rawJsonString);
    setHadSanitizationAlert(hadInjection);

    // Revert escaping just to perform JSON parse safely
    const unescapedText = decodeSanitizedText(sanitizedText);

    // 2. Safe Parsing
    let parsedObj: unknown;
    try {
      if (unescapedText.trim() === '') {
        setValidationErrors(['Payload input is empty.']);
        setValidationPassed(false);
        return false;
      }
      parsedObj = JSON.parse(unescapedText);
    } catch (err) {
      setValidationErrors([`Invalid JSON format: ${(err as Error).message}`]);
      setValidationPassed(false);
      return false;
    }

    // 3. Validation & Type Coercion (Edge-case resiliency)
    const validation = validatePayload(parsedObj);
    setValidationErrors(validation.errors);
    setValidationPassed(validation.errors.length === 0);

    // Even if validation had warnings/coercions, we can still construct a payload
    if (validation.isValid && validation.telemetry && validation.context) {
      // Maintain selected locale instead of overriding with default unless provided
      const currentLocale = state.context.language_preference;
      const targetContext = { ...validation.context };
      
      // If the incoming context doesn't explicitly define lang preference, keep current state locale
      const rawObj = parsedObj as Record<string, unknown>;
      if (!('language_preference' in rawObj)) {
        targetContext.language_preference = currentLocale;
      }

      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          telemetry: validation.telemetry,
          context: targetContext,
        },
      });
      return true;
    }

    return false;
  }, [state.context.language_preference]);

  /**
   * Directly sets the telemetry and context state. Useful for preset scenarios.
   */
  const updateDirectState = useCallback((telemetry: TelemetryPayload, context: ContextPayload) => {
    setValidationErrors([]);
    setValidationPassed(true);
    setHadSanitizationAlert(false);
    dispatch({
      type: 'UPDATE_STATE',
      payload: { telemetry, context },
    });
  }, []);

  /**
   * Sets the language preference locale.
   */
  const setLocale = useCallback((locale: Locale) => {
    dispatch({ type: 'SET_LOCALE', payload: locale });
  }, []);

  /**
   * Resets status to the initial stadium nominal state.
   */
  const reset = useCallback(() => {
    setValidationErrors([]);
    setValidationPassed(null);
    setHadSanitizationAlert(false);
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    validationErrors,
    validationPassed,
    hadSanitizationAlert,
    updateTelemetryAndContext,
    updateDirectState,
    setLocale,
    reset,
  };
}
