import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PreetiToUnicode } from './pages/PreetiToUnicode';
import { UnicodeToPreeti } from './pages/UnicodeToPreeti';
import { TypeInNepali } from './pages/TypeInNepali';
import { Downloads } from './pages/Downloads';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Admin } from './pages/Admin';

// Scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SiteSettingsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
              <Navbar />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/preeti-to-unicode" element={<PreetiToUnicode />} />
                  <Route path="/unicode-to-preeti" element={<UnicodeToPreeti />} />
                  <Route path="/type-in-nepali" element={<TypeInNepali />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/download" element={<Downloads />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* Fallback to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </SiteSettingsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
