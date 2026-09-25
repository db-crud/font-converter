import React, { useState } from 'react';
import { ConverterCard } from '../components/ConverterCard';
import { unicodeToPreeti, preetiToUnicode } from '../converter/converter';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Download,
  Smartphone,
  ArrowRight,
  Keyboard,
  ArrowLeftRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { hero } = useSiteSettings();
  // Mode: 'u2p' (Unicode to Preeti), 'p2u' (Preeti to Unicode), or 'both'
  const [activeMode, setActiveMode] = useState<'u2p' | 'p2u' | 'both'>('u2p');

  const toggleDirection = () => {
    setActiveMode((prev) => (prev === 'u2p' ? 'p2u' : 'u2p'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-6 sm:pt-12 sm:pb-8 bg-gradient-to-b from-emerald-50/60 via-teal-50/20 to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
            {hero.title}
          </h1>

          {/* Subtitle / Barrier statement */}
          <p className="mt-3 text-base sm:text-lg md:text-xl font-semibold text-emerald-700 dark:text-emerald-400">
            {hero.subtitle}
          </p>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {hero.description}
          </p>

          {/* Proudly Built in Nepal Badge */}
          <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/80 shadow-xs text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>{hero.badgePrefix}</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{hero.companyName}</span>
          </div>
        </div>
      </section>

      {/* MAIN CONVERTER SECTION — LEFT (INPUT) & RIGHT (OUTPUT) */}
      <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Converter Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveMode('u2p')}
              className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 ${
                activeMode === 'u2p'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unicode to Preeti
            </button>
            <button
              onClick={() => setActiveMode('p2u')}
              className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 ${
                activeMode === 'p2u'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Preeti to Unicode
            </button>
            <button
              onClick={() => setActiveMode('both')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                activeMode === 'both'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Show Both
            </button>
          </div>

          {activeMode !== 'both' && (
            <button
              onClick={toggleDirection}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs active:scale-95 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch Direction</span>
            </button>
          )}
        </div>

        {/* Display based on active mode */}
        {activeMode === 'u2p' && (
          <ConverterCard
            title="Unicode to Preeti"
            inputLabel="Unicode Text"
            outputLabel="Preeti Text"
            inputPlaceholder="युनिकोडको टेक्स्ट यहाँ लेख्नुहोस् अथवा पेस्ट गर्नुहोस्।"
            convertFn={unicodeToPreeti}
            downloadFilename="preeti-text.txt"
            onSwapDirection={toggleDirection}
            isPreetiInput={false}
            isPreetiOutput={true}
          />
        )}

        {activeMode === 'p2u' && (
          <ConverterCard
            title="Preeti to Unicode"
            inputLabel="Preeti Text"
            outputLabel="Unicode Text"
            inputPlaceholder="प्रीतिको टेक्स्ट यहाँ लेख्नुहोस् अथवा पेस्ट गर्नुहोस्।"
            convertFn={preetiToUnicode}
            downloadFilename="unicode-text.txt"
            onSwapDirection={toggleDirection}
            isPreetiInput={true}
            isPreetiOutput={false}
          />
        )}

        {activeMode === 'both' && (
          <div className="space-y-8">
            <ConverterCard
              title="Unicode to Preeti"
              inputLabel="Unicode Text"
              outputLabel="Preeti Text"
              inputPlaceholder="युनिकोडको टेक्स्ट यहाँ लेख्नुहोस् अथवा पेस्ट गर्नुहोस्।"
              convertFn={unicodeToPreeti}
              downloadFilename="preeti-text.txt"
              isPreetiInput={false}
              isPreetiOutput={true}
            />
            <ConverterCard
              title="Preeti to Unicode"
              inputLabel="Preeti Text"
              outputLabel="Unicode Text"
              inputPlaceholder="प्रीतिको टेक्स्ट यहाँ लेख्नुहोस् अथवा पेस्ट गर्नुहोस्।"
              convertFn={preetiToUnicode}
              downloadFilename="unicode-text.txt"
              isPreetiInput={true}
              isPreetiOutput={false}
            />
          </div>
        )}
      </section>

      {/* QUICK TOOLS CALLOUT */}
      <section className="py-6 bg-emerald-50/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Need to type in Nepali?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try our phonetic Nepali typing tool: type in English (e.g. namaste) and get Nepali Unicode (नमस्ते).
                </p>
              </div>
            </div>
            <Link
              to="/type-in-nepali"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <span>Type in Nepali</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY USE NEPALI CONVERTER? (FEATURE SECTION) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
            Why Use Nepali Converter?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A reliable, lightweight utility engineered specifically for Nepali language typography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fast */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Fast</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert text instantly in real time as you type or paste, with zero lag and no button clicking required.
            </p>
          </div>

          {/* Accurate */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Accurate</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed for proper Preeti and Unicode conversion, handling conjuncts, reph, halants, and matra ordering correctly.
            </p>
          </div>

          {/* Easy */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Easy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Simple interface with no unnecessary steps. Left (Input) and Right (Output) layout provides immediate clarity.
            </p>
          </div>

          {/* Free */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Free</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              100% free with unlimited conversion. No sign-up, no subscriptions, and complete client-side data privacy.
            </p>
          </div>

          {/* Copy & Download */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Copy & Download</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Save your converted text easily with one-click clipboard copy and UTF-8 encoded text file downloads.
            </p>
          </div>

          {/* Mobile Friendly */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Mobile Friendly</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Works seamlessly on smartphones, tablets, laptops, and desktop screens with responsive touch controls.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
              How It Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Three simple steps to convert any Nepali text document.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Convert Unicode to Preeti */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Convert Unicode to Preeti
                </h3>
              </div>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">1.</span>
                  <span><strong>Enter or paste Unicode text:</strong> Type or paste your modern Devanagari text into the left box.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">2.</span>
                  <span><strong>Automatic processing:</strong> The conversion engine instantly transforms matras, conjuncts, and characters into Preeti encoding displayed in authentic Preeti font on the right.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">3.</span>
                  <span><strong>Copy or download:</strong> Click Copy to copy the Preeti string, or download as <code>preeti-text.txt</code> for use in Word or PageMaker.</span>
                </li>
              </ol>
            </div>

            {/* Convert Preeti to Unicode */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Convert Preeti to Unicode
                </h3>
              </div>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">1.</span>
                  <span><strong>Enter or paste Preeti text:</strong> Paste legacy Preeti text (e.g., <code>g]kfn</code>) into the left box.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">2.</span>
                  <span><strong>Automatic processing:</strong> The converter parses glyphs, reverses reph and short-i matra ordering, producing clean Devanagari on the right.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">3.</span>
                  <span><strong>Copy or download:</strong> Click Copy to use on Facebook, websites, phones, or download as <code>unicode-text.txt</code>.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Learn more about Nepali fonts, Unicode, and text encoding.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
              What is the difference between Preeti and Unicode?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Preeti is a legacy 8-bit ASCII font where English keyboard characters are visually styled to look like Nepali characters when the font is installed. Unicode is the international standard where every Nepali character has its own unique digital code, making it readable across all modern websites, smartphones, and software without installing special fonts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
              Why does Preeti text look like random English characters without the font?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Because Preeti uses standard English ASCII letters (for example, typing <code>g]kfn</code> to produce नेपाल). In our converter, we automatically load and render the official Preeti font so you can see the Nepali glyphs directly on the screen!
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
              Is my text stored or sent to any server?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No. All conversions happen 100% locally in your web browser using JavaScript. No text is ever uploaded or recorded on any server, ensuring complete confidentiality for your legal, school, and government documents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
