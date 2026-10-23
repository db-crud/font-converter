import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import bcrypt from 'bcryptjs';

export interface AdminCredentials {
  username: string;
  email: string;
  passwordHash: string;
}

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  loginTimestamp?: number;
}

export interface LoginResult {
  success: boolean;
  message: string;
  remainingAttempts?: number;
  lockoutSeconds?: number;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  email: string | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  credentials: { username: string; email: string };
  requestPasswordReset: (email: string) => Promise<void>;
  lockoutSecondsRemaining: number;
  failedAttempts: number;
}

const STORAGE_KEY_ADMIN_CREDS = 'nc_admin_credentials';
const STORAGE_KEY_AUTH = 'auth';
const STORAGE_KEY_SETTINGS_AUTH = 'nc_admin_auth';
const STORAGE_KEY_LOCKOUT = 'nc_admin_lockout_until';
const STORAGE_KEY_FAILED = 'nc_admin_failed_count';

// 4 Hours Session Expiration
const SESSION_MAX_AGE_MS = 4 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

// Default Admin: username: "admin", email: "dbsthakuree123@gmail.com", password: "admin123"
const DEFAULT_CREDS: AdminCredentials = {
  username: 'admin',
  email: 'dbsthakuree123@gmail.com',
  passwordHash: bcrypt.hashSync('admin123', 10),
};

const getStoredCredentials = (): AdminCredentials => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_CREDS);
    if (saved) {
      return { ...DEFAULT_CREDS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse admin credentials:', e);
  }
  return DEFAULT_CREDS;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify session expiry
        if (parsed.loginTimestamp && Date.now() - parsed.loginTimestamp > SESSION_MAX_AGE_MS) {
          localStorage.removeItem(STORAGE_KEY_AUTH);
          sessionStorage.removeItem(STORAGE_KEY_SETTINGS_AUTH);
          return { isAuthenticated: false, email: null };
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return { isAuthenticated: false, email: null };
  });

  const [creds, setCreds] = useState<AdminCredentials>(getStoredCredentials);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return parseInt(sessionStorage.getItem(STORAGE_KEY_FAILED) || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      return parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT) || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState<number>(0);

  // Periodic session validity check & lockout countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Session timeout check
      if (state.isAuthenticated && state.loginTimestamp) {
        if (Date.now() - state.loginTimestamp > SESSION_MAX_AGE_MS) {
          logout();
          return;
        }
      }

      // 2. Lockout countdown check
      if (lockoutUntil > Date.now()) {
        const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
        setLockoutSecondsRemaining(secs);
      } else if (lockoutSecondsRemaining > 0) {
        setLockoutSecondsRemaining(0);
        setFailedAttempts(0);
        sessionStorage.removeItem(STORAGE_KEY_FAILED);
        sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state, lockoutUntil, lockoutSecondsRemaining]);

  useEffect(() => {
    // If not yet saved in localStorage, persist default credentials
    if (!localStorage.getItem(STORAGE_KEY_ADMIN_CREDS)) {
      localStorage.setItem(STORAGE_KEY_ADMIN_CREDS, JSON.stringify(DEFAULT_CREDS));
    }
  }, []);

  const persist = (newState: AuthState) => {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newState));
    if (newState.isAuthenticated) {
      sessionStorage.setItem(STORAGE_KEY_SETTINGS_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEY_SETTINGS_AUTH);
    }
    setState(newState);
  };

  const login = async (identifier: string, password: string): Promise<LoginResult> => {
    // Check if currently locked out
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSecs = Math.ceil((lockoutUntil - now) / 1000);
      return {
        success: false,
        message: `Too many failed login attempts. Account temporarily locked for security. Try again in ${remainingSecs} seconds.`,
        lockoutSeconds: remainingSecs,
      };
    }

    const currentCreds = getStoredCredentials();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Prevent blank submission
    if (!cleanId || !cleanPass) {
      return {
        success: false,
        message: 'Username/Email and Password are required.',
      };
    }

    const idMatches =
      cleanId === currentCreds.username.toLowerCase() ||
      cleanId === currentCreds.email.toLowerCase();

    let passMatches = false;
    if (idMatches) {
      try {
        passMatches = await bcrypt.compare(cleanPass, currentCreds.passwordHash);
      } catch {
        passMatches = false;
      }
    }

    if (idMatches && passMatches) {
      // Reset security failure counters on success
      setFailedAttempts(0);
      setLockoutUntil(0);
      setLockoutSecondsRemaining(0);
      sessionStorage.removeItem(STORAGE_KEY_FAILED);
      sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);

      const newState: AuthState = {
        isAuthenticated: true,
        email: currentCreds.email,
        loginTimestamp: Date.now(),
      };
      persist(newState);
      return { success: true, message: 'Login successful' };
    }

    // Handle failed login attempt
    const newFailCount = failedAttempts + 1;
    setFailedAttempts(newFailCount);
    sessionStorage.setItem(STORAGE_KEY_FAILED, newFailCount.toString());

    if (newFailCount >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      setLockoutUntil(lockUntil);
      sessionStorage.setItem(STORAGE_KEY_LOCKOUT, lockUntil.toString());
      setLockoutSecondsRemaining(60);

      return {
        success: false,
        message: `Maximum failed attempts reached (${MAX_FAILED_ATTEMPTS}). Login locked for 60 seconds to protect against brute-force attacks.`,
        lockoutSeconds: 60,
      };
    }

    const remaining = MAX_FAILED_ATTEMPTS - newFailCount;
    return {
      success: false,
      message: `Invalid username or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lockout.`,
      remainingAttempts: remaining,
    };
  };

  const logout = () => {
    persist({ isAuthenticated: false, email: null });
    localStorage.removeItem(STORAGE_KEY_AUTH);
    sessionStorage.removeItem(STORAGE_KEY_SETTINGS_AUTH);
  };

  const changePassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const currentCreds = getStoredCredentials();
    const cleanCurrent = currentPass.trim();
    const cleanNew = newPass.trim();

    if (!cleanCurrent || !cleanNew) {
      return { success: false, message: 'All password fields are required.' };
    }

    let validCurrent = false;
    try {
      validCurrent = await bcrypt.compare(cleanCurrent, currentCreds.passwordHash);
    } catch {
      validCurrent = false;
    }

    if (!validCurrent) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (cleanNew.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    if (cleanNew === cleanCurrent) {
      return { success: false, message: 'New password cannot be identical to current password.' };
    }

    try {
      const newHash = await bcrypt.hash(cleanNew, 10);
      const updated: AdminCredentials = {
        ...currentCreds,
        passwordHash: newHash,
      };

      localStorage.setItem(STORAGE_KEY_ADMIN_CREDS, JSON.stringify(updated));
      setCreds(updated);

      return { success: true, message: 'Password changed successfully! Keep your new password secure.' };
    } catch (e) {
      return { success: false, message: 'Failed to update password.' };
    }
  };

  const requestPasswordReset = async (email: string) => {
    console.warn('Password reset requested for', email);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        changePassword,
        credentials: { username: creds.username, email: creds.email },
        requestPasswordReset,
        lockoutSecondsRemaining,
        failedAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
