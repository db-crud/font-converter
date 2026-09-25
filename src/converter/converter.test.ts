import { describe, it, expect } from 'vitest';
import { unicodeToPreeti, preetiToUnicode, getWordCount, getCharCount } from './converter';
import { transliterateWord, transliteratePhonetic } from './transliterate';


describe('Nepali Converter Engine', () => {
  const testWords = [
    'नमस्ते',
    'नेपाल',
    'नेपाली',
    'ज्ञान',
    'विद्यालय',
    'शिक्षा',
    'कम्प्युटर',
    'प्रविधि',
    'प्रोग्रामिङ',
    'शिक्षक',
    'विद्यार्थी',
    'सम्पर्क',
    'सरकार',
    'नेपाल सरकार',
    'काठमाडौं',
    'पोखरा',
    'नेपालगञ्ज',
  ];

  const testSentences = [
    'मेरो नाम डान हो।',
    'म नेपालमा बस्छु।',
    'नेपाली भाषा हाम्रो पहिचान हो।',
    'म कम्प्युटर विज्ञान पढ्दैछु।',
    'विद्यालयमा आज परीक्षा हुँदैछ।',
    'नेपाल सुन्दर देश हो।',
  ];

  const testConjuncts = [
    'क्ष', 'त्र', 'ज्ञ', 'श्र', 'क्र', 'प्र', 'ब्र', 'द्र', 'ग्र', 'स्र',
    'स्त्र', 'त्य', 'द्य', 'ध्य', 'व्य', 'श्च', 'च्च', 'ज्ज', 'त्त', 'द्ध', 'न्न', 'म्म'
  ];

  it('correctly converts common words from Unicode to Preeti and back to Unicode', () => {
    for (const word of testWords) {
      const preeti = unicodeToPreeti(word);
      expect(preeti).toBeTruthy();
      const backToUnicode = preetiToUnicode(preeti);
      expect(backToUnicode).toBe(word);
    }
  });

  it('correctly converts full sentences with punctuation', () => {
    for (const sentence of testSentences) {
      const preeti = unicodeToPreeti(sentence);
      expect(preeti).toBeTruthy();
      const backToUnicode = preetiToUnicode(preeti);
      expect(backToUnicode).toBe(sentence);
    }
  });

  it('correctly converts conjunct characters', () => {
    for (const conjunct of testConjuncts) {
      const preeti = unicodeToPreeti(conjunct);
      expect(preeti).toBeTruthy();
      const backToUnicode = preetiToUnicode(preeti);
      expect(backToUnicode).toBe(conjunct);
    }
  });

  it('correctly handles Nepali numbers', () => {
    const numbers = '० १ २ ३ ४ ५ ६ ७ ८ ९';
    const preeti = unicodeToPreeti(numbers);
    expect(preeti).toBe(') ! @ # $ % ^ & * (');
    const backToUnicode = preetiToUnicode(preeti);
    expect(backToUnicode).toBe(numbers);
  });

  it('correctly handles words with Reph (र्)', () => {
    const rephWords = ['धर्म', 'कर्म', 'सर्व', 'शर्मा', 'पूर्ण', 'गर्व', 'आश्चर्य', 'हर्ष'];
    for (const word of rephWords) {
      const preeti = unicodeToPreeti(word);
      const backToUnicode = preetiToUnicode(preeti);
      expect(backToUnicode).toBe(word);
    }
  });

  it('preserves unmapped characters in unicodeToPreeti', () => {
    const input = 'म नेपालमा बस्छु (since 2020) 😊';
    const preeti = unicodeToPreeti(input);
    // Devanagari converted, English and emoji preserved in Unicode to Preeti
    expect(preeti).toContain('since 2020');
    expect(preeti).toContain('😊');
    expect(preeti).toContain('d g]kfndf a:5\'');
  });


  it('calculates dynamic word count and character count accurately', () => {
    expect(getWordCount('')).toBe(0);
    expect(getCharCount('')).toBe(0);
    expect(getWordCount('नमस्ते नेपाल')).toBe(2);
    expect(getCharCount('नमस्ते')).toBe(6);
  });

  it('correctly transliterates phonetic Nepali words and sentences', () => {
    expect(transliterateWord('namaste')).toBe('नमस्ते');
    expect(transliterateWord('nepal')).toBe('नेपाल');
    expect(transliterateWord('nepali')).toBe('नेपाली');
    expect(transliteratePhonetic('mero naam dan ho')).toBe('मेरो नाम डान हो');
  });
});

