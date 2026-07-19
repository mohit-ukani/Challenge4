import React from "react";
import { Locale } from "../core/types";

interface LocaleSelectorProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  label: string;
}

/**
 * Dropdown language picker component.
 * Features keyboard accessibility navigation support.
 */
export const LocaleSelector: React.FC<LocaleSelectorProps> = React.memo(
  ({ currentLocale, onLocaleChange, label }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onLocaleChange(e.target.value as Locale);
    };

    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
      >
        <label
          htmlFor="lang-selector"
          style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
        >
          {label}:
        </label>
        <select
          id="lang-selector"
          value={currentLocale}
          onChange={handleChange}
          style={{
            backgroundColor: "var(--bg-surface-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            padding: "var(--space-1) var(--space-2)",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          <option value="en">English (EN)</option>
          <option value="es">Español (ES)</option>
          <option value="fr">Français (FR)</option>
          <option value="ar">العربية (AR)</option>
        </select>
      </div>
    );
  },
);

LocaleSelector.displayName = "LocaleSelector";
