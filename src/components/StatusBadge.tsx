import React from 'react';
import { SystemStatus } from '../core/types';

interface StatusBadgeProps {
  status: SystemStatus;
  nominalText: string;
  warningText: string;
  alertText: string;
}

/**
 * Visual badge for system operations state.
 * Implements high contrast ratios and a pulsing indicator light for critical alerts.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({
  status,
  nominalText,
  warningText,
  alertText
}) => {
  let badgeColor = 'var(--accent)';
  let labelText = nominalText;
  let isPulsing = false;

  if (status === 'warning') {
    badgeColor = 'var(--accent-warning)';
    labelText = warningText;
  } else if (status === 'alert') {
    badgeColor = 'var(--accent-danger)';
    labelText = alertText;
    isPulsing = true;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: `1px solid ${badgeColor}`,
        borderRadius: 'var(--radius)',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
      }}
    >
      <span
        className="pulsing-dot"
        aria-hidden="true"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: badgeColor,
          display: 'inline-block',
          boxShadow: isPulsing ? `0 0 8px ${badgeColor}` : 'none',
          animation: isPulsing ? 'status-pulse 1.5s infinite ease-in-out' : 'none',
        }}
      />
      <span style={{ color: 'var(--text-primary)' }}>{labelText}</span>
    </div>
  );
});

StatusBadge.displayName = 'StatusBadge';
