import React from 'react';

interface DensityMeterProps {
  value: number; // 0 - 100
  label: string;
}

/**
 * Crowd density percentage visual meter.
 * Fully WCAG-compliant (role="meter", aria-valuenow, explicit descriptions).
 */
export const DensityMeter: React.FC<DensityMeterProps> = React.memo(({ value, label }) => {
  // Determine color matching thresholds
  let color = 'var(--accent)';
  if (value > 80) {
    color = 'var(--accent-danger)';
  } else if (value > 60) {
    color = 'var(--accent-warning)';
  }

  const ariaValueText = `${label}: ${value} percent`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 'bold', color: color }}>{value}%</span>
      </div>
      
      {/* WCAG compliant Meter Track */}
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={ariaValueText}
        style={{
          width: '100%',
          height: '12px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width var(--transition-normal), background-color var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
});

DensityMeter.displayName = 'DensityMeter';
