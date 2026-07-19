import React, { useEffect, useState } from 'react';
import { Locale } from '../core/types';
import { LocaleSelector } from './LocaleSelector';
import { useI18n } from '../hooks/useI18n';

interface HeaderProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  stadiumCapacity: number;
  localTimeSetting: string;
}

/**
 * Top operational dashboard header.
 * Displays local venue status variables, translations, and tournament banner metadata.
 */
export const Header: React.FC<HeaderProps> = React.memo(({
  currentLocale,
  onLocaleChange,
  stadiumCapacity,
  localTimeSetting
}) => {
  const { t } = useI18n(currentLocale);
  const [systemClock, setSystemClock] = useState('');

  // Keep a running system clock for realism (independent of static telemetry local_time)
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setSystemClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-6)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <h1 style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>{t('app.title')}</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {t('app.subtitle')} | <span style={{ color: 'var(--accent)' }}>{t('app.role')}</span>
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        {/* Telemetry/Context Variables Info Panel */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            fontSize: '0.875rem',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{t('app.localTime')}: </span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{localTimeSetting}</strong>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginLeft: 'var(--space-2)' }}>
              (Live: {systemClock})
            </span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 'var(--space-4)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('app.capacity')}: </span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{stadiumCapacity.toLocaleString()}</strong>
          </div>
        </div>

        {/* Locale Selector Dropdown */}
        <LocaleSelector
          currentLocale={currentLocale}
          onLocaleChange={onLocaleChange}
          label="Locale"
        />
      </div>
    </header>
  );
});

Header.displayName = 'Header';
