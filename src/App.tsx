import React from 'react';
import { useTelemetryEngine } from './hooks/useTelemetryEngine';
import { useGeminiAnalysis } from './hooks/useGeminiAnalysis';
import { Header } from './components/Header';
import { DashboardPanel } from './components/DashboardPanel';
import { AlertFeed } from './components/AlertFeed';
import { ReasoningChain } from './components/ReasoningChain';
import { AIAnalystPanel } from './components/AIAnalystPanel';
import { PlaygroundTerminal } from './components/PlaygroundTerminal';
import { SkipLink } from './components/SkipLink';

/**
 * Root Application Container.
 * Assembles presentational panels using semantic layout sections.
 */
export const App: React.FC = () => {
  const {
    state,
    validationErrors,
    validationPassed,
    hadSanitizationAlert,
    updateTelemetryAndContext,
    updateDirectState,
    setLocale,
    reset,
  } = useTelemetryEngine('en');

  const locale = state.context.language_preference;

  const { result: aiResult, analysisState, errorMessage, lastAnalyzedAt, triggerAnalysis } =
    useGeminiAnalysis(state.telemetry, state.context, state.system_status, locale);

  return (
    <>
      {/* Keyboard navigation skip link helper */}
      <SkipLink locale={locale} />

      <div className="app-container">
        {/* Main interactive panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Top banner / Info bar */}
          <Header
            currentLocale={locale}
            onLocaleChange={setLocale}
            stadiumCapacity={state.context.stadium_capacity_limit}
            localTimeSetting={state.context.local_time}
          />

          {/* Main telemetry cockpit content */}
          <main className="main-content">
            <DashboardPanel
              telemetry={state.telemetry}
              systemStatus={state.system_status}
              locale={locale}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              <AlertFeed
                warnings={state.warnings}
                systemStatus={state.system_status}
                locale={locale}
              />

              <ReasoningChain
                reasoningChain={state.reasoning_chain}
                locale={locale}
              />
            </div>

            {/* Gemini AI Situational Analyst — spans full width */}
            <AIAnalystPanel
              result={aiResult}
              analysisState={analysisState}
              errorMessage={errorMessage}
              lastAnalyzedAt={lastAnalyzedAt}
              systemStatus={state.system_status}
              locale={locale}
              onReanalyze={triggerAnalysis}
            />
          </main>
        </div>

        {/* Sidebar terminal controls */}
        <PlaygroundTerminal
          onInjectRawPayload={updateTelemetryAndContext}
          onInjectDirectState={updateDirectState}
          onReset={reset}
          validationErrors={validationErrors}
          validationPassed={validationPassed}
          hadSanitizationAlert={hadSanitizationAlert}
          locale={locale}
        />
      </div>
    </>
  );
};

export default App;
