import { describe, it, expect } from "vitest";
import { sanitizeInput, decodeSanitizedText } from "../core/input-sanitizer";

describe("XSS Input Sanitization Suite", () => {
  it("should neutralize basic <script> tags", () => {
    const raw = '{"zone_id": "<script>alert(1)</script>ZONE-A"}';
    const result = sanitizeInput(raw);
    expect(result.hadInjection).toBe(true);
    expect(result.sanitizedText).not.toContain("<script>");
  });

  it("should strip HTML event handler patterns", () => {
    const raw =
      '{"zone_id": "ZONE-A", "noise": "<img src=x onerror=alert(2)>"}';
    const result = sanitizeInput(raw);
    expect(result.hadInjection).toBe(true);
    expect(result.sanitizedText).not.toContain("onerror");
  });

  it("should strip dangerous iframe elements", () => {
    const raw = '<iframe src="javascript:alert(3)"></iframe>';
    const result = sanitizeInput(raw);
    expect(result.hadInjection).toBe(true);
    expect(result.sanitizedText).not.toContain("iframe");
  });

  it("should neutralize javascript: URI formats", () => {
    const raw = '{"link": "javascript:fetch(something)"}';
    const result = sanitizeInput(raw);
    expect(result.hadInjection).toBe(true);
    expect(result.sanitizedText).toContain("[REMOVED_URI]");
  });

  it("should preserve standard valid JSON characters after decode roundtrip", () => {
    const raw = '{"zone_id": "ZONE-A1", "current_crowd_density": 85}';
    const sanitized = sanitizeInput(raw);
    const decoded = decodeSanitizedText(sanitized.sanitizedText);
    expect(decoded).toBe(raw);
    const parsed = JSON.parse(decoded);
    expect(parsed.zone_id).toBe("ZONE-A1");
    expect(parsed.current_crowd_density).toBe(85);
  });
});
