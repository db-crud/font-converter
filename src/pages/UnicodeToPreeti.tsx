import React from 'react';
import { ConverterCard } from '../components/ConverterCard';
import { unicodeToPreeti } from '../converter/converter';
import { Printer, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnicodeToPreeti: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Unicode to Preeti Converter
        </h1>
      </div>

      {/* Converter Card */}
      <div className="mb-12">
        <ConverterCard
          title="Unicode to Preeti Converter"
          inputLabel="Unicode Text"
          outputLabel="Preeti Text"
          inputPlaceholder="युनिकोडको टेक्स्ट यहाँ लेख्नुहोस् अथवा पेस्ट गर्नुहोस्।"
          convertFn={unicodeToPreeti}
          downloadFilename="preeti-text.txt"
          isPreetiInput={false}
          isPreetiOutput={true}
        />
      </div>

      {/* Short Explanation & Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Why Convert to Preeti?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Many publishing houses, printing presses, government offices, and legal documentation centers in Nepal still operate specialized workflows configured around traditional Preeti and Kantipur fonts in Adobe Photoshop, PageMaker, or Microsoft Word.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            How to Use Output in Word
          </h3>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
            <li>Click <strong>Copy</strong> on the Preeti Text box.</li>
            <li>Open Microsoft Word or Adobe software.</li>
            <li>Paste the text into your document.</li>
            <li>Select the pasted text and change the font to <strong>Preeti</strong>.</li>
          </ol>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Accurate Reordering
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike basic word replace scripts, our engine reorders matras like <em>hrasva</em> (ि) to appear before the consonant in Preeti, places Reph (र्) accurately, and preserves conjunct characters without corruption.
          </p>
        </div>
      </div>

      {/* Cross link */}
      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Have old Preeti files to modernize?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert old legacy Preeti text into modern web-ready Unicode.
          </p>
        </div>
        <Link
          to="/preeti-to-unicode"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <span>Preeti to Unicode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
