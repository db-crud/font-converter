import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, User, ArrowLeft, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';
import { SiteLogo } from '../components/SiteLogo';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, lockoutSecondsRemaining } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isLockedOut = lockoutSecondsRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      showToast('Login successful! Welcome to Admin Panel.', 'success');
      navigate('/admin');
    } else {
      setErrorMessage(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Top Logo & Admin Panel Badge */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-2 focus:outline-none">
            <SiteLogo className="w-12 h-12 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
                Font Converter
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Preeti ↔ Unicode
              </span>
            </div>
          </Link>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-lg inline-block">
              Admin Panel
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Enter your authorized credentials to manage fonts and website content
          </p>
        </div>

        {/* Security Lockout Alert Banner */}
        {isLockedOut && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Security Lockout Active</p>
              <p className="text-rose-700 dark:text-rose-300">
                Too many failed login attempts detected. Login is locked to protect your account.
              </p>
              <div className="font-mono font-bold text-rose-800 dark:text-rose-200 text-sm mt-1">
                Unlocked in: {lockoutSecondsRemaining}s
              </div>
            </div>
          </div>
        )}

        {/* Error Feedback Message */}
        {!isLockedOut && errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter username or email"
                disabled={isLockedOut || loading}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                disabled={isLockedOut || loading}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLockedOut || loading}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button with exact 'Login' label */}
          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full py-2.5 px-4 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : isLockedOut ? 'Locked Out' : 'Login'}
          </button>
        </form>

        {/* Security Assurance Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Protected with bcrypt hashing & brute-force rate limiting</span>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Font Converter</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
