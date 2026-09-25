import React, { useState } from 'react';
import { transliteratePhonetic } from '../converter/transliterate';
import { getCharCount, getWordCount } from '../converter/converter';
import { CopyButton } from '../components/CopyButton';
import { ClearButton } from '../components/ClearButton';
import { DownloadButton } from '../components/DownloadButton';
import { PasteButton } from '../components/PasteButton';
import { Keyboard, Sparkles, BookOpen } from 'lucide-react';




export const TypeInNepali: React.FC = () => {
  const [romanText, setRomanText] = useState('');
  const [nepaliText, setNepaliText] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'cheatsheet'>('editor');

  const handleRomanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRomanText(val);
    const converted = transliteratePhonetic(val);
    setNepaliText(converted);
  };

  const handlePasteRoman = (text: string) => {
    setRomanText(text);
    const converted = transliteratePhonetic(text);
    setNepaliText(converted);
  };

  const handleClear = () => {
    setRomanText('');
    setNepaliText('');
  };

  const applySample = (sample: string) => {
    setRomanText(sample);
    setNepaliText(transliteratePhonetic(sample));
  };

  const charCount = getCharCount(nepaliText);
  const wordCount = getWordCount(nepaliText);

  const cheatSheetConsonants = [
    { key: 'k', np: 'क' }, { key: 'kh', np: 'ख' }, { key: 'g', np: 'ग' }, { key: 'gh', np: 'घ' }, { key: 'ng', np: 'ङ' },
    { key: 'ch', np: 'च' }, { key: 'chh', np: 'छ' }, { key: 'j', np: 'ज' }, { key: 'jh', np: 'झ' }, { key: 't', np: 'त' },
    { key: 'th', np: 'थ' }, { key: 'd', np: 'द' }, { key: 'dh', np: 'ध' }, { key: 'n', np: 'न' }, { key: 'p', np: 'प' },
    { key: 'ph/f', np: 'फ' }, { key: 'b', np: 'ब' }, { key: 'bh', np: 'भ' }, { key: 'm', np: 'म' }, { key: 'y', np: 'य' },
    { key: 'r', np: 'र' }, { key: 'l', np: 'ल' }, { key: 'w/v', np: 'व' }, { key: 'sh', np: 'श' }, { key: 'Sh', np: 'ष' },
    { key: 's', np: 'स' }, { key: 'h', np: 'ह' }, { key: 'ksh', np: 'क्ष' }, { key: 'tr', np: 'त्र' }, { key: 'gy', np: 'ज्ञ' },
  ];

  const cheatSheetVowels = [
    { key: 'a', np: 'अ' }, { key: 'aa / A', np: 'आ / ा' }, { key: 'i', np: 'इ / ि' }, { key: 'ee / I', np: 'ई / ी' },
    { key: 'u', np: 'उ / ु' }, { key: 'oo / U', np: 'ऊ / ू' }, { key: 'e', np: 'ए / े' }, { key: 'ai', np: 'ऐ / ै' },
    { key: 'o', np: 'ओ / ो' }, { key: 'au', np: 'औ / ौ' }, { key: 'ri', np: 'ऋ / ृ' },
  ];

  return (
    <div className="flex flex-col min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Smart Phonetic Transliteration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Type in Nepali
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Type Nepali Unicode text easily.
        </p>

        {/* Quick Sample Suggestions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Examples:</span>
          <button
            onClick={() => applySample('namaste')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            <code>namaste</code> → नमस्ते
          </button>
          <button
            onClick={() => applySample('nepal')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            <code>nepal</code> → नेपाल
          </button>
          <button
            onClick={() => applySample('nepali')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            <code>nepali</code> → नेपाली
          </button>
          <button
            onClick={() => applySample('mero naam dan ho')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            <code>mero naam dan ho</code> → मेरो नाम डान हो
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Nepali Typing Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'cheatsheet'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Typing Key Map & Cheat Sheet</span>
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="flex flex-col gap-6">
          {/* Main Dual Typing Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Romanized Input Area */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>Type Romanized English</span>
                </label>
                <PasteButton onPasteText={handlePasteRoman} label="Paste" />
              </div>
              <textarea
                value={romanText}
                onChange={handleRomanChange}
                placeholder="Type here in Romanized English (e.g., namaste sathi, mero naam dan ho, nepal sundar desh ho)..."
                rows={10}
                className="w-full flex-1 p-3.5 text-base rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
              />
              <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Tip: Type in phonetic English and the Nepali Unicode will appear on the right!
              </div>
            </div>

            {/* Devanagari Output Area */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>Nepali Unicode Output</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    real-time
                  </span>
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Characters: {charCount}</span>
                  <span>•</span>
                  <span>Words: {wordCount}</span>
                </div>
              </div>
              <textarea
                value={nepaliText}
                onChange={(e) => setNepaliText(e.target.value)}
                placeholder="नेपाली युनिकोड यहाँ स्वतः देखा पर्नेछ..."
                rows={10}
                className="w-full flex-1 p-3.5 text-lg rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-nepali leading-relaxed resize-y select-all"
              />
              {/* Output Actions */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CopyButton
                    text={nepaliText}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:border-blue-600 shadow-sm"
                    label="Copy"
                  />
                  <DownloadButton content={nepaliText} filename="nepali-unicode.txt" label="Download" />
                  <ClearButton onClear={handleClear} disabled={!romanText && !nepaliText} label="Clear" />
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  Ready to copy into Facebook, Word, or messages
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Cheat Sheet / Key Mapping Tab */
        <div className="space-y-6">
          {/* Consonants Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Consonants Mapping (व्यञ्जन वर्ण)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cheatSheetConsonants.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-sm"
                >
                  <code className="text-blue-600 dark:text-blue-400 font-bold">{item.key}</code>
                  <span className="font-nepali font-semibold text-slate-900 dark:text-white text-base">
                    {item.np}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vowels Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Vowels and Matras (स्वर वर्ण र मात्रा)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cheatSheetVowels.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-sm"
                >
                  <code className="text-blue-600 dark:text-blue-400 font-bold">{item.key}</code>
                  <span className="font-nepali font-semibold text-slate-900 dark:text-white text-base">
                    {item.np}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
