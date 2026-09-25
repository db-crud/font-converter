import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown, Download, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings, type FontItem } from '../context/SiteSettingsContext';
import { useToast } from '../context/ToastContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { fonts, recordFontDownload, isAdminAuthenticated } = useSiteSettings();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Preeti to Unicode', path: '/preeti-to-unicode' },
    { name: 'Unicode to Preeti', path: '/unicode-to-preeti' },
    { name: 'Type in Nepali', path: '/type-in-nepali' },
    { name: 'Download', path: '/downloads', hasDropdown: true },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDownloadDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDirectFontDownload = (e: React.MouseEvent, font: FontItem) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadDropdownOpen(false);
    recordFontDownload(font.id);
    showToast(`Downloading ${font.name}...`, 'success');

    const link = document.createElement('a');
    link.href = font.fileUrl;
    link.download = font.filename || `${font.name.replace(/\s+/g, '_')}.ttf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo / Left */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-nepali text-xl font-bold">ने</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
                Font Converter
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Preeti ↔ Unicode
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setDownloadDropdownOpen(true)}
                    onMouseLeave={() => setDownloadDropdownOpen(false)}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setDownloadDropdownOpen(false)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive || downloadDropdownOpen
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          downloadDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                    </NavLink>

                    {/* Font Options Dropdown Menu */}
                    {downloadDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                          Click to Download Font File
                        </div>

                        {fonts.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={(e) => handleDirectFontDownload(e, f)}
                            className="w-full text-left px-3.5 py-2 hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                {f.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {f.category} • {f.fileSize}
                              </div>
                            </div>
                            <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          </button>
                        ))}

                        <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5 px-2">
                          <Link
                            to="/downloads"
                            onClick={() => setDownloadDropdownOpen(false)}
                            className="block px-2 py-1.5 text-xs font-semibold text-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                          >
                            View All Fonts & Previews →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions: Theme toggle, Admin Link & Mobile menu button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Admin Panel Quick Link */}
            <Link
              to="/admin"
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors ${
                isAdminAuthenticated ? 'text-emerald-600 dark:text-emerald-400' : ''
              }`}
              title="Admin Panel & Font Manager"
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
