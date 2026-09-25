/**
 * Preeti to Unicode Converter
 * Converts legacy Preeti font text into modern standard Nepali Devanagari Unicode.
 */
import { PREETI_TO_UNICODE_MAP, PREETI_TO_UNICODE_POST_RULES } from './mappings';

/**
 * Converts Preeti encoded string to standard Unicode Devanagari.
 * Handles reordering of matras, conjuncts, and reph.
 */
export function preetiToUnicode(text: string): string {
  if (!text) return '';

  // Split into tokens preserving whitespace and newlines
  const tokens = text.split(/(\s+)/);
  const output: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token || /^\s+$/.test(token)) {
      output.push(token);
      continue;
    }

    // Map each character through the Preeti character map
    let mapped = '';
    for (let j = 0; j < token.length; j++) {
      const ch = token[j];
      mapped += PREETI_TO_UNICODE_MAP[ch] ?? ch;
    }

    // Apply post-processing regex rules to reconstruct Devanagari ordering
    for (let k = 0; k < PREETI_TO_UNICODE_POST_RULES.length; k++) {
      const [pattern, replacement] = PREETI_TO_UNICODE_POST_RULES[k];
      mapped = mapped.replace(pattern, replacement);
    }

    output.push(mapped);
  }

  return output.join('');
}
