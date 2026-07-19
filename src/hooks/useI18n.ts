import { useEffect, useCallback } from 'react';
import { Locale } from '../core/types';
import { translate, isRTLLocale } from '../core/i18n';

/**
 * Custom React Hook to manage translations and handle text orientation layout.
 * Synchronizes HTML direction and lang tags with state locale.
 *
 * @param locale Active locale prop passed from parent (driven by the telemetry reducer)
 */
export function useI18n(locale: Locale = 'en') {
  // Sync HTML document attributes and document title on locale switch (A11y/SEO alignment)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTLLocale(locale) ? 'rtl' : 'ltr';
    document.title = translate('app.title', {}, locale);
  }, [locale]);

  const t = useCallback((key: string, params: Record<string, string | number> = {}) => {
    return translate(key, params, locale);
  }, [locale]);

  return {
    locale,
    t,
    isRTL: isRTLLocale(locale),
  };
}
