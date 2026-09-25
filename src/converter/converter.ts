/**
 * Central Converter Utility
 * Exposes bidirectional Unicode <-> Preeti conversion and text statistics.
 */
import { unicodeToPreeti } from './unicodeToPreeti';
import { preetiToUnicode } from './preetiToUnicode';

export { unicodeToPreeti, preetiToUnicode };

/**
 * Calculates accurate word count for text.
 */
export function getWordCount(text: string): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates accurate character count for text.
 */
export function getCharCount(text: string): number {
  if (!text) return 0;
  return text.length;
}
