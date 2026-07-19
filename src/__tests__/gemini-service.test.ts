import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSituationalAnalysis } from '../core/gemini-service';
import { TelemetryPayload, ContextPayload } from '../core/types';

describe('Gemini AI Service Client Suite', () => {
  const telemetry: TelemetryPayload = {
    zone_id: 'ZONE-T1',
    current_crowd_density: 85,
    ambient_noise_levels: 90,
    incident_flag: false,
  };

  const context: ContextPayload = {
    local_time: '18:45',
    stadium_capacity_limit: 80000,
    language_preference: 'en',
  };

  beforeEach(() => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'MOCK_KEY');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('should successfully parse a valid JSON response from Gemini API', async () => {
    const mockJson = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  briefing: 'Crowd density is elevated at Zone T1. Recommended warning guidelines applied.',
                  riskLevel: 'alert',
                  recommendedActions: ['Dispatch guards', 'Open Gate C'],
                  crowdManagementTips: ['Monitor flow rates'],
                }),
              },
            ],
          },
        },
      ],
    };

    const fetchMock = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockJson,
    } as Response);

    const result = await generateSituationalAnalysis(telemetry, context, 'alert', 'en');

    expect(fetchMock).toHaveBeenCalled();
    const fetchArgs = fetchMock.mock.calls[0];
    expect(fetchArgs[0]).toContain('/api-gemini/v1beta/models/gemini-2.5-flash:generateContent');
    expect(fetchArgs[0]).toContain('key=MOCK_KEY');

    const requestBody = JSON.parse(fetchArgs[1]?.body as string);
    expect(requestBody.contents[0].parts[0].text).toContain('ZONE-T1');

    expect(result.briefing).toContain('Crowd density is elevated');
    expect(result.riskLevel).toBe('alert');
    expect(result.recommendedActions).toEqual(['Dispatch guards', 'Open Gate C']);
    expect(result.crowdManagementTips).toEqual(['Monitor flow rates']);
  });

  it('should throw an error when API key is missing', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    await expect(generateSituationalAnalysis(telemetry, context, 'alert', 'en'))
      .rejects.toThrow('VITE_GEMINI_API_KEY is not set');
  });

  it('should throw an error when the response is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    } as Response);

    await expect(generateSituationalAnalysis(telemetry, context, 'alert', 'en'))
      .rejects.toThrow('Gemini API error 400: Bad Request');
  });

  it('should gracefully clean and parse markdown-wrapped JSON returned by Gemini', async () => {
    const rawMarkdownText = `
    \`\`\`json
    {
      "briefing": "Clean parsing check.",
      "riskLevel": "nominal",
      "recommendedActions": ["No action required"],
      "crowdManagementTips": []
    }
    \`\`\`
    `;

    const mockJson = {
      candidates: [
        {
          content: {
            parts: [{ text: rawMarkdownText }],
          },
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockJson,
    } as Response);

    const result = await generateSituationalAnalysis(telemetry, context, 'nominal', 'en');
    expect(result.briefing).toBe('Clean parsing check.');
  });
});
