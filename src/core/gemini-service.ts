import { TelemetryPayload, ContextPayload, SystemStatus } from "./types";

export interface GeminiAnalysisResult {
  briefing: string;
  riskLevel: SystemStatus;
  recommendedActions: string[];
  crowdManagementTips: string[];
}

const GEMINI_API_URL = import.meta.env.PROD
  ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"
  : "/api-gemini/v1beta/models/gemini-3.5-flash:generateContent";

/**
 * Builds a structured operational prompt for the Gemini model.
 * Provides strict context about the stadium co-pilot role and telemetry values.
 */
function buildPrompt(
  telemetry: TelemetryPayload,
  context: ContextPayload,
  systemStatus: SystemStatus,
  locale: string,
): string {
  const statusLabel =
    systemStatus === "alert"
      ? "CRITICAL ALERT"
      : systemStatus === "warning"
        ? "WARNING"
        : "NOMINAL";

  return `You are an AI Situational Analyst for a Smart Stadium Operations Co-Pilot system. 
You assist the Venue Security Head and Volunteer Lead with real-time crowd management decisions during live tournament events.

CURRENT TELEMETRY SNAPSHOT:
- Stadium Zone: ${telemetry.zone_id}
- Crowd Density: ${telemetry.current_crowd_density}% (Alert threshold: >80%, Warning: >60%)
- Ambient Noise Level: ${telemetry.ambient_noise_levels} dB (Warning threshold: >95 dB)
- Active Security Incident: ${telemetry.incident_flag ? "YES — INCIDENT FLAGGED" : "No"}
- Venue Local Time: ${context.local_time}
- Stadium Capacity Limit: ${context.stadium_capacity_limit.toLocaleString()} persons
- System Status: ${statusLabel}

TASK: Generate a concise, professional situational analysis briefing in ${locale === "es" ? "Spanish" : locale === "fr" ? "French" : locale === "ar" ? "Arabic" : "English"}.

Respond ONLY with a valid JSON object in this exact format, no markdown, no code blocks:
{
  "briefing": "2-3 sentence situational narrative explaining current conditions and their operational significance",
  "riskLevel": "${systemStatus}",
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "crowdManagementTips": ["Tip 1", "Tip 2"]
}

Keep actions specific, actionable, and relevant to the telemetry values. Be concise.`;
}

/**
 * Calls the Gemini API to generate an AI situational analysis briefing.
 * Returns structured analysis data including actions and crowd management tips.
 *
 * @param telemetry Current stadium telemetry payload
 * @param context Operational context metadata
 * @param systemStatus Evaluated system status
 * @param locale Active language locale
 * @returns Parsed GeminiAnalysisResult
 */
export async function generateSituationalAnalysis(
  telemetry: TelemetryPayload,
  context: ContextPayload,
  systemStatus: SystemStatus,
  locale: string,
): Promise<GeminiAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Add it to your .env file.",
    );
  }

  const prompt = buildPrompt(telemetry, context, systemStatus, locale);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            briefing: { type: "STRING" },
            riskLevel: { type: "STRING" },
            recommendedActions: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            crowdManagementTips: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          required: [
            "briefing",
            "riskLevel",
            "recommendedActions",
            "crowdManagementTips",
          ],
        },
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  // Strip any accidental markdown code fences the model may have added
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed: GeminiAnalysisResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${cleaned.slice(0, 200)}`,
    );
  }

  // Defensive coercion — ensure arrays are arrays
  return {
    briefing: parsed.briefing ?? "Analysis unavailable.",
    riskLevel: parsed.riskLevel ?? systemStatus,
    recommendedActions: Array.isArray(parsed.recommendedActions)
      ? parsed.recommendedActions
      : [],
    crowdManagementTips: Array.isArray(parsed.crowdManagementTips)
      ? parsed.crowdManagementTips
      : [],
  };
}
