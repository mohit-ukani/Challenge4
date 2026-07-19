import { describe, it, expect } from 'vitest';
import { translate, isRTLLocale } from '../core/i18n';

describe('i18n Translation Dictionary Suite', () => {
  it('should translate keys correctly in English', () => {
    const title = translate('app.title', {}, 'en');
    expect(title).toBe('Smart Stadium Operations Co-Pilot');
  });

  it('should translate keys correctly in Spanish', () => {
    const title = translate('app.title', {}, 'es');
    expect(title).toBe('Copiloto de Operaciones Inteligentes del Estadio');
  });

  it('should translate keys correctly in French', () => {
    const title = translate('app.title', {}, 'fr');
    expect(title).toBe('Co-Pilote des Opérations du Stade Intelligent');
  });

  it('should translate keys correctly in Arabic', () => {
    const title = translate('app.title', {}, 'ar');
    expect(title).toBe('مساعد عمليات الاستاد الذكي');
  });

  it('should interpolate template parameters correctly', () => {
    const params = { time: '14:30', zone: 'A1', density: 92 };
    const text = translate('reasoning.density_alert', params, 'en');
    expect(text).toBe('At 14:30, Zone A1 density hit 92%, triggering bottleneck alert protocols.');
  });

  it('should fall back to English for untranslated keys', () => {
    const text = translate('non_existent_key', {}, 'es');
    expect(text).toBe('non_existent_key');
  });

  it('should correctly flag Arabic as RTL direction', () => {
    expect(isRTLLocale('ar')).toBe(true);
    expect(isRTLLocale('en')).toBe(false);
    expect(isRTLLocale('es')).toBe(false);
    expect(isRTLLocale('fr')).toBe(false);
  });
});
