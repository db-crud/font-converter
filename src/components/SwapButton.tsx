import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface SwapButtonProps {
  onSwap: () => void;
  title?: string;
  className?: string;
  label?: string;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onSwap,
  title = 'Swap text / direction',
  className = '',
  label = 'Swap',
}) => {
  return (
    <button
      onClick={onSwap}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 ${className}`}
      title={title}
      aria-label={title}
    >
      <ArrowLeftRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
      <span>{label}</span>
    </button>
  );
};
