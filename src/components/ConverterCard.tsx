import React, { useState, useEffect, useId } from 'react';
import { CopyButton } from './CopyButton';
import { ClearButton } from './ClearButton';
import { PasteButton } from './PasteButton';
import { DownloadButton } from './DownloadButton';
import { SwapButton } from './SwapButton';
import { getCharCount, getWordCount } from '../converter/converter';
import { Eye, Code2 } from 'lucide-react';



export interface ConverterCardProps {
  title: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  convertFn: (text: string) => string;
  downloadFilename: string;
  initialInput?: string;
  onSwapDirection?: () => void;
  isPreetiInput?: boolean;
  isPreetiOutput?: boolean;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  title,
  inputLabel,
  outputLabel,
  inputPlaceholder,
  convertFn,
  downloadFilename,
  initialInput = '',
  onSwapDirection,
  isPreetiInput = false,
  isPreetiOutput = false,
}) => {
  const [inputText, setInputText] = useState(initialInput);
  const [outputText, setOutputText] = useState('');
  // Show in actual Preeti font by default so it looks like Nepali, not English!
  const [renderPreetiFont, setRenderPreetiFont] = useState(true);
  const [renderPreetiInputFont, setRenderPreetiInputFont] = useState(true);

  const inputId = useId();
  const outputId = useId();

  // Sync external input updates
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

  const inputCharCount = getCharCount(inputText);
  const inputWordCount = getWordCount(inputText);
  const outputCharCount = getCharCount(outputText);
  const outputWordCount = getWordCount(outputText);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden transition-all duration-200">
      {/* Card Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/90 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-500/20" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            {title}
          </h2>
        </div>

        {onSwapDirection && (
          <SwapButton
            onSwap={onSwapDirection}
            label="Swap Direction"
            title="Switch conversion direction"
          />
        )}
      </div>

      {/* HORIZONTAL CONVERTER: LEFT (INPUT) & RIGHT (OUTPUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:border-slate-800">
        {/* ================= LEFT BOX: INPUT ================= */}
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          {/* Input Header & Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor={inputId}
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
              >
                {inputLabel}
              </label>

              {isPreetiInput && (
                <button
                  type="button"
                  onClick={() => setRenderPreetiInputFont(!renderPreetiInputFont)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${
                    renderPreetiInputFont
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                  title="Toggle Preeti font rendering for input"
                >
                  {renderPreetiInputFont ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                  <span>{renderPreetiInputFont ? 'Preeti Font' : 'English / Raw'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <PasteButton onPasteText={handlePaste} label="Paste" />
              <ClearButton onClear={handleClear} disabled={!inputText} label="Clear" />
            </div>
          </div>

          {/* Left Textarea */}
          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={inputText}
              onChange={handleInputChange}
              placeholder={inputPlaceholder}
              rows={7}
              className={`w-full h-full min-h-[160px] sm:min-h-[180px] p-3 sm:p-3.5 text-base rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all leading-relaxed resize-y ${
                isPreetiInput && renderPreetiInputFont
                  ? 'font-preeti text-xl tracking-wide'
                  : isPreetiInput
                  ? 'font-mono text-base'
                  : 'font-nepali text-lg'
              }`}
              aria-label={inputLabel}
            />
          </div>

          {/* Left Footer: Dynamic Stats */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-2 sm:gap-3 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Chars: {inputCharCount}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Words: {inputWordCount}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
              Paste or type here
            </span>
          </div>
        </div>

        {/* ================= RIGHT BOX: OUTPUT ================= */}
        <div className="p-4 sm:p-6 flex flex-col gap-3 bg-slate-50/30 dark:bg-slate-950/20">
          {/* Output Header & Preeti Font Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor={outputId}
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
              >
                {outputLabel}
              </label>

              {/* Preeti Font Toggle Button */}
              {isPreetiOutput && (
                <button
                  type="button"
                  onClick={() => setRenderPreetiFont(!renderPreetiFont)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 shadow-2xs ${
                    renderPreetiFont
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                  title="Toggle between Preeti font display and raw ASCII English characters"
                >
                  {renderPreetiFont ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                  <span>{renderPreetiFont ? 'Preeti Font (नेपाली)' : 'Raw ASCII (English)'}</span>
                </button>
              )}
            </div>

            {/* Output Stats */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Chars: {outputCharCount}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Words: {outputWordCount}
              </span>
            </div>
          </div>

          {/* Right Textarea */}
          <div className="relative flex-1">
            <textarea
              id={outputId}
              value={outputText}
              readOnly
              placeholder="Converted output will appear here in real time..."
              rows={7}
              className={`w-full h-full min-h-[160px] sm:min-h-[180px] p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all leading-relaxed resize-y select-all ${
                isPreetiOutput && renderPreetiFont
                  ? 'font-preeti text-2xl tracking-wide text-slate-900 dark:text-slate-100'
                  : isPreetiOutput
                  ? 'font-mono text-base'
                  : 'font-nepali text-lg'
              }`}
              aria-label={outputLabel}
            />
          </div>

          {/* Right Footer: Actions (Copy, Download, Clear) */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CopyButton
                text={outputText}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:border-emerald-600 shadow-sm px-3.5 sm:px-4 py-2 font-bold"
                label="Copy"
              />
              <DownloadButton
                content={outputText}
                filename={downloadFilename}
                label="Download"
              />
              <ClearButton
                onClear={handleClear}
                disabled={!inputText && !outputText}
                label="Clear"
              />
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              {isPreetiOutput && renderPreetiFont
                ? 'Showing in Preeti Font'
                : outputText
                ? 'Ready to copy or download'
                : 'Waiting for input...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
