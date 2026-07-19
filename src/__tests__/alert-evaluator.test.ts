import { describe, it, expect } from 'vitest';
import { evaluateTelemetry } from '../core/alert-evaluator';
import { TelemetryPayload, ContextPayload } from '../core/types';

describe('XAI Alert Evaluation Suite', () => {
  const defaultContext: ContextPayload = {
    local_time: '18:00',
    stadium_capacity_limit: 80000,
    language_preference: 'en',
  };

  it('should flag status "nominal" when metrics are within safe bounds', () => {
    const nominalTelemetry: TelemetryPayload = {
      zone_id: 'Z-01',
      current_crowd_density: 45,
      ambient_noise_levels: 75,
      incident_flag: false,
    };
    
    const result = evaluateTelemetry(nominalTelemetry, defaultContext);
    expect(result.system_status).toBe('nominal');
    expect(result.warnings.length).toBe(0);
    expect(result.reasoning_chain).toContain('All systems nominal.');
  });

  it('should flag status "alert" when crowd density exceeds 80%', () => {
    const crowdAlertTelemetry: TelemetryPayload = {
      zone_id: 'Z-02',
      current_crowd_density: 85,
      ambient_noise_levels: 70,
      incident_flag: false,
    };

    const result = evaluateTelemetry(crowdAlertTelemetry, defaultContext);
    expect(result.system_status).toBe('alert');
    expect(result.warnings.length).toBe(1);
    expect(result.reasoning_chain).toContain('Zone Z-02 density hit 85%');
  });

  it('should flag status "alert" when incident_flag is active', () => {
    const incidentTelemetry: TelemetryPayload = {
      zone_id: 'Z-03',
      current_crowd_density: 30,
      ambient_noise_levels: 60,
      incident_flag: true,
    };

    const result = evaluateTelemetry(incidentTelemetry, defaultContext);
    expect(result.system_status).toBe('alert');
    expect(result.warnings.length).toBe(1);
    expect(result.reasoning_chain).toContain('critical incident was flagged');
  });

  it('should flag status "warning" when crowd density is between 61% and 80%', () => {
    const crowdWarningTelemetry: TelemetryPayload = {
      zone_id: 'Z-04',
      current_crowd_density: 75,
      ambient_noise_levels: 70,
      incident_flag: false,
    };

    const result = evaluateTelemetry(crowdWarningTelemetry, defaultContext);
    expect(result.system_status).toBe('warning');
    expect(result.warnings.length).toBe(1);
    expect(result.reasoning_chain).toContain('density reached 75%');
  });

  it('should flag status "warning" when ambient noise exceeds 95 dB', () => {
    const noiseWarningTelemetry: TelemetryPayload = {
      zone_id: 'Z-05',
      current_crowd_density: 50,
      ambient_noise_levels: 98,
      incident_flag: false,
    };

    const result = evaluateTelemetry(noiseWarningTelemetry, defaultContext);
    expect(result.system_status).toBe('warning');
    expect(result.warnings.length).toBe(1);
    expect(result.reasoning_chain).toContain('noise levels in Zone Z-05 reached 98 dB');
  });

  it('should generate localized alert warnings matching context language', () => {
    const alertTelemetry: TelemetryPayload = {
      zone_id: 'ZONE-A',
      current_crowd_density: 90,
      ambient_noise_levels: 80,
      incident_flag: false,
    };

    const spanishContext: ContextPayload = {
      ...defaultContext,
      language_preference: 'es',
    };

    const result = evaluateTelemetry(alertTelemetry, spanishContext);
    expect(result.system_status).toBe('alert');
    expect(result.reasoning_chain).toContain('densidad de la Zona ZONE-A alcanzó el 90%');
  });
});
