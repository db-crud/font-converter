import React from 'react';
import {
  Globe,
  FileText,
  ShieldCheck,
  Layers,
  CheckCircle,
  Building,
  GraduationCap,
  Briefcase,
  Database
} from 'lucide-react';


export const AboutUs: React.FC = () => {
  const useCases = [
    {
      title: 'Old Documents & Archives',
      desc: 'Modernize decades of typed Nepali archives stored in legacy formats into readable digital files.',
      icon: FileText,
    },
    {
      title: 'School & College Records',
      desc: 'Convert student transcripts, exam papers, marksheets, and administrative notices into Unicode.',
      icon: GraduationCap,
    },
    {
      title: 'Office & Business Documents',
      desc: 'Migrate corporate memos, minutes, contracts, and proposals into modern searchable documents.',
      icon: Briefcase,
    },
    {
      title: 'Government Documents',
      desc: 'Seamlessly transition official gazettes, citizenship documents, and local administration reports.',
      icon: Building,
    },
    {
      title: 'Websites & Online Media',
      desc: 'Publish Nepali news articles, blog posts, and website content that renders on all mobile devices.',
      icon: Globe,
    },
    {
      title: 'Database Migration',
      desc: 'Clean up legacy SQL databases storing ASCII Preeti strings to native UTF-8 Devanagari text.',
      icon: Database,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          About Us
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nepali Converter is a high-precision, online utility designed to make Nepali text conversion fast, reliable, and accessible to everyone.
        </p>
      </div>

      {/* Core Mission Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg mb-12 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-4">
            Preserving & Modernizing Nepali Typography
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-6">
            Nepal’s digital heritage contains millions of documents written in legacy font encodings like Preeti, Kantipur, and Sagarmatha. Our mission is to bridge the gap between historic typography and modern digital systems with zero friction and absolute privacy.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-400/30 text-xs sm:text-sm">
            <div>
              <div className="font-extrabold text-xl sm:text-2xl text-white">100%</div>
              <div className="text-blue-200">Client-Side Logic</div>
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl text-white">0 ms</div>
              <div className="text-blue-200">Server Latency</div>
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl text-white">Free</div>
              <div className="text-blue-200">Forever For Everyone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unicode vs Preeti Detailed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Unicode Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            What is Unicode?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Unicode is the modern universal text standard adopted by the international computing consortium. It assigns a unique code point to every single character across the world’s languages.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Native on iPhone, Android, Windows, Mac & Linux</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Searchable in Google, databases, and word processors</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Requires no font downloads or external software</span>
            </li>
          </ul>
        </div>

        {/* Preeti Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            What is Preeti?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Preeti is a traditional Nepali legacy font designed in Nepal during the early desktop publishing era. It mapped English ASCII keys to Devanagari shapes.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Extensively used in printing presses and government files</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Standard keyboard muscle memory for millions of typists</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Requires custom font files installed to view correctly</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Why Use This Converter? */}
      <div className="mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
            Why Use This Converter?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Engineered to handle common professional and institutional use cases accurately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
            Absolute Client-Side Privacy Guarantee
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
            Your text is processed entirely within your device’s browser memory using JavaScript. We never transmit, store, or log any text you type or paste. You can even use this web application completely offline!
          </p>
        </div>
      </div>
    </div>
  );
};
