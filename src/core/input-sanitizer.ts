import { SanitizationResult } from './types';

/**
 * Strict sanitation routine for the data playground textarea input.
 * Strips dangerous HTML tags, javascript: uris, event handlers, and encodes special characters.
 *
 * @param rawInput Raw input string from the playground text area
 * @returns SanitizationResult indicating the safe string and whether any injection was blocked
 */
export function sanitizeInput(rawInput: string): SanitizationResult {
  if (!rawInput) {
    return { sanitizedText: '', hadInjection: false };
  }

  let cleaned = rawInput;
  let injectionDetected = false;

  // 1. Check & strip <script>...</script> tags (case-insensitive)
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const noScripts = cleaned.replace(scriptRegex, '');
  if (noScripts !== cleaned) {
    injectionDetected = true;
    cleaned = noScripts;
  }

  // 2. Check & strip iframe, object, embed, link, meta, style tags
  const tagsRegex = /<(iframe|object|embed|link|meta|style|form|svg|body|html|applet|audio|video|picture)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const noTags = cleaned.replace(tagsRegex, '');
  if (noTags !== cleaned) {
    injectionDetected = true;
    cleaned = noTags;
  }

  // Double check self-closing tag formats like <iframe ... />
  const selfClosingTagsRegex = /<(iframe|object|embed|link|meta|style|form|svg|body|html|applet|audio|video|picture)\b[^>]*\/?>/gi;
  const noSelfClosing = cleaned.replace(selfClosingTagsRegex, '');
  if (noSelfClosing !== cleaned) {
    injectionDetected = true;
    cleaned = noSelfClosing;
  }

  // 3. Strip event handlers (e.g., onclick=, onerror=, onload=)
  const eventHandlerRegex = /\bon\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi;
  const noEventHandlers = cleaned.replace(eventHandlerRegex, '');
  if (noEventHandlers !== cleaned) {
    injectionDetected = true;
    cleaned = noEventHandlers;
  }

  // 4. Strip javascript: and data: URIs in assignments
  const uriSchemeRegex = /(javascript|data|vbscript):[^\s"'>]+/gi;
  const noUris = cleaned.replace(uriSchemeRegex, '[REMOVED_URI]');
  if (noUris !== cleaned) {
    injectionDetected = true;
    cleaned = noUris;
  }

  // 5. Basic HTML entity encoding to ensure no characters are rendered as markup
  // Although React handles text safely, this ensures full defense-in-depth before any processing.
  const escapedText = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;');

  const hadDangerousHtmlCharacters = /[<>&]/.test(rawInput);
  const hadTrueInjection = injectionDetected || hadDangerousHtmlCharacters;

  return {
    sanitizedText: escapedText,
    hadInjection: hadTrueInjection,
  };
}

/**
 * Reverts basic HTML entity encoding to parse sanitized text as standard JSON safely.
 */
export function decodeSanitizedText(sanitized: string): string {
  return sanitized
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x60;/g, '`');
}
