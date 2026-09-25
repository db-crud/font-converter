import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FontItem {
  id: string;
  name: string;
  category: 'Traditional' | 'Unicode' | 'Romanized' | 'Other';
  description: string;
  filename: string;
  fileUrl: string; // URL path (/fonts/...) or data URL
  fileSize: string;
  downloadCount: number;
  uploadedAt: string;
  isDefault?: boolean;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  description: string;
  badgePrefix: string;
  companyName: string;
}

export interface AboutSettings {
  pageTitle: string;
  pageSubtitle: string;
  missionTitle: string;
  missionDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface ContactSettings {
  email: string;
  location: string;
  noticeText: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

interface SiteSettingsContextType {
  hero: HeroSettings;
  about: AboutSettings;
  contact: ContactSettings;
  fonts: FontItem[];
  messages: ContactMessage[];
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateHero: (settings: Partial<HeroSettings>) => void;
  updateAbout: (settings: Partial<AboutSettings>) => void;
  updateContact: (settings: Partial<ContactSettings>) => void;
  addFont: (font: Omit<FontItem, 'id' | 'downloadCount' | 'uploadedAt'>) => void;
  deleteFont: (id: string) => void;
  updateFont: (id: string, font: Partial<FontItem>) => void;
  recordFontDownload: (id: string) => void;
  addMessage: (message: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  resetAllSettings: () => void;
}

const DEFAULT_HERO: HeroSettings = {
  title: 'Font Converter',
  subtitle: 'Breaking the barrier between traditional Nepali fonts and the modern digital world.',
  description:
    "Convert your Nepali text seamlessly between Preeti and Unicode with speed, accuracy, and simplicity. Whether you're working with legacy documents, school records, official files, or creating content for the modern web, Nepali Converter makes the transition effortless.",
  badgePrefix: 'Proudly built in Nepal 🇳🇵 by',
  companyName: 'Motherland IT Tech Pvt. Ltd.',
};

const DEFAULT_ABOUT: AboutSettings = {
  pageTitle: 'About Us',
  pageSubtitle:
    'Font Converter is a high-precision, online utility designed to make Nepali text conversion fast, reliable, and accessible to everyone.',
  missionTitle: 'Preserving & Modernizing Nepali Typography',
  missionDescription:
    'Nepal’s digital heritage contains millions of documents written in legacy font encodings like Preeti, Kantipur, and Sagarmatha. Developed by Motherland IT Tech Pvt. Ltd., our mission is to bridge the gap between historic typography and modern digital systems with zero friction and absolute privacy.',
  stat1Value: '100%',
  stat1Label: 'Client-Side Logic',
  stat2Value: '0 ms',
  stat2Label: 'Server Latency',
  stat3Value: 'Free',
  stat3Label: 'Forever For Everyone',
};

const DEFAULT_CONTACT: ContactSettings = {
  email: 'support@nepaliconverter.local',
  location: 'Kathmandu, Nepal',
  noticeText:
    'This converter operates 100% in your browser without an active email server. Submitting the form records your message directly into the local Admin dashboard for review.',
};

const DEFAULT_FONTS: FontItem[] = [
  {
    id: 'preeti-font',
    name: 'Preeti Font',
    category: 'Traditional',
    description: 'The most popular legacy Nepali typewriter font widely used in publishing, legal drafting, and government records.',
    filename: 'Preeti.ttf',
    fileUrl: '/fonts/Preeti.ttf',
    fileSize: '41.4 KB',
    downloadCount: 1420,
    uploadedAt: '2026-01-15',
    isDefault: true,
  },
  {
    id: 'unicode-traditional',
    name: 'Unicode Traditional Font',
    category: 'Unicode',
    description: 'Official standard Devanagari Unicode font formatted for all modern platforms, websites, and mobile operating systems.',
    filename: 'NepaliUnicode.ttf',
    fileUrl: '/fonts/NepaliUnicode.ttf',
    fileSize: '214 KB',
    downloadCount: 980,
    uploadedAt: '2026-02-10',
    isDefault: true,
  },
  {
    id: 'unicode-romanized',
    name: 'Unicode Romanized Font',
    category: 'Romanized',
    description: 'Optimized Devanagari font and keyboard layout for smooth Romanized phonetic typing and digital publishing.',
    filename: 'NepaliUnicodeRomanized.ttf',
    fileUrl: '/fonts/NepaliUnicodeRomanized.ttf',
    fileSize: '214 KB',
    downloadCount: 750,
    uploadedAt: '2026-03-01',
    isDefault: true,
  },
  {
    id: 'kantipur-font',
    name: 'Kantipur Font',
    category: 'Traditional',
    description: 'Widely used traditional newspaper and publishing font for classic print media layouts.',
    filename: 'Kantipur.ttf',
    fileUrl: '/fonts/Kantipur.ttf',
    fileSize: '41.4 KB',
    downloadCount: 620,
    uploadedAt: '2026-03-12',
    isDefault: true,
  },
];

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY_HERO = 'nc_hero_settings';
const STORAGE_KEY_ABOUT = 'nc_about_settings';
const STORAGE_KEY_CONTACT = 'nc_contact_settings';
const STORAGE_KEY_FONTS = 'nc_fonts_list';
const STORAGE_KEY_MESSAGES = 'nc_contact_messages';
const STORAGE_KEY_AUTH = 'nc_admin_auth';

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hero, setHero] = useState<HeroSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      return saved ? { ...DEFAULT_HERO, ...JSON.parse(saved) } : DEFAULT_HERO;
    } catch {
      return DEFAULT_HERO;
    }
  });

  const [about, setAbout] = useState<AboutSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ABOUT);
      return saved ? { ...DEFAULT_ABOUT, ...JSON.parse(saved) } : DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  const [contact, setContact] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTACT);
      return saved ? { ...DEFAULT_CONTACT, ...JSON.parse(saved) } : DEFAULT_CONTACT;
    } catch {
      return DEFAULT_CONTACT;
    }
  });

  const [fonts, setFonts] = useState<FontItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FONTS);
      return saved ? JSON.parse(saved) : DEFAULT_FONTS;
    } catch {
      return DEFAULT_FONTS;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(hero));
  }, [hero]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(about));
  }, [about]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(contact));
  }, [contact]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FONTS, JSON.stringify(fonts));
  }, [fonts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  const loginAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'motherland2083') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateHero = (settings: Partial<HeroSettings>) => {
    setHero((prev) => ({ ...prev, ...settings }));
  };

  const updateAbout = (settings: Partial<AboutSettings>) => {
    setAbout((prev) => ({ ...prev, ...settings }));
  };

  const updateContact = (settings: Partial<ContactSettings>) => {
    setContact((prev) => ({ ...prev, ...settings }));
  };

  const addFont = (fontData: Omit<FontItem, 'id' | 'downloadCount' | 'uploadedAt'>) => {
    const newFont: FontItem = {
      ...fontData,
      id: 'font-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      downloadCount: 0,
      uploadedAt: new Date().toISOString().split('T')[0],
      isDefault: false,
    };
    setFonts((prev) => [newFont, ...prev]);
  };

  const deleteFont = (id: string) => {
    setFonts((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFont = (id: string, updated: Partial<FontItem>) => {
    setFonts((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const recordFontDownload = (id: string) => {
    setFonts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
    );
  };

  const addMessage = (msgData: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now().toString(36),
      date: new Date().toLocaleString(),
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const resetAllSettings = () => {
    setHero(DEFAULT_HERO);
    setAbout(DEFAULT_ABOUT);
    setContact(DEFAULT_CONTACT);
    setFonts(DEFAULT_FONTS);
    localStorage.removeItem(STORAGE_KEY_HERO);
    localStorage.removeItem(STORAGE_KEY_ABOUT);
    localStorage.removeItem(STORAGE_KEY_CONTACT);
    localStorage.removeItem(STORAGE_KEY_FONTS);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        hero,
        about,
        contact,
        fonts,
        messages,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateHero,
        updateAbout,
        updateContact,
        addFont,
        deleteFont,
        updateFont,
        recordFontDownload,
        addMessage,
        markMessageRead,
        deleteMessage,
        resetAllSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
