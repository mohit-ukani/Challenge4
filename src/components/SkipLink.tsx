import React from 'react';

/**
 * Skip Link component to bypass layout navigation links (WCAG A11y 2.4.1).
 * Focuses directly onto the main dashboard content panel.
 */
export const SkipLink: React.FC = React.memo(() => {
  return (
    <a href="#main-dashboard" className="skip-link">
      Skip to main content
    </a>
  );
});

SkipLink.displayName = 'SkipLink';
