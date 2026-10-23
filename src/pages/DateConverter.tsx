import React, { useState, useMemo } from 'react';
import NepaliDate from 'nepali-date-converter';
import {
  Calendar as CalendarIcon,
  ArrowLeftRight,
  Cake,
  Copy,
  Check,
  RotateCcw,
  CalendarDays,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Nepali Months
const BS_MONTHS = [
  { en: 'Baisakh', np: 'बैशाख' },
  { en: 'Jestha', np: 'जेठ' },
  { en: 'Asar', np: 'असार' },
  { en: 'Shrawan', np: 'साउन' },
  { en: 'Bhadra', np: 'भदौ' },
  { en: 'Aswin', np: 'असोज' },
  { en: 'Kartik', np: 'कार्तिक' },
  { en: 'Mangsir', np: 'मंसिर' },
  { en: 'Poush', np: 'पुस' },
  { en: 'Magh', np: 'माघ' },
  { en: 'Falgun', np: 'फागुन' },
  { en: 'Chaitra', np: 'चैत' },
];

// Gregorian Months
const AD_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAYS_NP = [
  'आइतवार',
  'सोमवार',
  'मङ्गलवार',
  'बुधवार',
  'बिहीवार',
  'शुक्रवार',
  'शनिवार',
];

// Safe helper to get days in a BS month
const getDaysInBsMonth = (year: number, monthIndex: number): number => {
  for (let d = 32; d >= 29; d--) {
    try {
      const nd = new NepaliDate(year, monthIndex, d);
      if (nd.getMonth() === monthIndex) {
        return d;
      }
    } catch {
      // ignore
    }
  }
  return 30;
};

// Safe helper to get days in an AD month
const getDaysInAdMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const BS_YEAR_OPTIONS = Array.from({ length: 91 }, (_, i) => 2000 + i);
const AD_YEAR_OPTIONS = Array.from({ length: 90 }, (_, i) => 1944 + i);

export const DateConverter: React.FC = () => {
  const { showToast } = useToast();

  // Main Tab: 'convert' | 'difference' | 'age'
  const [activeTab, setActiveTab] = useState<'convert' | 'difference' | 'age'>('convert');

  // ================= CONVERTER TAB STATE =================
  // Mode: 'BS' (convert from BS to AD) | 'AD' (convert from AD to BS)
  const [convertMode, setConvertMode] = useState<'BS' | 'AD'>('BS');

  // Current Initial Date
  const initialNepali = useMemo(() => new NepaliDate(), []);
  const initialAd = useMemo(() => initialNepali.toJsDate(), [initialNepali]);

  // BS Selected Date
  const [bsYear, setBsYear] = useState<number>(initialNepali.getYear());
  const [bsMonth, setBsMonth] = useState<number>(initialNepali.getMonth());
  const [bsDate, setBsDate] = useState<number>(initialNepali.getDate());

  // AD Selected Date
  const [adYear, setAdYear] = useState<number>(initialAd.getFullYear());
  const [adMonth, setAdMonth] = useState<number>(initialAd.getMonth());
  const [adDate, setAdDate] = useState<number>(initialAd.getDate());

  const [copiedBs, setCopiedBs] = useState(false);
  const [copiedAd, setCopiedAd] = useState(false);

  // Computed Conversion Results
  const conversionResult = useMemo(() => {
    try {
      if (convertMode === 'BS') {
        const nd = new NepaliDate(bsYear, bsMonth, bsDate);
        const jsDate = nd.toJsDate();
        const bsObj = nd.getBS();
        const dayIdx = jsDate.getDay();

        return {
          bsFormatted: `${BS_MONTHS[bsObj.month].en} ${bsObj.date}, ${bsObj.year}`,
          bsDay: DAYS_EN[dayIdx],
          bsDayNp: DAYS_NP[dayIdx],

          adFormatted: `${AD_MONTHS[jsDate.getMonth()]} ${jsDate.getDate()}, ${jsDate.getFullYear()}`,
          adDay: DAYS_EN[dayIdx],
        };
      } else {
        const jsDate = new Date(adYear, adMonth, adDate);
        const nd = new NepaliDate(jsDate);
        const bsObj = nd.getBS();
        const dayIdx = jsDate.getDay();

        return {
          bsFormatted: `${BS_MONTHS[bsObj.month].en} ${bsObj.date}, ${bsObj.year}`,
          bsDay: DAYS_EN[dayIdx],
          bsDayNp: DAYS_NP[dayIdx],

          adFormatted: `${AD_MONTHS[adMonth]} ${adDate}, ${adYear}`,
          adDay: DAYS_EN[dayIdx],
        };
      }
    } catch {
      return {
        bsFormatted: 'Invalid Date',
        bsDay: '',
        bsDayNp: '',
        adFormatted: 'Invalid Date',
        adDay: '',
      };
    }
  }, [convertMode, bsYear, bsMonth, bsDate, adYear, adMonth, adDate]);

  // Set today
  const handleSetToday = () => {
    const nowNd = new NepaliDate();
    const nowAd = nowNd.toJsDate();

    setBsYear(nowNd.getYear());
    setBsMonth(nowNd.getMonth());
    setBsDate(nowNd.getDate());

    setAdYear(nowAd.getFullYear());
    setAdMonth(nowAd.getMonth());
    setAdDate(nowAd.getDate());

    showToast('Reset to today’s date!', 'info');
  };

  const handleCopyBs = () => {
    navigator.clipboard.writeText(conversionResult.bsFormatted);
    setCopiedBs(true);
    showToast('Bikram Sambat date copied to clipboard!', 'success');
    setTimeout(() => setCopiedBs(false), 2000);
  };

  const handleCopyAd = () => {
    navigator.clipboard.writeText(conversionResult.adFormatted);
    setCopiedAd(true);
    showToast('Gregorian AD date copied to clipboard!', 'success');
    setTimeout(() => setCopiedAd(false), 2000);
  };

  // Max days in current selection
  const maxBsDays = useMemo(() => getDaysInBsMonth(bsYear, bsMonth), [bsYear, bsMonth]);
  const maxAdDays = useMemo(() => getDaysInAdMonth(adYear, adMonth), [adYear, adMonth]);

  // ================= DIFFERENCE TAB STATE =================
  const [diffFromMode, setDiffFromMode] = useState<'BS' | 'AD'>('BS');
  const [diffFromYear, setDiffFromYear] = useState(2080);
  const [diffFromMonth, setDiffFromMonth] = useState(0);
  const [diffFromDate, setDiffFromDate] = useState(1);

  const [diffToMode, setDiffToMode] = useState<'BS' | 'AD'>('BS');
  const [diffToYear, setDiffToYear] = useState(initialNepali.getYear());
  const [diffToMonth, setDiffToMonth] = useState(initialNepali.getMonth());
  const [diffToDate, setDiffToDate] = useState(initialNepali.getDate());

  const differenceResult = useMemo(() => {
    try {
      const fromDateObj =
        diffFromMode === 'BS'
          ? new NepaliDate(diffFromYear, diffFromMonth, diffFromDate).toJsDate()
          : new Date(diffFromYear, diffFromMonth, diffFromDate);

      const toDateObj =
        diffToMode === 'BS'
          ? new NepaliDate(diffToYear, diffToMonth, diffToDate).toJsDate()
          : new Date(diffToYear, diffToMonth, diffToDate);

      const diffMs = Math.abs(toDateObj.getTime() - fromDateObj.getTime());
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const remainingDays = Math.floor(totalDays % 365.25);
      const months = Math.floor(remainingDays / 30.44);
      const days = Math.floor(remainingDays % 30.44);

      return {
        totalDays,
        years,
        months,
        days,
        isLater: toDateObj >= fromDateObj,
      };
    } catch {
      return null;
    }
  }, [diffFromMode, diffFromYear, diffFromMonth, diffFromDate, diffToMode, diffToYear, diffToMonth, diffToDate]);

  // ================= AGE CALCULATOR STATE =================
  const [birthMode, setBirthMode] = useState<'BS' | 'AD'>('BS');
  const [birthYear, setBirthYear] = useState(2058);
  const [birthMonth, setBirthMonth] = useState(6); // Kartik
  const [birthDate, setBirthDate] = useState(15);

  const ageResult = useMemo(() => {
    try {
      const birthJs =
        birthMode === 'BS'
          ? new NepaliDate(birthYear, birthMonth, birthDate).toJsDate()
          : new Date(birthYear, birthMonth, birthDate);

      const today = new Date();
      const diffMs = today.getTime() - birthJs.getTime();
      if (diffMs < 0) return null;

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const remAfterYears = totalDays % 365.25;
      const months = Math.floor(remAfterYears / 30.44);
      const days = Math.floor(remAfterYears % 30.44);

      const birthDayOfWeek = DAYS_EN[birthJs.getDay()];
      const birthDayOfWeekNp = DAYS_NP[birthJs.getDay()];

      // Next Birthday Calculation
      const currentYear = today.getFullYear();
      let nextBday = new Date(currentYear, birthJs.getMonth(), birthJs.getDate());
      if (nextBday < today) {
        nextBday = new Date(currentYear + 1, birthJs.getMonth(), birthJs.getDate());
      }
      const daysUntilNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        years,
        months,
        days,
        totalDays,
        birthDayOfWeek,
        birthDayOfWeekNp,
        daysUntilNextBday,
      };
    } catch {
      return null;
    }
  }, [birthMode, birthYear, birthMonth, birthDate]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      {/* Expanded Container Width: max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header (Right side language button removed per request) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
              Nepali Date Converter
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span>Instantly convert between Bikram Sambat and Gregorian (AD) dates.</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                <CalendarDays className="w-3 h-3" />
                <span>B.S. ↔ A.D.</span>
              </span>
            </p>
          </div>
        </div>

        {/* Top Feature Navigation Tabs (Themed in Green/Emerald) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              activeTab === 'convert'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Convert</span>
          </button>

          <button
            onClick={() => setActiveTab('difference')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              activeTab === 'difference'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Difference</span>
          </button>

          <button
            onClick={() => setActiveTab('age')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              activeTab === 'age'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>Age</span>
          </button>
        </div>

        {/* ================= TAB 1: DATE CONVERTER ================= */}
        {activeTab === 'convert' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header row: Date label + BS/AD switch */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Date ({convertMode === 'BS' ? 'Bikram Sambat' : 'Gregorian AD'})
              </span>

              {/* BS / AD Toggle Pill (Green Theme) */}
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setConvertMode('BS')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    convertMode === 'BS'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  BS
                </button>
                <button
                  type="button"
                  onClick={() => setConvertMode('AD')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    convertMode === 'AD'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  AD
                </button>
              </div>
            </div>

            {/* Dropdown Inputs Row with Clean Indicators */}
            {convertMode === 'BS' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 items-center">
                {/* BS Year Dropdown */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Year (वर्ष)
                  </label>
                  <select
                    value={bsYear}
                    onChange={(e) => setBsYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {BS_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BS Month Dropdown */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Month (महिना)
                  </label>
                  <select
                    value={bsMonth}
                    onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {BS_MONTHS.map((m, idx) => (
                      <option key={m.en} value={idx}>
                        {m.en} ({m.np})
                      </option>
                    ))}
                  </select>
                </div>

                {/* BS Day Dropdown */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Day (गते)
                  </label>
                  <select
                    value={bsDate > maxBsDays ? maxBsDays : bsDate}
                    onChange={(e) => setBsDate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {Array.from({ length: maxBsDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 items-center">
                {/* AD Year Dropdown */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Year
                  </label>
                  <select
                    value={adYear}
                    onChange={(e) => setAdYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {AD_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AD Month Dropdown */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Month
                  </label>
                  <select
                    value={adMonth}
                    onChange={(e) => setAdMonth(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {AD_MONTHS.map((m, idx) => (
                      <option key={m} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AD Day Dropdown */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Day
                  </label>
                  <select
                    value={adDate > maxAdDays ? maxAdDays : adDate}
                    onChange={(e) => setAdDate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                  >
                    {Array.from({ length: maxAdDays }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Quick Actions (Today Button) */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleSetToday}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Today (आजको मिति)</span>
              </button>
            </div>

            {/* Conversion Result Cards (Emerald / Green Theme) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Left Card: Bikram Sambat */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-800/40 relative group transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300 uppercase tracking-wider">
                    Bikram Sambat
                  </span>
                  <button
                    onClick={handleCopyBs}
                    className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                    title="Copy Bikram Sambat date"
                  >
                    {copiedBs ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  {conversionResult.bsFormatted}
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {conversionResult.bsDay} ({conversionResult.bsDayNp})
                </div>
              </div>

              {/* Right Card: Gregorian (AD) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-800/40 relative group transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300 uppercase tracking-wider">
                    Gregorian (AD)
                  </span>
                  <button
                    onClick={handleCopyAd}
                    className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                    title="Copy Gregorian AD date"
                  >
                    {copiedAd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  {conversionResult.adFormatted}
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  {conversionResult.adDay}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DATE DIFFERENCE ================= */}
        {activeTab === 'difference' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <span>Calculate Duration Between Two Dates</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date (Dropdowns) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">From Date</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 text-[11px] font-bold">
                    <button
                      onClick={() => setDiffFromMode('BS')}
                      className={`px-2 py-0.5 rounded transition-all ${diffFromMode === 'BS' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      BS
                    </button>
                    <button
                      onClick={() => setDiffFromMode('AD')}
                      className={`px-2 py-0.5 rounded transition-all ${diffFromMode === 'AD' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      AD
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* From Year Dropdown */}
                  <select
                    value={diffFromYear}
                    onChange={(e) => setDiffFromYear(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {(diffFromMode === 'BS' ? BS_YEAR_OPTIONS : AD_YEAR_OPTIONS).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  {/* From Month Dropdown */}
                  <select
                    value={diffFromMonth}
                    onChange={(e) => setDiffFromMonth(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {(diffFromMode === 'BS' ? BS_MONTHS.map((m) => m.en) : AD_MONTHS).map((m, idx) => (
                      <option key={m} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* From Day Dropdown */}
                  <select
                    value={diffFromDate}
                    onChange={(e) => setDiffFromDate(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {Array.from(
                      {
                        length:
                          diffFromMode === 'BS'
                            ? getDaysInBsMonth(diffFromYear, diffFromMonth)
                            : getDaysInAdMonth(diffFromYear, diffFromMonth),
                      },
                      (_, i) => i + 1
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date (Dropdowns) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">To Date</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 text-[11px] font-bold">
                    <button
                      onClick={() => setDiffToMode('BS')}
                      className={`px-2 py-0.5 rounded transition-all ${diffToMode === 'BS' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      BS
                    </button>
                    <button
                      onClick={() => setDiffToMode('AD')}
                      className={`px-2 py-0.5 rounded transition-all ${diffToMode === 'AD' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      AD
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* To Year Dropdown */}
                  <select
                    value={diffToYear}
                    onChange={(e) => setDiffToYear(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {(diffToMode === 'BS' ? BS_YEAR_OPTIONS : AD_YEAR_OPTIONS).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  {/* To Month Dropdown */}
                  <select
                    value={diffToMonth}
                    onChange={(e) => setDiffToMonth(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {(diffToMode === 'BS' ? BS_MONTHS.map((m) => m.en) : AD_MONTHS).map((m, idx) => (
                      <option key={m} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* To Day Dropdown */}
                  <select
                    value={diffToDate}
                    onChange={(e) => setDiffToDate(parseInt(e.target.value, 10))}
                    className="px-2.5 py-2 rounded-xl border text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {Array.from(
                      {
                        length:
                          diffToMode === 'BS'
                            ? getDaysInBsMonth(diffToYear, diffToMonth)
                            : getDaysInAdMonth(diffToYear, diffToMonth),
                      },
                      (_, i) => i + 1
                    ).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Difference Result Display (Green Theme) */}
            {differenceResult && (
              <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Exact Duration Difference
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  {differenceResult.years} Years, {differenceResult.months} Months, {differenceResult.days} Days
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Total of <span className="font-bold text-slate-900 dark:text-white">{differenceResult.totalDays.toLocaleString()}</span> days elapsed between the selected dates.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: AGE CALCULATOR ================= */}
        {activeTab === 'age' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cake className="w-4 h-4 text-emerald-600" />
              <span>Age Calculator (उमेर गणना)</span>
            </h2>

            {/* Birth Date Picker (Dropdowns for Year, Month, Day) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Date of Birth (जन्म मिति)
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 text-[11px] font-bold">
                  <button
                    onClick={() => setBirthMode('BS')}
                    className={`px-3 py-0.5 rounded transition-all ${birthMode === 'BS' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    BS
                  </button>
                  <button
                    onClick={() => setBirthMode('AD')}
                    className={`px-3 py-0.5 rounded transition-all ${birthMode === 'AD' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    AD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Year Dropdown */}
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
                  className="px-3 py-2.5 rounded-xl border text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {(birthMode === 'BS' ? BS_YEAR_OPTIONS : AD_YEAR_OPTIONS).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                {/* Month Dropdown */}
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(parseInt(e.target.value, 10))}
                  className="px-3 py-2.5 rounded-xl border text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {(birthMode === 'BS' ? BS_MONTHS.map((m) => m.en) : AD_MONTHS).map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* Day Dropdown */}
                <select
                  value={birthDate}
                  onChange={(e) => setBirthDate(parseInt(e.target.value, 10))}
                  className="px-3 py-2.5 rounded-xl border text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {Array.from(
                    {
                      length:
                        birthMode === 'BS'
                          ? getDaysInBsMonth(birthYear, birthMonth)
                          : getDaysInAdMonth(birthYear, birthMonth),
                    },
                    (_, i) => i + 1
                  ).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age Result (Green Theme) */}
            {ageResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Current Age
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading mt-1">
                    {ageResult.years} Years
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {ageResult.months} months, {ageResult.days} days
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Days Lived
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading mt-1">
                    {ageResult.totalDays.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Born on {ageResult.birthDayOfWeek} ({ageResult.birthDayOfWeekNp})
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Next Birthday In
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading mt-1">
                    {ageResult.daysUntilNextBday} Days
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Celebration countdown
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                Please enter a valid birth date that occurs before today.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
