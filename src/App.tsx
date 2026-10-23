import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import { HamroPatro } from './pages/HamroPatro';
import { DateConverter } from './pages/DateConverter';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Admin } from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <SiteSettingsProvider>
            <BrowserRouter>
              <Navbar />
              <main className="flex-1 min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/preeti-to-unicode" element={<PreetiToUnicode />} />
                  <Route path="/unicode-to-preeti" element={<UnicodeToPreeti />} />
                  <Route path="/type-in-nepali" element={<TypeInNepali />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/hamro-patro" element={<HamroPatro />} />
                  <Route path="/date-converter" element={<DateConverter />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </BrowserRouter>
          </SiteSettingsProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
export default App;
