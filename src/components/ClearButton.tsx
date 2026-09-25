import React from 'react';
import { Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const ClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  disabled = false,
  label = 'Clear',
  className = '',
}) => {
  const { showToast } = useToast();

  const handleClear = () => {
    if (disabled) return;
    onClear();
    showToast('Text cleared!', 'info');
  };

  return (
    <button
      onClick={handleClear}
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95 ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 shadow-xs'
      } ${className}`}
      title="Clear text (Esc)"
      aria-label="Clear text"
    >
      <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
      <span>{label}</span>
    </button>
  );
};
