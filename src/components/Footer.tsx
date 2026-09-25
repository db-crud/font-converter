import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm">
                <span className="font-nepali text-lg font-bold">ने</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                Font Converter
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
              Easy Nepali text conversion between Preeti and Unicode. Fast, accurate, and completely client-side for total privacy.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Private (Client-Side)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Real-time Instant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/preeti-to-unicode" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Preeti to Unicode
                </Link>
              </li>
              <li>
                <Link to="/unicode-to-preeti" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Unicode to Preeti
                </Link>
              </li>
              <li>
                <Link to="/type-in-nepali" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Type in Nepali
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about-us" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Font Converter. Built by Motherland IT Tech Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Proudly built in Nepal 🇳🇵 with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
