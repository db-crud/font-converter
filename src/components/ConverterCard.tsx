import React, { useState, useEffect, useId } from 'react';
import { CopyButton } from './CopyButton';
import { ClearButton } from './ClearButton';
import { PasteButton } from './PasteButton';
import { DownloadButton } from './DownloadButton';
import { SwapButton } from './SwapButton';
import { getCharCount, getWordCount } from '../converter/converter';
import { Sparkles } from 'lucide-react';


export interface ConverterCardProps {
  title: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  convertFn: (text: string) => string;
  downloadFilename: string;
  initialInput?: string;
  onSwapWithOpposite?: (currentOutput: string) => void;
  accentColor?: 'blue' | 'indigo' | 'purple';
  isFullWidth?: boolean;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  title,
  inputLabel,
  outputLabel,
  inputPlaceholder,
  convertFn,
  downloadFilename,
  initialInput = '',
  onSwapWithOpposite,
  accentColor = 'blue',
  isFullWidth = false,
}) => {
  const [inputText, setInputText] = useState(initialInput);
  const [outputText, setOutputText] = useState('');
  const inputId = useId();
  const outputId = useId();

  // Sync external input updates if initialInput changes
  useEffect(() => {
    if (initialInput !== undefined && initialInput !== inputText) {
      setInputText(initialInput);
      setOutputText(convertFn(initialInput));
    }
  }, [initialInput]);

  // Real-time conversion on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    // Instant real-time conversion
    const converted = convertFn(value);
    setOutputText(converted);
  };

  const handlePaste = (pastedText: string) => {
    setInputText(pastedText);
    const converted = convertFn(pastedText);
    setOutputText(converted);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleSwapInternal = () => {
    if (onSwapWithOpposite) {
      onSwapWithOpposite(outputText);
    } else {
      // Internal swap if standalone
      const nextInput = outputText;
      setInputText(nextInput);
      setOutputText(convertFn(nextInput));
    }
  };

  const inputCharCount = getCharCount(inputText);
  const inputWordCount = getWordCount(inputText);
  const outputCharCount = getCharCount(outputText);
  const outputWordCount = getWordCount(outputText);

  const isPreetiOutput = downloadFilename.includes('preeti');

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-slate-950/40 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 ${
        isFullWidth ? 'w-full' : 'w-full'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              accentColor === 'indigo'
                ? 'bg-indigo-500 ring-4 ring-indigo-500/20'
                : accentColor === 'purple'
                ? 'bg-purple-500 ring-4 ring-purple-500/20'
                : 'bg-blue-500 ring-4 ring-blue-500/20'
            }`}
          />
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <SwapButton onSwap={handleSwapInternal} title="Swap text with opposite card" />
          <PasteButton onPasteText={handlePaste} label="Paste" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* INPUT SECTION */}
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>{inputLabel}</span>
              <span className="text-[10px] lowercase font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                input
              </span>
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Characters: {inputCharCount}</span>
              <span>•</span>
              <span>Words: {inputWordCount}</span>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={inputText}
              onChange={handleInputChange}
              placeholder={inputPlaceholder}
              rows={isFullWidth ? 8 : 6}
              className="w-full h-full min-h-[140px] p-3.5 text-base sm:text-base rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-sans leading-relaxed resize-y"
              aria-label={inputLabel}
            />
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setOutputText('');
                }}
                className="absolute top-2.5 right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Real-time Indicator Separator */}
        <div className="relative flex items-center justify-center my-0.5">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <div className="absolute bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xs">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Instant Real-Time Conversion</span>
          </div>
        </div>

        {/* OUTPUT SECTION */}
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor={outputId}
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>{outputLabel}</span>
              <span className="text-[10px] lowercase font-normal px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                auto output
              </span>
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Characters: {outputCharCount}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Words: {outputWordCount}
              </span>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              id={outputId}
              value={outputText}
              readOnly
              placeholder="Converted output will appear here automatically..."
              rows={isFullWidth ? 8 : 6}
              className={`w-full h-full min-h-[140px] p-3.5 text-base sm:text-base rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-100/60 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed resize-y select-all ${
                isPreetiOutput ? 'font-mono' : 'font-nepali'
              }`}
              aria-label={outputLabel}
            />
          </div>
        </div>

        {/* Output Action Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <CopyButton
              text={outputText}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:border-blue-600 shadow-sm"
              label="Copy"
            />
            <DownloadButton content={outputText} filename={downloadFilename} label="Download" />
            <ClearButton onClear={handleClear} disabled={!inputText && !outputText} label="Clear" />
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            {outputText ? 'Ready to copy or download' : 'Type or paste to convert'}
          </div>
        </div>
      </div>
    </div>
  );
};
