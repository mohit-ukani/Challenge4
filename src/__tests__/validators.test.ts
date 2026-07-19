import { describe, it, expect } from 'vitest';
import { validatePayload } from '../core/validators';

describe('Telemetry Payload Validation Suite', () => {
  it('should pass cleanly for a fully structured valid payload', () => {
    const validPayload = {
      zone_id: 'ZONE-A1',
      current_crowd_density: 45,
      ambient_noise_levels: 72,
      incident_flag: false,
      local_time: '12:00',
      stadium_capacity_limit: 80000,
      language_preference: 'en',
    };
    const result = validatePayload(validPayload);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.telemetry?.zone_id).toBe('ZONE-A1');
    expect(result.telemetry?.current_crowd_density).toBe(45);
  });

  it('should coerce string numbers to actual numbers', () => {
    const stringNumbers = {
      zone_id: 'ZONE-A1',
      current_crowd_density: '85',
      ambient_noise_levels: '92.5',
      incident_flag: false,
    };
    const result = validatePayload(stringNumbers);
    expect(result.isValid).toBe(true);
    expect(result.telemetry?.current_crowd_density).toBe(85);
    expect(result.telemetry?.ambient_noise_levels).toBe(92.5);
  });

  it('should coerce truthy/falsy field values for incident flag', () => {
    const raw = {
      zone_id: 'ZONE-A1',
      current_crowd_density: 50,
      ambient_noise_levels: 60,
      incident_flag: 'active',
    };
    const result = validatePayload(raw);
    expect(result.isValid).toBe(true);
    expect(result.telemetry?.incident_flag).toBe(true);
    expect(result.errors).toContain("Coerced non-boolean 'incident_flag' (active) to true.");
  });

  it('should clamp out-of-bounds metrics to minimum and maximum limits', () => {
    const outOfBounds = {
      zone_id: 'ZONE-A1',
      current_crowd_density: 150, // Max 100
      ambient_noise_levels: -20, // Min 0
      incident_flag: false,
    };
    const result = validatePayload(outOfBounds);
    expect(result.isValid).toBe(true);
    expect(result.telemetry?.current_crowd_density).toBe(100);
    expect(result.telemetry?.ambient_noise_levels).toBe(0);
  });

  it('should fallback to defaults when properties are missing or malformed', () => {
    const emptyPayload = {};
    const result = validatePayload(emptyPayload);
    expect(result.isValid).toBe(true);
    expect(result.telemetry?.zone_id).toBe('UNKNOWN');
    expect(result.telemetry?.current_crowd_density).toBe(0);
    expect(result.telemetry?.incident_flag).toBe(false);
    expect(result.context?.stadium_capacity_limit).toBe(80000);
  });

  it('should graceful degrade if input is not an object', () => {
    const result = validatePayload('not_an_object');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Input payload is missing or not a valid JSON object.');
  });
});
