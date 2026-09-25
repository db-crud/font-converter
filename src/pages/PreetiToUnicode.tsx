import React from 'react';
import { ConverterCard } from '../components/ConverterCard';
import { preetiToUnicode } from '../converter/converter';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PreetiToUnicode: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Legacy Font Modernizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Preeti to Unicode Converter
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert Preeti encoded text into modern Nepali Unicode.
        </p>
      </div>

      {/* Converter Card */}
      <div className="mb-12">
        <ConverterCard
          title="Preeti to Unicode Converter"
          inputLabel="Preeti Text"
          outputLabel="Unicode Text"
          inputPlaceholder="Type or paste Preeti encoded text here (e.g. g]kfn, gd:t], ljBfno)..."
          convertFn={preetiToUnicode}
          downloadFilename="unicode-text.txt"
          accentColor="indigo"
          isFullWidth={true}
        />
      </div>

      {/* Short Explanation & Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            What is Preeti?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Preeti is an older Nepali font popular in Nepal since the 1990s. It maps English keyboard characters directly to Nepali visual symbols. Because it relies on installed font files, the text appears as random English characters on computers or smartphones where Preeti is not installed.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Why Convert to Unicode?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Nepali Unicode is globally recognized by internet browsers, Android, iOS, Windows, Mac, and search engines like Google. Converting your old documents into Unicode allows your text to be searchable, sharable on social media, and read everywhere.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Common Preeti Codes
          </h3>
          <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-mono">
            <li><code>g]kfn</code> → नेपाल</li>
            <li><code>gd:t]</code> → नमस्ते</li>
            <li><code>1fg</code> → ज्ञान</li>
            <li><code>ljBfno</code> → विद्यालय</li>
            <li><code>;/sf/</code> → सरकार</li>
          </ul>
        </div>
      </div>

      {/* Cross link */}
      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Need to convert Unicode back to Preeti?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Use our reverse converter to export text for older publishing workflows.
          </p>
        </div>
        <Link
          to="/unicode-to-preeti"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <span>Unicode to Preeti</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
