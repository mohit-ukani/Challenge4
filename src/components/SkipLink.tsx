import React from 'react';
import { useI18n } from '../hooks/useI18n';

interface SkipLinkProps {
  locale: string;
}

/**
 * Skip Link component to bypass layout navigation links (WCAG A11y 2.4.1).
 * Focuses directly onto the main dashboard content panel.
 */
export const SkipLink: React.FC<SkipLinkProps> = React.memo(({ locale }) => {
  const { t } = useI18n(locale as any);
  
  return (
    <a href="#main-dashboard" className="skip-link">
      {t('ui.skip_link')}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';
