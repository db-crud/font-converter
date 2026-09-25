import React from 'react';
import { Download } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DownloadButtonProps {
  content: string;
  filename: string;
  label?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  label = 'Download',
  className = '',
}) => {
  const { showToast } = useToast();

  const handleDownload = () => {
    if (!content) {
      showToast('Nothing to download!', 'info');
      return;
    }

    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Downloaded successfully!', 'success');
    } catch {
      showToast('Failed to download file', 'error');
    }
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 transition-all ${className}`}
      title={`Download as ${filename}`}
      aria-label={`Download as ${filename}`}
    >
      <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      <span>{label}</span>
    </button>
  );
};
