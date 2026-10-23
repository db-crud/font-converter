import React, { useState } from 'react';
import { useSiteSettings, type FontItem } from '../context/SiteSettingsContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Upload,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Download,
  Mail,
  Home,
  Info,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Archive,
  Loader2,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { SiteLogo } from '../components/SiteLogo';

interface ExtractedZipFont {
  name: string;
  filename: string;
  category: FontItem['category'];
  fileSize: string;
  dataUrl: string;
}

export const Admin: React.FC = () => {
  const {
    hero,
    about,
    contact,
    fonts,
    messages,
    logoutAdmin,
    updateHero,
    updateLogo,
    updateAbout,
    updateContact,
    addFont,
    addMultipleFonts,
    deleteFont,
    updateFont,
    markMessageRead,
    deleteMessage,
    resetAllSettings,
  } = useSiteSettings();

  const { logout, changePassword, credentials } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Dashboard active tab: 'overview' | 'fonts' | 'home' | 'about' | 'contact' | 'settings'
  const [activeTab, setActiveTab] = useState<'overview' | 'fonts' | 'home' | 'about' | 'contact' | 'settings'>('overview');

  // Form states for Home Editor
  const [heroForm, setHeroForm] = useState(hero);

  // Form states for About Editor
  const [aboutForm, setAboutForm] = useState(about);

  // Form states for Contact Editor
  const [contactForm, setContactForm] = useState(contact);

  // Settings / Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Font Upload Modal / Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFontName, setNewFontName] = useState('');
  const [newFontCategory, setNewFontCategory] = useState<'Traditional' | 'Unicode' | 'Romanized' | 'Other'>('Traditional');
  const [newFontDesc, setNewFontDesc] = useState('');
  const [newFontFile, setNewFontFile] = useState<File | null>(null);

  // ZIP Upload & Batch Extraction State
  const [zipFontEntries, setZipFontEntries] = useState<ExtractedZipFont[]>([]);
  const [isZipLoading, setIsZipLoading] = useState(false);
  const [isZipMode, setIsZipMode] = useState(false);
  const [exportingZip, setExportingZip] = useState(false);

  // Font Editing Modal
  const [editingFont, setEditingFont] = useState<FontItem | null>(null);

  // Handle Logout
  const handleLogout = () => {
    logout();
    logoutAdmin();
    showToast('Logged out of Admin Panel.', 'info');
    navigate('/login');
  };

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }

    setPasswordChangeLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setPasswordChangeLoading(false);

    if (result.success) {
      showToast('Password updated successfully! Please use your new password next time.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(result.message || 'Failed to change password.', 'error');
    }
  };

  // Handle Logo Upload (PNG, JPG, SVG, WebP)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP).', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo file should be less than 2MB for optimal performance.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setHeroForm((prev) => ({ ...prev, logoUrl: result }));
      showToast('Logo image selected! Click "Save Logo" to apply changes.', 'info');
    };
    reader.onerror = () => {
      showToast('Failed to load image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogoOnly = () => {
    updateLogo(heroForm.logoUrl || '');
    showToast('Website logo updated and saved successfully!', 'success');
  };

  const handleRemoveLogo = () => {
    setHeroForm((prev) => ({ ...prev, logoUrl: '' }));
    updateLogo('');
    showToast('Custom logo removed. Default logo restored.', 'info');
  };

  // Handle Home Save
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showToast('Home page content & logo updated successfully!', 'success');
  };

  // Handle About Save
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(aboutForm);
    showToast('About Us content updated successfully!', 'success');
  };

  // Handle Contact Save
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
    showToast('Contact information updated successfully!', 'success');
  };

  // Handle Font File Selection (supports .ttf, .otf, .woff, and .zip)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFontFile(file);
      const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip');

      if (isZip) {
        setIsZipMode(true);
        setIsZipLoading(true);
        setZipFontEntries([]);

        try {
          const zip = await JSZip.loadAsync(file);
          const entries: ExtractedZipFont[] = [];

          for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (zipEntry.dir) continue;
            if (relativePath.includes('__MACOSX') || relativePath.startsWith('.')) continue;
            const lower = relativePath.toLowerCase();

            if (
              lower.endsWith('.ttf') ||
              lower.endsWith('.otf') ||
              lower.endsWith('.woff') ||
              lower.endsWith('.woff2')
            ) {
              const filename = relativePath.split('/').pop() || relativePath;
              const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

              // Auto-categorize based on common Nepali font naming
              let category: FontItem['category'] = 'Traditional';
              if (lower.includes('unicode') && lower.includes('roman')) {
                category = 'Romanized';
              } else if (lower.includes('unicode') || lower.includes('mangal') || lower.includes('kalimati') || lower.includes('gargi')) {
                category = 'Unicode';
              } else if (lower.includes('preeti') || lower.includes('kantipur') || lower.includes('sagarmatha') || lower.includes('himali')) {
                category = 'Traditional';
              }

              const base64 = await zipEntry.async('base64');
              const mime = lower.endsWith('.otf')
                ? 'font/otf'
                : lower.endsWith('.woff')
                ? 'font/woff'
                : lower.endsWith('.woff2')
                ? 'font/woff2'
                : 'font/ttf';
              const dataUrl = `data:${mime};base64,${base64}`;

              const rawLength = (base64.length * 3) / 4;
              const formattedSize =
                rawLength > 1024 * 1024
                  ? `${(rawLength / (1024 * 1024)).toFixed(1)} MB`
                  : `${(rawLength / 1024).toFixed(1)} KB`;

              entries.push({
                name: baseName.charAt(0).toUpperCase() + baseName.slice(1),
                filename,
                category,
                fileSize: formattedSize,
                dataUrl,
              });
            }
          }

          setZipFontEntries(entries);
          if (entries.length > 0) {
            showToast(`ZIP loaded! Found ${entries.length} font file(s).`, 'success');
          } else {
            showToast(`No font files found inside ZIP. You can publish the ZIP package directly.`, 'info');
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setNewFontName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to parse ZIP archive', 'error');
          setZipFontEntries([]);
        } finally {
          setIsZipLoading(false);
        }
      } else {
        setIsZipMode(false);
        setZipFontEntries([]);
        if (!newFontName) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setNewFontName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    }
  };

  // Import all fonts extracted from the ZIP in one action
  const handleImportAllFromZip = () => {
    if (zipFontEntries.length === 0) {
      showToast('No fonts found to import from this ZIP', 'error');
      return;
    }

    const toAdd = zipFontEntries.map((zf) => ({
      name: zf.name,
      category: zf.category,
      description: `${zf.category} Nepali font extracted from ${newFontFile?.name || 'ZIP bundle'}.`,
      filename: zf.filename,
      fileUrl: zf.dataUrl,
      fileSize: zf.fileSize,
    }));

    addMultipleFonts(toAdd);
    showToast(`Successfully imported ${toAdd.length} font(s) from ZIP!`, 'success');

    // Reset upload form
    setNewFontName('');
    setNewFontDesc('');
    setNewFontFile(null);
    setZipFontEntries([]);
    setIsZipMode(false);
    setShowUploadModal(false);
  };

  // Handle Font Upload / Submit (Single font file or single ZIP package)
  const handleAddFontSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isZipMode && zipFontEntries.length > 0) {
      handleImportAllFromZip();
      return;
    }

    if (!newFontName) {
      showToast('Please provide a font name', 'error');
      return;
    }

    if (!newFontFile) {
      showToast('Please select a font or ZIP file', 'error');
      return;
    }

    // Convert file to Data URL for persistent in-browser storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const formattedSize =
        newFontFile.size > 1024 * 1024
          ? `${(newFontFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(newFontFile.size / 1024).toFixed(1)} KB`;

      addFont({
        name: newFontName,
        category: newFontCategory,
        description: newFontDesc || `${newFontCategory} Nepali font package.`,
        filename: newFontFile.name,
        fileUrl: dataUrl,
        fileSize: formattedSize,
      });

      showToast(`Font "${newFontName}" added successfully!`, 'success');
      // Reset form
      setNewFontName('');
      setNewFontDesc('');
      setNewFontFile(null);
      setZipFontEntries([]);
      setIsZipMode(false);
      setShowUploadModal(false);
    };

    reader.readAsDataURL(newFontFile);
  };

  // Handle Export All Fonts as a single ZIP archive
  const handleExportAllZip = async () => {
    if (fonts.length === 0) {
      showToast('No fonts available to export', 'error');
      return;
    }

    setExportingZip(true);
    showToast('Creating ZIP archive of all fonts...', 'info');

    try {
      const zip = new JSZip();
      const folder = zip.folder('Nepali_Fonts') || zip;

      for (const font of fonts) {
        if (font.fileUrl.startsWith('data:')) {
          const parts = font.fileUrl.split(',');
          if (parts[1]) {
            folder.file(font.filename, parts[1], { base64: true });
          }
        } else {
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

      folder.file(
        'README.txt',
        `Nepali Fonts Archive\nExported from Admin Panel\nTotal Fonts: ${fonts.length}\nDate: ${new Date().toLocaleDateString()}`
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `All_Nepali_Fonts_Backup_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      showToast('All fonts exported as ZIP successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export fonts as ZIP', 'error');
    } finally {
      setExportingZip(false);
    }
  };

  // Handle Edit Font Submit
  const handleEditFontSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFont) return;

    updateFont(editingFont.id, {
      name: editingFont.name,
      category: editingFont.category,
      description: editingFont.description,
    });

    showToast(`Font "${editingFont.name}" updated!`, 'success');
    setEditingFont(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all site content and default fonts to factory defaults?')) {
      resetAllSettings();
      setHeroForm(hero);
      setAboutForm(about);
      setContactForm(contact);
      showToast('Site settings reset to defaults!', 'info');
    }
  };

  // ================= LOGGED IN DASHBOARD =================
  const totalDownloads = fonts.reduce((sum, f) => sum + f.downloadCount, 0);
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Admin Header Bar with Logo on left and 'Admin Panel' underneath */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-col items-start gap-1">
          {/* Logo matching main navbar */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-0.5"
            title="Go to Home"
          >
            <SiteLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
                Font Converter
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Preeti ↔ Unicode
              </span>
            </div>
          </Link>

          {/* 'Admin Panel' written beneath the logo */}
          <div className="flex items-center gap-2 pl-0.5 mt-0.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-md inline-block">
              Admin Panel
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Session
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition-colors"
            title="Reset site text and fonts to original settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition-colors active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'fonts'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Font Manager</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-slate-800 font-bold">
            {fonts.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('home');
            setHeroForm(hero);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'home'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>Home Page Editor</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('about');
            setAboutForm(about);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'about'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About Us Editor</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('contact');
            setContactForm(contact);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'contact'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact & Messages</span>
          {unreadMessagesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Fonts
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {fonts.length}
              </div>
              <p className="text-xs text-slate-400 mt-2">Available for users to download</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Downloads
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading mt-1">
                {totalDownloads.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-2">Across all font packages</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                User Feedback
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {messages.length}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Company Brand
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-1 truncate">
                {hero.companyName}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Live on Home & Footer
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setActiveTab('fonts');
                  setShowUploadModal(true);
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all group"
              >
                <Upload className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 dark:text-white text-sm">Upload New Font</div>
                <div className="text-xs text-slate-500 mt-1">Add .ttf or .otf file with description</div>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all group"
              >
                <Edit2 className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 dark:text-white text-sm">Edit Home Message</div>
                <div className="text-xs text-slate-500 mt-1">Customize hero title and mission slogan</div>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all group"
              >
                <Mail className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 dark:text-white text-sm">View User Feedback</div>
                <div className="text-xs text-slate-500 mt-1">Read messages submitted from Contact Us</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FONT MANAGER ================= */}
      {activeTab === 'fonts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Font Packages & Upload Manager
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Add, customize, and upload font packages. Download options update instantly on the site.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportAllZip}
                disabled={exportingZip || fonts.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
                title="Download all fonts packaged into a ZIP archive"
              >
                {exportingZip ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <Archive className="w-4 h-4 text-emerald-600" />
                )}
                <span>Export All as ZIP</span>
              </button>

              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setIsZipMode(false);
                  setZipFontEntries([]);
                  setNewFontFile(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Fonts / ZIP</span>
              </button>
            </div>
          </div>

          {/* Upload New Font / ZIP Modal Box */}
          {showUploadModal && (
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-850 border border-emerald-300 dark:border-emerald-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>Upload Fonts (.TTF / .OTF / .ZIP)</span>
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* File Picker */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Font File or ZIP Archive (.ttf, .otf, .woff, .zip) *
                </label>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2,.zip,application/zip,application/x-zip-compressed"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  required
                />
                {newFontFile && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    {isZipMode ? <Archive className="w-4 h-4 text-emerald-600 shrink-0" /> : <FileText className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <span>Selected: <strong>{newFontFile.name}</strong> ({(newFontFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {/* Loading ZIP indicator */}
              {isZipLoading && (
                <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center gap-3 text-sm text-emerald-700 dark:text-emerald-400 mb-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing font files inside ZIP archive...</span>
                </div>
              )}

              {/* Detected Fonts inside ZIP */}
              {isZipMode && !isZipLoading && zipFontEntries.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 mb-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        Found {zipFontEntries.length} font file(s) in this ZIP:
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Ready to bulk import
                    </span>
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 mb-4 divide-y divide-slate-100 dark:divide-slate-800/60">
                    {zipFontEntries.map((zf, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{zf.name}</span>
                          <span className="text-slate-400 font-mono text-[10px]">({zf.filename})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {zf.category}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{zf.fileSize}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleImportAllFromZip}
                    className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Extract & Import All ({zipFontEntries.length}) Fonts into Repository</span>
                  </button>
                </div>
              )}

              {/* Single Font or Bundle Form (also applies if single font file is selected or manual override) */}
              {(!isZipMode || zipFontEntries.length === 0) && (
                <form onSubmit={handleAddFontSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Font Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Font / Package Name *
                      </label>
                      <input
                        type="text"
                        value={newFontName}
                        onChange={(e) => setNewFontName(e.target.value)}
                        placeholder="e.g. Sagarmatha Font, Kalimati, Ritu"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={newFontCategory}
                        onChange={(e) => setNewFontCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Traditional">Traditional (Preeti / Kantipur / Legacy)</option>
                        <option value="Unicode">Unicode Standard</option>
                        <option value="Romanized">Romanized Layout</option>
                        <option value="Other">Other Typeface / Bundle</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newFontDesc}
                      onChange={(e) => setNewFontDesc(e.target.value)}
                      placeholder="Short description of this font, usage instructions, or origin..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                    >
                      Upload and Publish Font
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Fonts List Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Font Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Filename</th>
                  <th className="px-4 py-3.5">Size</th>
                  <th className="px-4 py-3.5">Downloads</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fonts.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {f.name}
                      {f.isDefault && (
                        <span className="ml-2 text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Built-in
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {f.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {f.filename}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.fileSize}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {f.downloadCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingFont(f)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={f.fileUrl}
                          download={f.filename}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Test download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete font "${f.name}"?`)) {
                              deleteFont(f.id);
                              showToast(`Font "${f.name}" removed`, 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete font"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Font Modal */}
          {editingFont && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Edit Font Details: {editingFont.name}
                </h3>
                <form onSubmit={handleEditFontSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Font Name
                    </label>
                    <input
                      type="text"
                      value={editingFont.name}
                      onChange={(e) => setEditingFont({ ...editingFont, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={editingFont.category}
                      onChange={(e) => setEditingFont({ ...editingFont, category: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Traditional">Traditional</option>
                      <option value="Unicode">Unicode</option>
                      <option value="Romanized">Romanized</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingFont.description}
                      onChange={(e) => setEditingFont({ ...editingFont, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingFont(null)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: HOME PAGE EDITOR ================= */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Edit Home Page Messages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Update the hero banner title, subtitle, descriptive text, and organization attribution.
            </p>

            <form onSubmit={handleSaveHero} className="space-y-6">
              {/* Website Logo Upload Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Website Logo (साइट / कम्पनी लोगो)</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload custom logo image (PNG, JPG, SVG, WebP). It updates on Navbar, Footer, and Header.
                    </p>
                  </div>
                  {heroForm.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Reset to default logo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Logo</span>
                    </button>
                  )}
                </div>

                {/* Logo Preview & Upload Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  {/* Preview Cards */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                        {heroForm.logoUrl ? (
                          <img
                            src={heroForm.logoUrl}
                            alt="Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white">
                            <span className="font-nepali text-2xl font-bold">ने</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">Light UI</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                        {heroForm.logoUrl ? (
                          <img
                            src={heroForm.logoUrl}
                            alt="Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white">
                            <span className="font-nepali text-2xl font-bold">ने</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">Dark UI</span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 pl-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {heroForm.logoUrl ? 'Custom Logo' : 'Default Logo'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {heroForm.logoUrl ? 'Active Image' : 'Gradient (ने)'}
                      </div>
                    </div>
                  </div>

                  {/* Upload and Save Logo Action */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-600/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-all text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <Upload className="w-4 h-4" />
                      <span>Choose Logo Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleSaveLogoOnly}
                      className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Logo</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  App Name / Main Heading
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle / Mission Statement
                </label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Main Descriptive Paragraph
                </label>
                <textarea
                  rows={4}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Badge Prefix
                  </label>
                  <input
                    type="text"
                    value={heroForm.badgePrefix}
                    onChange={(e) => setHeroForm({ ...heroForm, badgePrefix: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Company Name Attribution
                  </label>
                  <input
                    type="text"
                    value={heroForm.companyName}
                    onChange={(e) => setHeroForm({ ...heroForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Home Page & Logo Settings</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Home Banner Preview
            </span>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-50/60 via-teal-50/20 to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              {/* Dynamic Logo in Preview */}
              <div className="mb-4">
                {heroForm.logoUrl ? (
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 flex items-center justify-center shadow-md overflow-hidden">
                    <img
                      src={heroForm.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <span className="font-nepali text-2xl font-bold">ने</span>
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {heroForm.title || 'Font Converter'}
              </h2>
              <p className="mt-3 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                {heroForm.subtitle}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                {heroForm.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-700 dark:text-slate-200">
                <span>{heroForm.badgePrefix}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {heroForm.companyName}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ABOUT US EDITOR ================= */}
      {activeTab === 'about' && (
        <div className="max-w-3xl p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Edit About Us Content
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Customize the About Us hero mission, company descriptions, and key metrics.
          </p>

          <form onSubmit={handleSaveAbout} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={aboutForm.pageTitle}
                onChange={(e) => setAboutForm({ ...aboutForm, pageTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Page Subtitle
              </label>
              <input
                type="text"
                value={aboutForm.pageSubtitle}
                onChange={(e) => setAboutForm({ ...aboutForm, pageSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Mission Heading
              </label>
              <input
                type="text"
                value={aboutForm.missionTitle}
                onChange={(e) => setAboutForm({ ...aboutForm, missionTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Mission Description
              </label>
              <textarea
                rows={4}
                value={aboutForm.missionDescription}
                onChange={(e) => setAboutForm({ ...aboutForm, missionDescription: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Metric 1 Value
                </label>
                <input
                  type="text"
                  value={aboutForm.stat1Value}
                  onChange={(e) => setAboutForm({ ...aboutForm, stat1Value: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Metric 2 Value
                </label>
                <input
                  type="text"
                  value={aboutForm.stat2Value}
                  onChange={(e) => setAboutForm({ ...aboutForm, stat2Value: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Metric 3 Value
                </label>
                <input
                  type="text"
                  value={aboutForm.stat3Value}
                  onChange={(e) => setAboutForm({ ...aboutForm, stat3Value: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Save About Us Content
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 5: CONTACT & MESSAGES ================= */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          {/* Contact Information Settings */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Contact Us Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Update the support email address, office address, and disclaimer note.
            </p>

            <form onSubmit={handleSaveContact} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Physical Office Location
                </label>
                <input
                  type="text"
                  value={contactForm.location}
                  onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Information / Notice Note
                </label>
                <textarea
                  rows={3}
                  value={contactForm.noticeText}
                  onChange={(e) => setContactForm({ ...contactForm, noticeText: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Save Contact Info
              </button>
            </form>
          </div>

          {/* User Messages Inbox */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span>Incoming User Messages & Feedback</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Messages submitted by website visitors through the Contact Us form.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No user messages received yet. Messages submitted via Contact Us will appear here!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition-all ${
                      m.read
                        ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                        : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {m.name}
                          </span>
                          <span className="text-xs text-slate-400">({m.email})</span>
                          {!m.read && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-600 text-white">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                          {m.subject || 'No Subject'}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{m.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 mb-3 whitespace-pre-wrap">
                      {m.message}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                        className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply to {m.email}
                      </a>

                      <div className="flex items-center gap-2">
                        {!m.read && (
                          <button
                            onClick={() => markMessageRead(m.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this message?')) {
                              deleteMessage(m.id);
                            }
                          }}
                          className="px-2 py-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 6: SECURITY & SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-4xl">
          {/* Header banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">Admin Account & Security Settings</h2>
                <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                  Manage your credentials, change your login password, and secure your admin dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2 border border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Info Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Account Details
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Username</label>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {credentials?.username || 'admin'}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Registered Email</label>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300 break-all">
                      {credentials?.email || 'dbsthakuree123@gmail.com'}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Access Role</label>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Full Administrator
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      You can log in from the login page using either your username <span className="font-semibold text-slate-700 dark:text-slate-300">({credentials?.username || 'admin'})</span> or your email address in a single step.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <Lock className="w-3.5 h-3.5" />
                  Security Notice
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                  When you update your password here, it saves securely to this device immediately. Keep your new password remembered or written in a safe place.
                </p>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="md:col-span-2">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Admin Password</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update your password to prevent unauthorized access to the admin dashboard.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showCurrentPass ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Default initial password is <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono">admin123</code> (if not changed yet).
                    </span>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        required
                        minLength={4}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showNewPass ? 'Hide password' : 'Show password'}
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        minLength={4}
                        className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all font-mono ${
                          confirmPassword && newPassword !== confirmPassword
                            ? 'border-rose-400 focus:ring-rose-500'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showConfirmPass ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <span className="text-[11px] text-rose-500 font-medium mt-1 block">
                        Passwords do not match.
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={passwordChangeLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      {passwordChangeLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
