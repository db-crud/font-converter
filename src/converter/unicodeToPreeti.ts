/**
 * Unicode to Preeti Converter
 * Converts modern Nepali Devanagari Unicode into Preeti legacy font encoding.
 */
import { UNICODE_TO_PREETI_MAP } from './mappings';

// Pre-replacement regex rules for ordering short-i (ि) and reph (र्)
const PRE_RULES: [RegExp, string][] = [
  // Short-i (ि) goes before the consonant cluster: "कि" -> "l" + "क"
  [/((?:.्)*.)ि/g, 'l$1'],
  // Reph (र्) moves after the consonant cluster: "र्म" -> "म" + "{"
  [/र्((?:.्)*.)/g, '$1{'],
];

/**
 * Converts Unicode Devanagari string to Preeti encoded text.
 * Preserves unsupported/English characters and line breaks.
 */
export function unicodeToPreeti(text: string): string {
  if (!text) return '';

  let result = text;

  // Apply reordering rules
  for (let i = 0; i < PRE_RULES.length; i++) {
    const [pattern, replacement] = PRE_RULES[i];
    result = result.replace(pattern, replacement);
  }

  // Replace character sequences according to mapping
  for (let j = 0; j < UNICODE_TO_PREETI_MAP.length; j++) {
    const [from, to] = UNICODE_TO_PREETI_MAP[j];
    result = result.replaceAll(from, to);
  }

  return result;
}
