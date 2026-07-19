import { useState, useEffect, useRef, useCallback } from 'react';
import { TelemetryPayload, ContextPayload, SystemStatus } from '../core/types';
import { generateSituationalAnalysis, GeminiAnalysisResult } from '../core/gemini-service';

export type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

export interface GeminiAnalysisHook {
  result: GeminiAnalysisResult | null;
  analysisState: AnalysisState;
  errorMessage: string | null;
  lastAnalyzedAt: number | null;
  triggerAnalysis: () => void;
}

/**
 * Custom React hook that integrates with the Gemini AI service to generate
 * situational analysis briefings from live stadium telemetry.
 *
 * Auto-triggers on system status changes (nominal → warning → alert transitions).
 * Also supports manual re-analysis via triggerAnalysis().
 *
 * Debounced to prevent hammering the API on rapid state updates.
 */
export function useGeminiAnalysis(
  telemetry: TelemetryPayload,
  context: ContextPayload,
  systemStatus: SystemStatus,
  locale: string
): GeminiAnalysisHook {
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<number | null>(null);

  // Track previous status, zone, and locale to trigger API calls only on actual value transitions
  const prevStatusRef = useRef<SystemStatus | null>(null);
  const prevZoneRef = useRef<string | null>(null);
  const prevLocaleRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Record<string, { result: GeminiAnalysisResult; timestamp: number }>>({});

  const runAnalysis = useCallback(async () => {
    // Generate a unique cache key based on current telemetry state and locale configuration
    const cacheKey = `${systemStatus}_${telemetry.zone_id}_${locale}_${telemetry.current_crowd_density}_${telemetry.ambient_noise_levels}_${telemetry.incident_flag}`;

    if (cacheRef.current[cacheKey]) {
      setResult(cacheRef.current[cacheKey].result);
      setAnalysisState('success');
      setLastAnalyzedAt(cacheRef.current[cacheKey].timestamp);
      return;
    }

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setAnalysisState('loading');
    setErrorMessage(null);

    try {
      const analysisResult = await generateSituationalAnalysis(
        telemetry,
        context,
        systemStatus,
        locale
      );
      
      // Store in cache
      cacheRef.current[cacheKey] = {
        result: analysisResult,
        timestamp: Date.now()
      };

      setResult(analysisResult);
      setAnalysisState('success');
      setLastAnalyzedAt(cacheRef.current[cacheKey].timestamp);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred.';
      // Don't surface abort errors (user triggered a new request)
      if (message.includes('aborted') || message.includes('abort')) return;
      setErrorMessage(message);
      setAnalysisState('error');
    }
  }, [telemetry, context, systemStatus, locale]);

  /**
   * Auto-trigger: fire when system_status or zone_id changes.
   * Debounce by 800ms to batch rapid consecutive updates.
   */
  useEffect(() => {
    const statusChanged = prevStatusRef.current !== systemStatus;
    const zoneChanged = prevZoneRef.current !== telemetry.zone_id;

    if (statusChanged || zoneChanged) {
      prevStatusRef.current = systemStatus;
      prevZoneRef.current = telemetry.zone_id;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        runAnalysis();
      }, 800);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [systemStatus, telemetry.zone_id, runAnalysis]);

  /**
   * Re-trigger when locale changes so the briefing is in the right language.
   */
  useEffect(() => {
    const localeChanged = prevLocaleRef.current !== null && prevLocaleRef.current !== locale;
    prevLocaleRef.current = locale;

    if (localeChanged && result !== null) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        runAnalysis();
      }, 500);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [locale, runAnalysis, result]);

  // Manual trigger exposed to the UI
  const triggerAnalysis = useCallback(() => {
    runAnalysis();
  }, [runAnalysis]);

  return {
    result,
    analysisState,
    errorMessage,
    lastAnalyzedAt,
    triggerAnalysis,
  };
}
