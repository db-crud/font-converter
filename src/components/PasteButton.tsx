import React from 'react';
import { ClipboardPaste } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PasteButtonProps {
  onPasteText: (text: string) => void;
  label?: string;
  className?: string;
}

export const PasteButton: React.FC<PasteButtonProps> = ({
  onPasteText,
  label = 'Paste',
  className = '',
}) => {
  const { showToast } = useToast();

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onPasteText(text);
          showToast('Text pasted successfully!', 'success');
        } else {
          showToast('Clipboard is empty', 'info');
        }
      } else {
        showToast('Clipboard access unavailable. Please paste using Ctrl+V', 'info');
      }
    } catch {
      showToast('Clipboard permission denied. Please paste using Ctrl+V', 'error');
    }
  };

  return (
    <button
      onClick={handlePaste}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 transition-all ${className}`}
      title="Paste from clipboard"
      aria-label="Paste from clipboard"
    >
      <ClipboardPaste className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      <span>{label}</span>
    </button>
  );
};
