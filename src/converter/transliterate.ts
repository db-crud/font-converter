/**
 * Nepali Phonetic Transliteration Engine
 * Transliterates Romanized English text (e.g., "namaste") into Nepali Devanagari Unicode ("नमस्ते").
 */

// Dictionary of high-frequency words for natural, instant Nepali typing
const COMMON_WORDS_MAP: Record<string, string> = {
  'namaste': 'नमस्ते',
  'namaskar': 'नमस्कार',
  'nepal': 'नेपाल',
  'nepali': 'नेपाली',
  'nepalma': 'नेपालमा',
  'mero': 'मेरो',
  'naam': 'नाम',
  'dan': 'डान',
  'ho': 'हो',
  'cha': 'छ',
  'chha': 'छ',
  'chaina': 'छैन',
  'chhaina': 'छैन',
  'tapai': 'तपाईं',
  'tapaain': 'तपाईं',
  'timi': 'तिमी',
  'ma': 'म',
  'malai': 'मलाई',
  'hami': 'हामी',
  'hamro': 'हाम्रो',
  'kathmandu': 'काठमाडौं',
  'pokhara': 'पोखरा',
  'lalitpur': 'ललितपुर',
  'bhaktapur': 'भक्तपुर',
  'ramro': 'राम्रो',
  'naramro': 'नराम्रो',
  'dhanyabad': 'धन्यवाद',
  'swagatam': 'स्वागतम्',
  'subhapravat': 'शुभप्रभात',
  'shubhapravat': 'शुभप्रभात',
  'ghar': 'घर',
  'pani': 'पानी',
  'khana': 'खाना',
  'bhat': 'भात',
  'desh': 'देश',
  'bidesh': 'विदेश',
  'bhasha': 'भाषा',
  'sahitya': 'साहित्य',
  'samachar': 'समाचार',
  'patrika': 'पत्रिका',
  'kitab': 'किताब',
  'pustak': 'पुस्तक',
  'school': 'विद्यालय',
  'vidhyalaya': 'विद्यालय',
  'shikshak': 'शिक्षक',
  'shiksha': 'शिक्षा',
  'vidyarthi': 'विद्यार्थी',
  'computer': 'कम्प्युटर',
  'vigyan': 'विज्ञान',
  'pravidhi': 'प्रविधि',
  'program': 'कार्यक्रम',
  'programming': 'प्रोग्रामिङ',
  'sarkar': 'सरकार',
  'samparka': 'सम्पर्क',
  'hajur': 'हजुर',
  'hunchha': 'हुन्छ',
  'hudaina': 'हुँदैन',
  'kina': 'किन',
  'kahile': 'कहिलै',
  'kasari': 'कसरी',
  'kasto': 'कस्तो',
  'kaha': 'कहाँ',
  'kahaan': 'कहाँ',
  'daju': 'दाजु',
  'bhai': 'भाइ',
  'didi': 'दीदी',
  'bahini': 'बहिनी',
  'aama': 'आमा',
  'buba': 'बुबा',
  'sathi': 'साथी',
  'mitra': 'मित्र',
  'sundar': 'सुन्दर',
  'baschhu': 'बस्छु',
  'baschu': 'बस्छु',
  'padhdaichu': 'पढ्दैछु',
  'padhdaichhu': 'पढ्दैछु',
  'hundaichha': 'हुँदैछ',
  'hundaicha': 'हुँदैछ',
  'aaja': 'आज',
  'pariksha': 'परीक्षा',
  'pahichan': 'पहिचान',
};

const CONSONANTS: [string, string][] = [
  ['ksha', 'क्ष'], ['chhya', 'क्ष'], ['ksh', 'क्ष्'],
  ['tra', 'त्र'], ['tr', 'त्र्'],
  ['gyan', 'ज्ञान'], ['gya', 'ज्ञ'], ['gy', 'ज्ञ्'],
  ['shra', 'श्र'], ['shr', 'श्र्'],
  ['kri', 'कृ'], ['kree', 'कृ'],
  ['chha', 'छ'], ['chh', 'छ्'],
  ['cha', 'च'], ['ch', 'च्'],
  ['kha', 'ख'], ['kh', 'ख्'],
  ['gha', 'घ'], ['gh', 'घ्'],
  ['nga', 'ङ'], ['ng', 'ङ्'],
  ['jha', 'झ'], ['jh', 'झ्'],
  ['tha', 'थ'], ['th', 'थ्'],
  ['dha', 'ध'], ['dh', 'ध्'],
  ['bha', 'भ'], ['bh', 'भ्'],
  ['pha', 'फ'], ['ph', 'फ्'],
  ['sha', 'श'], ['sh', 'श्'],
  ['Sha', 'ष'], ['Sh', 'ष्'],
  ['Ta', 'ट'], ['T', 'ट्'],
  ['Tha', 'ठ'], ['Th', 'ठ्'],
  ['Da', 'ड'], ['D', 'ड्'],
  ['Dha', 'ढ'], ['Dh', 'ढ्'],
  ['Na', 'ण'], ['N', 'ण्'],
  ['ka', 'क'], ['k', 'क्'],
  ['ga', 'ग'], ['g', 'ग्'],
  ['ja', 'ज'], ['j', 'ज्'],
  ['ta', 'त'], ['t', 'त्'],
  ['da', 'द'], ['d', 'द्'],
  ['na', 'न'], ['n', 'न्'],
  ['pa', 'प'], ['p', 'प्'],
  ['fa', 'फ'], ['f', 'फ्'],
  ['ba', 'ब'], ['b', 'ब्'],
  ['ma', 'म'], ['m', 'म्'],
  ['ya', 'य'], ['y', 'य्'],
  ['ra', 'र'], ['r', 'र्'],
  ['la', 'ल'], ['l', 'ल्'],
  ['va', 'व'], ['v', 'व्'],
  ['wa', 'व'], ['w', 'व्'],
  ['sa', 'स'], ['s', 'स्'],
  ['ha', 'ह'], ['h', 'ह्'],
];

/**
 * Phonetically transliterates a single Romanized English word to Nepali Unicode.
 */
export function transliterateWord(rawWord: string): string {
  if (!rawWord) return '';

  const lower = rawWord.toLowerCase();
  if (COMMON_WORDS_MAP[lower]) {
    return COMMON_WORDS_MAP[lower];
  }

  // Handle punctuation at end of word
  let prefix = '';
  let suffix = '';
  let core = rawWord;

  const preMatch = core.match(/^[^a-zA-Z0-9]+/);
  if (preMatch) {
    prefix = preMatch[0];
    core = core.slice(prefix.length);
  }

  const postMatch = core.match(/[^a-zA-Z0-9]+$/);
  if (postMatch) {
    suffix = postMatch[0];
    core = core.slice(0, core.length - suffix.length);
  }

  if (!core) {
    return rawWord;
  }

  const coreLower = core.toLowerCase();
  if (COMMON_WORDS_MAP[coreLower]) {
    return prefix + COMMON_WORDS_MAP[coreLower] + suffix;
  }

  // Rule-based transliteration of core
  let str = core;

  // Independent initial vowels
  str = str.replace(/^aa|^A/i, 'आ');
  str = str.replace(/^ai/i, 'ऐ');
  str = str.replace(/^au/i, 'औ');
  str = str.replace(/^a/i, 'अ');
  str = str.replace(/^ii|^ee|^I/i, 'ई');
  str = str.replace(/^i/i, 'इ');
  str = str.replace(/^uu|^oo|^U/i, 'ऊ');
  str = str.replace(/^u/i, 'उ');
  str = str.replace(/^ri|^R/i, 'ऋ');
  str = str.replace(/^e/i, 'ए');
  str = str.replace(/^o/i, 'ओ');

  // Replace multi-letter consonants and singles
  for (const [latin, nepali] of CONSONANTS) {
    const reg = new RegExp(latin, 'g');
    str = str.replace(reg, nepali);
  }

  // Matras applied after consonants
  str = str.replace(/्aa|्A/g, 'ा');
  str = str.replace(/्a/g, ''); // Removes halant when followed by 'a'
  str = str.replace(/्ii|्ee|्I/g, 'ी');
  str = str.replace(/्i/g, 'ि');
  str = str.replace(/्uu|्oo|्U/g, 'ू');
  str = str.replace(/्u/g, 'ु');
  str = str.replace(/्ai/g, 'ै');
  str = str.replace(/्au/g, 'ौ');
  str = str.replace(/्e/g, 'े');
  str = str.replace(/्o/g, 'ो');
  str = str.replace(/्ri/g, 'ृ');

  // Trailing halants in typical speech:
  // If the word ends with a consonant + halant, often in Nepali it represents the full consonant (like 'nepal' -> 'नेपाल' or 'ghar' -> 'घर')
  if (str.endsWith('्')) {
    str = str.slice(0, -1);
  }

  return prefix + str + suffix;
}

/**
 * Phonetically transliterates a full sentence or multi-line text to Nepali Unicode.
 */
export function transliteratePhonetic(text: string): string {
  if (!text) return '';

  // Process word by word preserving spaces and newlines
  const tokens = text.split(/(\s+)/);
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\s+$/.test(token)) {
      result.push(token);
    } else {
      result.push(transliterateWord(token));
    }
  }

  return result.join('');
}
