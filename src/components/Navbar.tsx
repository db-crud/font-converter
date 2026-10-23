import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SiteLogo } from './SiteLogo';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Hide the main navbar when in the Admin Panel
  if (location.pathname === '/admin') {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Preeti to Unicode', path: '/preeti-to-unicode' },
    { name: 'Unicode to Preeti', path: '/unicode-to-preeti' },
    { name: 'Hamro Patro', path: '/hamro-patro' },
    { name: 'Date Converter', path: '/date-converter' },
    { name: 'Download Fonts', path: '/downloads' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-emerald-700 dark:bg-emerald-800 shadow-md border-b border-emerald-800 dark:border-emerald-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo / Left */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1"
          >
            <SiteLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-heading leading-tight">
                Font Converter
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                Preeti ↔ Unicode
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-900/60 dark:bg-emerald-950/80 text-white font-bold shadow-xs border border-emerald-500/40'
                      : 'text-white/85 hover:text-white hover:bg-emerald-600/70 dark:hover:bg-emerald-700/70 font-medium'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions: Theme toggle only & Mobile menu button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="p-2 rounded-xl text-white hover:bg-emerald-600/70 dark:hover:bg-emerald-700/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-emerald-100 hover:text-white transition-transform hover:-rotate-12" />
              ) : (
                <Sun className="w-5 h-5 text-amber-300 hover:text-amber-200 transition-transform hover:rotate-45" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-emerald-600/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
        <div className="lg:hidden bg-emerald-800 dark:bg-emerald-900 border-t border-emerald-600/60 shadow-xl px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-3 py-2.5 rounded-lg text-base transition-colors ${
                  isActive
                    ? 'bg-emerald-950/80 text-white font-bold border border-emerald-600/40'
                    : 'text-white/90 hover:bg-emerald-700 dark:hover:bg-emerald-800 hover:text-white font-medium'
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
