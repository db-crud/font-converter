import React, { useState } from 'react';
import { useSiteSettings, type FontItem } from '../context/SiteSettingsContext';
import { useToast } from '../context/ToastContext';
import {
  Lock,
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
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const {
    hero,
    about,
    contact,
    fonts,
    messages,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateHero,
    updateAbout,
    updateContact,
    addFont,
    deleteFont,
    updateFont,
    markMessageRead,
    deleteMessage,
    resetAllSettings,
  } = useSiteSettings();

  const { showToast } = useToast();

  // Auth state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard active tab: 'overview' | 'fonts' | 'home' | 'about' | 'contact'
  const [activeTab, setActiveTab] = useState<'overview' | 'fonts' | 'home' | 'about' | 'contact'>('overview');

  // Form states for Home Editor
  const [heroForm, setHeroForm] = useState(hero);

  // Form states for About Editor
  const [aboutForm, setAboutForm] = useState(about);

  // Form states for Contact Editor
  const [contactForm, setContactForm] = useState(contact);

  // Font Upload Modal / Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFontName, setNewFontName] = useState('');
  const [newFontCategory, setNewFontCategory] = useState<'Traditional' | 'Unicode' | 'Romanized' | 'Other'>('Traditional');
  const [newFontDesc, setNewFontDesc] = useState('');
  const [newFontFile, setNewFontFile] = useState<File | null>(null);

  // Font Editing Modal
  const [editingFont, setEditingFont] = useState<FontItem | null>(null);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passwordInput)) {
      setAuthError('');
      showToast('Admin login successful!', 'success');
    } else {
      setAuthError('Incorrect password. Please use default PIN: admin123');
      showToast('Invalid admin credentials', 'error');
    }
  };

  // Handle Home Save
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showToast('Home page content updated successfully!', 'success');
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

  // Handle Font File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFontFile(file);
      if (!newFontName) {
        // Auto fill font name from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewFontName(cleanName);
      }
    }
  };

  // Handle Font Upload / Submit
  const handleAddFontSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFontName) {
      showToast('Please provide a font name', 'error');
      return;
    }

    if (!newFontFile) {
      showToast('Please select a font file (.ttf, .otf, .woff)', 'error');
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
      setShowUploadModal(false);
    };

    reader.readAsDataURL(newFontFile);
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

  // ================= LOGIN SCREEN =================
  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20 mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Font Converter Dashboard & Content Manager
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pin" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Password / PIN
              </label>
              <input
                id="admin-pin"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                autoFocus
              />
              {authError && <p className="mt-1.5 text-xs text-rose-500 font-medium">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Helper hint */}
          <div className="mt-6 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> Default Admin Password:
            </p>
            <p className="font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 font-bold inline-block">
              admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= LOGGED IN DASHBOARD =================
  const totalDownloads = fonts.reduce((sum, f) => sum + f.downloadCount, 0);
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage fonts, customize site content in real time, and inspect incoming feedback.
          </p>
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
            onClick={logoutAdmin}
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

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Font</span>
            </button>
          </div>

          {/* Upload New Font Modal / Box */}
          {showUploadModal && (
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-850 border border-emerald-300 dark:border-emerald-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>Upload & Publish Font Package</span>
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddFontSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Font Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Font Name *
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
                      <option value="Other">Other Typeface</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Select Font File (.ttf, .otf, .woff, .zip) *
                  </label>
                  <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2,.zip"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    required
                  />
                  {newFontFile && (
                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      Selected file: {newFontFile.name} ({(newFontFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
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

            <form onSubmit={handleSaveHero} className="space-y-4">
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
                  className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  Save Home Page Content
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Home Banner Preview
            </span>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-50/60 via-teal-50/20 to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {heroForm.title || 'Font Converter'}
              </h2>
              <p className="mt-3 text-base font-semibold text-emerald-700 dark:text-emerald-400">
                {heroForm.subtitle}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
    </div>
  );
};
