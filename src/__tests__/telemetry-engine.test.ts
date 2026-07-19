import { describe, it, expect } from 'vitest';
import { getInitialState, telemetryReducer } from '../core/telemetry-engine';
import { TelemetryPayload, ContextPayload } from '../core/types';

describe('Telemetry Engine Reducer Suite', () => {
  it('should initialize nominal state correctly', () => {
    const state = getInitialState('en');
    expect(state.system_status).toBe('nominal');
    expect(state.telemetry.zone_id).toBe('Z-01');
    expect(state.context.language_preference).toBe('en');
  });

  it('should handle UPDATE_STATE action and transition status', () => {
    const initialState = getInitialState('en');
    const telemetry: TelemetryPayload = {
      zone_id: 'ZONE-A1',
      current_crowd_density: 85, // Critical density (>80)
      ambient_noise_levels: 75,
      incident_flag: false,
    };
    const context: ContextPayload = {
      local_time: '19:00',
      stadium_capacity_limit: 80000,
      language_preference: 'en',
    };

    const nextState = telemetryReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: { telemetry, context },
    });

    expect(nextState.system_status).toBe('alert');
    expect(nextState.telemetry.current_crowd_density).toBe(85);
    expect(nextState.warnings.length).toBe(1);
    expect(nextState.reasoning_chain).toContain('Zone ZONE-A1 density hit 85%');
  });

  it('should handle SET_LOCALE action and translate reasons', () => {
    const initialState = getInitialState('en');
    
    // Inject a warning state first
    const telemetry: TelemetryPayload = {
      zone_id: 'ZONE-B2',
      current_crowd_density: 75, // Warning density (61-80)
      ambient_noise_levels: 70,
      incident_flag: false,
    };
    const context: ContextPayload = {
      local_time: '20:00',
      stadium_capacity_limit: 80000,
      language_preference: 'en',
    };

    const warningState = telemetryReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: { telemetry, context },
    });
    expect(warningState.system_status).toBe('warning');
    expect(warningState.reasoning_chain).toContain('reached 75%');

    // Switch locale to Spanish
    const spanishState = telemetryReducer(warningState, {
      type: 'SET_LOCALE',
      payload: 'es',
    });

    expect(spanishState.context.language_preference).toBe('es');
    expect(spanishState.system_status).toBe('warning');
    expect(spanishState.reasoning_chain).toContain('llegó al 75%');
  });

  it('should handle RESET action and revert to initial state', () => {
    const initialState = getInitialState('en');
    const telemetry: TelemetryPayload = {
      zone_id: 'ZONE-ALERT',
      current_crowd_density: 90,
      ambient_noise_levels: 100,
      incident_flag: true,
    };
    const context: ContextPayload = {
      local_time: '23:30',
      stadium_capacity_limit: 50000,
      language_preference: 'fr',
    };

    const alertState = telemetryReducer(initialState, {
      type: 'UPDATE_STATE',
      payload: { telemetry, context },
    });

    const resetState = telemetryReducer(alertState, { type: 'RESET' });
    expect(resetState.system_status).toBe('nominal');
    expect(resetState.telemetry.zone_id).toBe('Z-01');
    expect(resetState.context.language_preference).toBe('en');
  });
});
