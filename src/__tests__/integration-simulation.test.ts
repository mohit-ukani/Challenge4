import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { sanitizeInput, decodeSanitizedText } from '../core/input-sanitizer';
import { validatePayload } from '../core/validators';
import { evaluateTelemetry } from '../core/alert-evaluator';

describe('End-to-End Simulation Test Data Validation', () => {
  const getTestDataPath = (filename: string) =>
    path.join(__dirname, '../test-data', filename);

  const runPipeline = (filename: string) => {
    const filePath = getTestDataPath(filename);
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    // 1. Sanitization (XSS checks)
    const sanitization = sanitizeInput(rawContent);
    const cleanJson = decodeSanitizedText(sanitization.sanitizedText);

    // 2. Parser
    const parsed = JSON.parse(cleanJson);

    // 3. Validators
    const validation = validatePayload(parsed);

    // 4. Alert Evaluator
    const evaluation = evaluateTelemetry(validation.telemetry!, validation.context!);

    return {
      rawContent,
      sanitized: sanitization.sanitizedText,
      hadInjection: sanitization.hadInjection,
      validationErrors: validation.errors,
      isValid: validation.isValid,
      telemetry: validation.telemetry,
      context: validation.context,
      evaluation,
    };
  };

  it('Scenario Alpha: nominal operations simulation', () => {
    const result = runPipeline('scenario-alpha.json');
    
    console.log('\n--- Scenario Alpha Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Validation Errors:', result.validationErrors);
    console.log('Evaluated System Status:', result.evaluation.system_status.toUpperCase());
    console.log('Reasoning Chain (EN):', result.evaluation.reasoning_chain);

    expect(result.hadInjection).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.validationErrors.length).toBe(0);
    expect(result.evaluation.system_status).toBe('nominal');
    expect(result.evaluation.reasoning_chain).toContain('All systems nominal.');
  });

  it('Scenario Beta: crowd density bottleneck simulation', () => {
    const result = runPipeline('scenario-beta.json');
    
    console.log('\n--- Scenario Beta Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Validation Errors:', result.validationErrors);
    console.log('Evaluated System Status:', result.evaluation.system_status.toUpperCase());
    console.log('Reasoning Chain (ES):', result.evaluation.reasoning_chain);

    expect(result.hadInjection).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.evaluation.system_status).toBe('alert');
    expect(result.evaluation.reasoning_chain).toContain('Zona ZONE-B3 alcanzó el 88%');
  });

  it('Scenario Incident: security incident alarm simulation', () => {
    const result = runPipeline('scenario-incident.json');
    
    console.log('\n--- Scenario Incident Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Validation Errors:', result.validationErrors);
    console.log('Evaluated System Status:', result.evaluation.system_status.toUpperCase());
    console.log('Reasoning Chain (FR):', result.evaluation.reasoning_chain);

    expect(result.hadInjection).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.evaluation.system_status).toBe('alert');
    expect(result.evaluation.reasoning_chain).toContain('Zone ZONE-C1');
    expect(result.evaluation.reasoning_chain).toContain('incident critique a été signalé');
  });

  it('Scenario Warning Noise: high ambient decibels simulation', () => {
    const result = runPipeline('scenario-warning-noise.json');
    
    console.log('\n--- Scenario Warning Noise Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Validation Errors:', result.validationErrors);
    console.log('Evaluated System Status:', result.evaluation.system_status.toUpperCase());
    console.log('Reasoning Chain (AR):', result.evaluation.reasoning_chain);

    expect(result.hadInjection).toBe(false);
    expect(result.isValid).toBe(true);
    expect(result.evaluation.system_status).toBe('warning');
    expect(result.evaluation.reasoning_chain).toContain('الضوضاء المحيطة');
    expect(result.evaluation.reasoning_chain).toContain('ZONE-D4');
  });

  it('Scenario Gamma: malformed data fallback resilient simulation', () => {
    const result = runPipeline('scenario-gamma-malformed.json');
    
    console.log('\n--- Scenario Gamma Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Validation Errors Stack:', result.validationErrors);
    console.log('Fallback Coerced Telemetry Object:', result.telemetry);
    console.log('Fallback Coerced Context Object:', result.context);
    console.log('Evaluated System Status:', result.evaluation.system_status.toUpperCase());
    console.log('Reasoning Chain:', result.evaluation.reasoning_chain);

    expect(result.isValid).toBe(true);
    // Malformed density should coerce to 0
    expect(result.telemetry?.current_crowd_density).toBe(0);
    // Malformed noise level should coerce to 0
    expect(result.telemetry?.ambient_noise_levels).toBe(0);
    // Malformed flag should coerce to true since it has truthy string characters
    expect(result.telemetry?.incident_flag).toBe(true);
    // Since incident_flag is true, overall status should successfully evaluate to alert
    expect(result.evaluation.system_status).toBe('alert');
  });

  it('Scenario XSS Attack: malicious script block simulation', () => {
    const result = runPipeline('scenario-xss-attack.json');
    
    console.log('\n--- Scenario XSS Attack Simulation ---');
    console.log('Sanitization Injection Alert:', result.hadInjection ? 'YES' : 'NO');
    console.log('Sanitized string result:', result.sanitized);
    console.log('Validation Errors:', result.validationErrors);
    console.log('Cleaned Telemetry Zone ID:', result.telemetry?.zone_id);

    expect(result.hadInjection).toBe(true);
    expect(result.sanitized).not.toContain('<script>');
    expect(result.telemetry?.zone_id).toBe('ZONE-X');
  });
});
