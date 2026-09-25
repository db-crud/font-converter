import React, { useState } from 'react';
import { ConverterCard } from '../components/ConverterCard';
import { unicodeToPreeti, preetiToUnicode } from '../converter/converter';
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
  // Mode: 'u2p' (Unicode to Preeti), 'p2u' (Preeti to Unicode), or 'both'
  const [activeMode, setActiveMode] = useState<'u2p' | 'p2u' | 'both'>('u2p');

  const toggleDirection = () => {
    setActiveMode((prev) => (prev === 'u2p' ? 'p2u' : 'u2p'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-10 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 border border-blue-200 dark:border-blue-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Fast, 100% Client-Side Nepali Conversion</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight">
            Nepali Unicode ↔ Preeti Converter
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Convert Nepali text easily between Unicode and Preeti.
          </p>

          {/* Short Description */}
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Fast, simple and accurate Nepali text conversion with automatic real-time conversion.
          </p>
        </div>
      </section>

      {/* MAIN CONVERTER SECTION — LEFT (INPUT) & RIGHT (OUTPUT) */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Converter Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveMode('u2p')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 ${
                activeMode === 'u2p'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unicode to Preeti
            </button>
            <button
              onClick={() => setActiveMode('p2u')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 ${
                activeMode === 'p2u'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Preeti to Unicode
            </button>
            <button
              onClick={() => setActiveMode('both')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                activeMode === 'both'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Show Both
            </button>
          </div>

          {activeMode !== 'both' && (
            <button
              onClick={toggleDirection}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs active:scale-95 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch Direction</span>
            </button>
          )}
        </div>

        {/* Display based on active mode */}
        {activeMode === 'u2p' && (
          <ConverterCard
            title="Unicode to Preeti Converter"
            inputLabel="Unicode Text (Left: Paste / Type)"
            outputLabel="Preeti Output (Right: Preeti Font)"
            inputPlaceholder="Type or paste Nepali Unicode text here (e.g. नमस्ते, नेपाल, काठमाडौं)..."
            convertFn={unicodeToPreeti}
            downloadFilename="preeti-text.txt"
            onSwapDirection={toggleDirection}
            isPreetiInput={false}
            isPreetiOutput={true}
          />
        )}

        {activeMode === 'p2u' && (
          <ConverterCard
            title="Preeti to Unicode Converter"
            inputLabel="Preeti Text (Left: Paste / Type)"
            outputLabel="Unicode Output (Right: Devanagari)"
            inputPlaceholder="Type or paste Preeti encoded text here (e.g. g]kfn, gd:t], ljBfno)..."
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
              inputLabel="Unicode Text (Left: Paste / Type)"
              outputLabel="Preeti Output (Right: Preeti Font)"
              inputPlaceholder="Type or paste Unicode text here..."
              convertFn={unicodeToPreeti}
              downloadFilename="preeti-text.txt"
              isPreetiInput={false}
              isPreetiOutput={true}
            />
            <ConverterCard
              title="Preeti to Unicode"
              inputLabel="Preeti Text (Left: Paste / Type)"
              outputLabel="Unicode Output (Right: Devanagari)"
              inputPlaceholder="Type or paste Preeti text here..."
              convertFn={preetiToUnicode}
              downloadFilename="unicode-text.txt"
              isPreetiInput={true}
              isPreetiOutput={false}
            />
          </div>
        )}
      </section>

      {/* QUICK TOOLS CALLOUT */}
      <section className="py-6 bg-blue-50/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all whitespace-nowrap active:scale-95"
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
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Fast</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert text instantly in real time as you type or paste, with zero lag and no button clicking required.
            </p>
          </div>

          {/* Accurate */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">Accurate</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed for proper Preeti and Unicode conversion, handling conjuncts, reph, halants, and matra ordering correctly.
            </p>
          </div>

          {/* Easy */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
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
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
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
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Convert Unicode to Preeti
                </h3>
              </div>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">1.</span>
                  <span><strong>Enter or paste Unicode text:</strong> Type or paste your modern Devanagari text into the left box.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">2.</span>
                  <span><strong>Automatic processing:</strong> The conversion engine instantly transforms matras, conjuncts, and characters into Preeti encoding displayed in authentic Preeti font on the right.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">3.</span>
                  <span><strong>Copy or download:</strong> Click Copy to copy the Preeti string, or download as <code>preeti-text.txt</code> for use in Word or PageMaker.</span>
                </li>
              </ol>
            </div>

            {/* Convert Preeti to Unicode */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Convert Preeti to Unicode
                </h3>
              </div>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">1.</span>
                  <span><strong>Enter or paste Preeti text:</strong> Paste legacy Preeti text (e.g., <code>g]kfn</code>) into the left box.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">2.</span>
                  <span><strong>Automatic processing:</strong> The converter parses glyphs, reverses reph and short-i matra ordering, producing clean Devanagari on the right.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">3.</span>
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
