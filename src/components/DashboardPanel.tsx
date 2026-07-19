import React from 'react';
import { TelemetryPayload, SystemStatus } from '../core/types';
import { DensityMeter } from './DensityMeter';
import { StatusBadge } from './StatusBadge';
import { useI18n } from '../hooks/useI18n';

interface DashboardPanelProps {
  telemetry: TelemetryPayload;
  systemStatus: SystemStatus;
  locale: string;
}

/**
 * Main telemetry display panel.
 * Visualizes current crowd densities, ambient noise readings, and active incident alarms.
 */
export const DashboardPanel: React.FC<DashboardPanelProps> = React.memo(({
  telemetry,
  systemStatus,
  locale
}) => {
  const { t } = useI18n(locale as any);

  // Noise meter threshold coloring
  let noiseColor = 'var(--text-primary)';
  if (telemetry.ambient_noise_levels > 95) {
    noiseColor = 'var(--accent-danger)';
  } else if (telemetry.ambient_noise_levels > 80) {
    noiseColor = 'var(--accent-warning)';
  }

  // Incident styling
  const incidentBg = telemetry.incident_flag ? 'var(--bg-danger-mute)' : 'var(--bg-surface-elevated)';
  const incidentBorder = telemetry.incident_flag ? 'var(--accent-danger)' : 'var(--border)';
  const incidentTextColor = telemetry.incident_flag ? 'var(--accent-danger)' : 'var(--text-secondary)';

  return (
    <section
      id="main-dashboard"
      className="card-panel"
      aria-labelledby="dashboard-title"
      style={{ flex: 1, gap: 'var(--space-6)' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <h2 id="dashboard-title" style={{ fontSize: '1.25rem' }}>
          {t('status.title')}
        </h2>
        <StatusBadge
          status={systemStatus}
          nominalText={t('status.nominal')}
          warningText={t('status.warning')}
          alertText={t('status.alert')}
        />
      </div>

      {/* Grid of Telemetry Widgets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Zone ID Display */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {t('field.zone_id')}
          </span>
          <strong style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {telemetry.zone_id}
          </strong>
        </div>

        {/* Crowd Density Meter */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DensityMeter
            value={telemetry.current_crowd_density}
            label={t('field.density')}
          />
        </div>

        {/* Noise Levels Indicator */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('field.noise')}</span>
            <span style={{ fontWeight: 'bold', color: noiseColor }}>
              {telemetry.ambient_noise_levels} dB
            </span>
          </div>
          {/* Custom Decibel level gauge track */}
          <div
            role="meter"
            aria-label={t('field.noise')}
            aria-valuenow={telemetry.ambient_noise_levels}
            aria-valuemin={0}
            aria-valuemax={140}
            style={{
              height: '8px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (telemetry.ambient_noise_levels / 140) * 100)}%`,
                height: '100%',
                backgroundColor: noiseColor,
                transition: 'width var(--transition-normal), background-color var(--transition-normal)',
              }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            {t('ui.sensor_calibration')}
          </span>
        </div>

        {/* Incident Flag Alarm Widget */}
        <div
          style={{
            padding: 'var(--space-4)',
            backgroundColor: incidentBg,
            border: `1px solid ${incidentBorder}`,
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            {t('field.incident')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {telemetry.incident_flag && (
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-danger)',
                  display: 'inline-block',
                  animation: 'blink 1s infinite alternate ease-in-out',
                }}
              />
            )}
            <strong style={{ fontSize: '1rem', color: incidentTextColor, letterSpacing: '0.05em' }}>
              {telemetry.incident_flag ? t('field.incident_active') : t('field.incident_none')}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
});

DashboardPanel.displayName = 'DashboardPanel';
