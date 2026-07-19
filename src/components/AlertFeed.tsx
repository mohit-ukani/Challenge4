import React, { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface AlertItem {
  id: string;
  time: string;
  text: string;
  type: 'alert' | 'warning';
}

interface AlertFeedProps {
  warnings: string[];
  systemStatus: 'nominal' | 'warning' | 'alert';
  locale: string;
}

/**
 * Dispatch alarm feed.
 * Configured as an assertive ARIA live region (aria-live="assertive")
 * to announce new warnings and incidents to screen readers dynamically.
 */
export const AlertFeed: React.FC<AlertFeedProps> = React.memo(({
  warnings,
  systemStatus,
  locale
}) => {
  const { t } = useI18n(locale as any);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Update dynamic alert logs when warnings state changes
  useEffect(() => {
    if (warnings.length === 0) {
      setAlerts([]);
      return;
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const timestampStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // Map warnings into alert feed items
    const newItems = warnings.map((warning, index) => ({
      id: `${Date.now()}-${index}`,
      time: timestampStr,
      text: warning,
      type: systemStatus === 'alert' ? 'alert' : 'warning',
    } as AlertItem));

    // Append new items (deduplicated by text value to prevent loop pollution)
    setAlerts(prev => {
      // Clear logs if nominal, otherwise only add fresh ones
      if (systemStatus === 'nominal') return [];
      
      const filteredPrev = prev.filter(p => !newItems.some(n => n.text === p.text));
      return [...newItems, ...filteredPrev].slice(0, 15); // Cap to last 15 dispatches
    });
  }, [warnings, systemStatus]);

  return (
    <section
      className="card-panel"
      aria-labelledby="alert-feed-title"
      style={{ minHeight: '180px' }}
    >
      <h2 id="alert-feed-title" className="card-panel-title">
        {t('ui.alerts_header')}
      </h2>

      {/* Screen Reader Live Announcements Container */}
      <div
        id="live-security-dispatch"
        role="log"
        aria-live="assertive"
        aria-atomic="false"
        aria-relevant="additions"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          maxHeight: '260px',
          overflowY: 'auto',
          fontSize: '0.875rem',
        }}
      >
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', margin: 'auto 0' }}>
            {t('ui.no_alerts')}
          </p>
        ) : (
          alerts.map(item => (
            <div
              key={item.id}
              className={`alert-item alert-${item.type}`}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  marginTop: '2px',
                }}
              >
                [{item.time}]
              </span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '1px 6px',
                    borderRadius: '2px',
                    backgroundColor: item.type === 'alert' ? 'var(--accent-danger)' : 'var(--accent-warning)',
                    color: 'var(--bg-primary)',
                    marginRight: 'var(--space-2)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.type === 'alert' ? t('ui.alert') : t('ui.warning')}
                </span>
                <span style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>{item.text}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
});

AlertFeed.displayName = 'AlertFeed';
