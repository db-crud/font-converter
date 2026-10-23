import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ExternalLink, Clock, Sparkles, ShieldCheck, Sun } from 'lucide-react';

export const HamroPatro: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateEn, setCurrentDateEn] = useState<string>('');

  const [widgetHeight, setWidgetHeight] = useState<number>(425);

  useEffect(() => {
    const handleWidgetMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === 'hp-widget-size' &&
        typeof event.data.height === 'number' &&
        event.data.height > 200
      ) {
        setWidgetHeight(Math.min(Math.max(event.data.height + 25, 410), 460));
      }
    };
    window.addEventListener('message', handleWidgetMessage);
    return () => window.removeEventListener('message', handleWidgetMessage);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kathmandu',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateEn(
        now.toLocaleDateString('en-US', {
          timeZone: 'Asia/Kathmandu',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>नेपाली क्यालेन्डर तथा पञ्चाङ्ग</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            हाम्रो पात्रो (Hamro Patro)
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            नेपाली मिति, तिथि, चाडपर्व, बिदाहरू तथा पञ्चाङ्गको प्रत्यक्ष विवरण।
          </p>
        </div>

        {/* Real-time Status Card & Direct Link */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>नेपाल समय (NPT)</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {currentTime || 'Loading...'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {currentDateEn}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://www.hamropatro.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all group"
            >
              <span>हाम्रो पात्रो वेबसाइट खोल्नुहोस्</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Main Calendar Widget Container - Broadened width & fitted height */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                लाइभ नेपाली पात्रो (Live Calendar Widget)
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Powered by Hamro Patro
            </span>
          </div>

          {/* Iframe Widget Wrapper with expanded width and snug vertical height */}
          <div className="w-full flex justify-center py-1">
            <div className="w-full max-w-3xl flex justify-center bg-white rounded-2xl p-2 sm:p-3 shadow-xs border border-slate-200/90">
              <iframe
                title="Hamro Patro Nepali Calendar"
                src="https://www.hamropatro.com/widgets/calendar-modern.php"
                frameBorder="0"
                scrolling="no"
                marginWidth={0}
                marginHeight={0}
                style={{
                  border: 'none',
                  overflow: 'hidden',
                  width: '100%',
                  height: `${widgetHeight}px`,
                  borderRadius: '12px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Features / Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-3">
              वि.सं.
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              विक्रम संवत् (B.S.)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              नेपालको आधिकारिक क्यालेन्डर अनुसार सम्पूर्ण महिना, गते र बारहरूको जानकारी।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base mb-3">
              तिथि
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              दैनिक तिथि तथा पञ्चाङ्ग
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              एकादशी, पूर्णिमा, औंसी, व्रत तथा सूर्योदय र सूर्यास्त सम्बन्धी पञ्चाङ्ग विवरण।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-base mb-3">
              पर्व
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              चाडपर्व तथा बिदाहरू
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              दशैं, तिहार, छठ लगायत नेपालका सम्पूर्ण राष्ट्रिय तथा सांस्कृतिक चाडपर्वको सूची।
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            पात्रोको डाटा र सेवा हाम्रो पात्रो (Hamro Patro) को आधिकारिक विजेटद्वारा प्रदान गरिएको हो।
          </span>
        </div>
      </div>
    </div>
  );
};
