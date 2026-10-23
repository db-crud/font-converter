import React, { useState } from 'react';
import { useSiteSettings, type FontItem } from '../context/SiteSettingsContext';
import { useToast } from '../context/ToastContext';
import {
  Download,
  CheckCircle,
  FileText,
  Sparkles,
  Monitor,
  Info,
  ArrowRight,
  Search,
  Archive,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

export const Downloads: React.FC = () => {
  const { fonts, recordFontDownload } = useSiteSettings();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  const categories = ['All', 'Traditional', 'Unicode', 'Romanized'];

  const filteredFonts = fonts.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (font: FontItem) => {
    setDownloadingId(font.id);
    recordFontDownload(font.id);
    showToast(`Downloading ${font.name}...`, 'success');

    const link = document.createElement('a');
    link.href = font.fileUrl;
    link.download = font.filename || `${font.name.replace(/\s+/g, '_')}.ttf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  const handleDownloadAllZip = async () => {
    if (filteredFonts.length === 0) {
      showToast('No fonts available to download.', 'error');
      return;
    }

    setDownloadingZip(true);
    showToast(`Creating ZIP with ${filteredFonts.length} font(s)...`, 'info');

    try {
      const zip = new JSZip();
      const folder = zip.folder('Nepali_Fonts') || zip;

      for (const font of filteredFonts) {
        recordFontDownload(font.id);

        if (font.fileUrl.startsWith('data:')) {
          // Base64 data URL
          const parts = font.fileUrl.split(',');
          if (parts[1]) {
            folder.file(font.filename, parts[1], { base64: true });
          }
        } else {
          // URL path (e.g. /fonts/Preeti.ttf)
          try {
            const resp = await fetch(font.fileUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              folder.file(font.filename, blob);
            }
          } catch (e) {
            console.warn(`Could not bundle ${font.name}:`, e);
          }
        }
      }

      // Add a helpful readme inside the zip
      folder.file(
        'README.txt',
        `Nepali Fonts Pack\nDownloaded from Nepali Font Converter (Preeti <-> Unicode)\nTotal Fonts: ${filteredFonts.length}\nDate: ${new Date().toLocaleDateString()}\n\nInstallation:\n- Windows: Right click each .ttf file and choose Install.\n- Mac: Double click the .ttf file and click Install Font.`
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Nepali_Fonts_Pack_${selectedCategory === 'All' ? 'All' : selectedCategory}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showToast(`ZIP package downloaded successfully! (${filteredFonts.length} fonts)`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating ZIP file.', 'error');
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Font Repository • {fonts.length} Fonts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Download Nepali Fonts
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Download official, authentic Nepali fonts including Preeti, Kantipur, Sagarmatha, Himali, and Unicode standards for Windows, Mac, and mobile devices. 100% free and ready to install.
        </p>

        {/* Action: Download All as ZIP */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadAllZip}
            disabled={downloadingZip || filteredFonts.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {downloadingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating ZIP Package...</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Download All as ZIP ({filteredFonts.length} Fonts)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? `All Fonts (${fonts.length})` : `${cat} Fonts`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts by name..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Fonts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredFonts.map((font) => (
          <div
            key={font.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div>
              {/* Top Row: Title & Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{font.name}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                    {font.filename}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {font.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {font.description}
              </p>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Font Visual Preview:
                </span>
                {font.category === 'Traditional' ? (
                  <p className="font-preeti text-xl sm:text-2xl text-slate-900 dark:text-white leading-normal">
                    {'g]kfn ;\'Gb/ / zflGtk"0f{ b]z xf] .'}
                  </p>
                ) : (
                  <p className="font-nepali text-lg sm:text-xl text-slate-900 dark:text-white leading-normal">
                    नेपाल एक सुन्दर, शान्तिप्रिय र सार्वभौमसत्ता सम्पन्न देश हो।
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Row: Metadata & Download Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{font.fileSize}</span>
                <span>•</span>
                <span>{font.downloadCount.toLocaleString()} downloads</span>
              </div>

              <button
                onClick={() => handleDownload(font)}
                disabled={downloadingId === font.id}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
              >
                {downloadingId === font.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 animate-spin text-white" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFonts.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-12">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            No fonts found matching your search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Font Installation Instructions Guide */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>How to Install Downloaded Fonts on Your Computer</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Windows 11 / 10 / 8 / 7:
            </h3>
            <ol className="space-y-1.5 list-decimal list-inside text-xs sm:text-sm">
              <li>Click the <strong>Download</strong> button above to download the font or ZIP file.</li>
              <li>If downloaded as ZIP, right-click and choose <em>Extract All</em>.</li>
              <li>Right-click on the <code>.ttf</code> or <code>.otf</code> font file.</li>
              <li>Select <strong>Install</strong> (or <em>Install for all users</em>).</li>
              <li>Restart Microsoft Word, Photoshop, or your browser to start typing!</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Mac OS (Apple):
            </h3>
            <ol className="space-y-1.5 list-decimal list-inside text-xs sm:text-sm">
              <li>Download the font or ZIP file to your Mac Downloads folder.</li>
              <li>Double-click the downloaded <code>.ttf</code> file (or extract the ZIP first).</li>
              <li>Font Book will open; click the <strong>Install Font</strong> button.</li>
              <li>The font is now installed across all applications on your Mac!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Admin Notice Banner */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Need to add more fonts or upload ZIP font collections? Administrators can upload single fonts or entire ZIP archives directly in the Admin Panel.
          </p>
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-2xs hover:bg-emerald-50 transition-colors whitespace-nowrap active:scale-95"
        >
          <span>Admin Panel</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
