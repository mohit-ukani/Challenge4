# 🏟️ Smart Stadium Operations Co-Pilot

A real-time, resilient, and intelligent telemetry dashboard designed for Venue Security Heads and Volunteer Leads during live tournament events. Featuring explainable AI (XAI) reasoning, secure input sanitization (XSS defense), automatic language localization (i18n), and an integrated Gen AI Situational Analyst powered by Google Gemini.

## 🚀 Live Demo
- **Deployed App:** [Smart Stadium Dashboard](https://voters-journey-pw2.web.app)
- **Firebase Project Console:** [voters-journey-pw2 Overview](https://console.firebase.google.com/project/voters-journey-pw2/overview)

---

## 🌟 Key Capabilities

### 1. 🤖 Gen AI Situational Analyst (Google Gemini)
- Dynamic crowd management advisories powered by `gemini-3.5-flash` with robust fallback structures.
- Intelligently auto-triggers analysis on telemetry status changes (nominal, warning, alert states) or zone transitions.
- Fully internationalized: automatically re-requests and translates briefings when the user changes UI language.
- Highly optimized with debouncing and request cancellation (`AbortController`) to prevent API rate-limit exhaustion.

### 2. 🛡️ Bulletproof Security Sandbox
- **XSS Defense-in-Depth:** Client-side HTML input sanitizer that detects and strips malicious `<script>` tags, iframe elements, event handlers (`onerror`, `onclick`), and `javascript:` URIs before data is processed.
- **Strict Content Security Policy (CSP):** Configured in `index.html` to prevent unauthorized outbound connections, strictly whitelisting local origins and `generativelanguage.googleapis.com`.
- **Defensive Parsing:** Fallback engine that corrects missing, out-of-bounds, or malformed JSON payloads to safe default boundaries instead of crashing.

### 3. 🌐 Full Internationalization (i18n)
- Dynamic UI localization across four languages: **English**, **Spanish (Español)**, **French (Français)**, and **Arabic (العربية)**.
- Reactive `useI18n` hook with direction matching (LTR/RTL) that flips the page layout automatically for Arabic.

### 4. 🧠 Explainable AI (XAI) Reasoning Trace
- Simple, rule-based operations engine that displays readable, step-by-step reasoning behind status elevations (warning, alert) in the selected language.

---

## 🛠️ Technology Stack
- **Frontend Core:** React, TypeScript, Vite
- **Styling:** Vanilla CSS (Tailwind avoided for performance and customization)
- **AI Engine:** Google Gemini API (`gemini-3.5-flash`)
- **Testing:** Vitest
- **Deployment:** Firebase Hosting

---

## 💻 Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mohit-ukani/Challenge4.git
cd Challenge4
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
> Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5173`. Vite is configured with a local server proxy (`/api-gemini`) to bypass browser CORS rules during local testing.

### 4. Production Build & Compilation
```bash
npm run build
```
Vite compiles TypeScript bindings and builds production-ready static assets into the `dist` folder. In production, requests connect directly to the Google API using secure connection headers.

---

## 🧪 Testing & Simulation

The project features **100% test coverage** for all core operations, including input sanitizers, reducer engines, validators, i18n interpolation, and Gemini client parsing.

To run the Vitest suite:
```bash
npm run test
```

### Simulation Scenarios Tested
- **Scenario Alpha:** Flawless nominal operations.
- **Scenario Beta:** Critical crowd density bottlenecks (>80%).
- **Scenario Incident:** Active security alarm dispatches.
- **Scenario Warning Noise:** Elevated ambient decibels (>95 dB).
- **Scenario Gamma:** Malformed data recovery using fallback logic.
- **Scenario XSS Attack:** Neutralization of script injections.

---

## 📁 Repository Structure
```
├── src/
│   ├── __tests__/           # Full Vitest suite
│   ├── components/          # A11y and i18n compliant UI components
│   │   ├── AIAnalystPanel   # Gemini briefing and recommended actions grid
│   │   ├── Playground       # JSON injector terminal and error log
│   │   └── ...
│   ├── core/                # Core operations engines (i18n, validators, sanitizer)
│   ├── hooks/               # Custom hooks (telemetry state, Gemini API, i18n)
│   ├── index.css            # Modular design system and keyframe animations
│   └── vite-env.d.ts        # TypeScript compiler environment bindings
├── index.html               # Entry HTML template with CSP configurations
├── firebase.json            # Deployment routing rules
└── vite.config.ts           # Vite dev proxy configuration
```
