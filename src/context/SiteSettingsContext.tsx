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
  logoUrl?: string;
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
  updateLogo: (logoUrl: string) => void;
  updateAbout: (settings: Partial<AboutSettings>) => void;
  updateContact: (settings: Partial<ContactSettings>) => void;
  addFont: (font: Omit<FontItem, 'id' | 'downloadCount' | 'uploadedAt'>) => void;
  addMultipleFonts: (newFontsList: Omit<FontItem, 'id' | 'downloadCount' | 'uploadedAt'>[]) => void;
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
  logoUrl: '',
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
    id: 'kantipur-font',
    name: 'Kantipur Font',
    category: 'Traditional',
    description: 'Widely used traditional newspaper and publishing font for classic print media layouts.',
    filename: 'Kantipur.ttf',
    fileUrl: '/fonts/Kantipur.ttf',
    fileSize: '41.4 KB',
    downloadCount: 860,
    uploadedAt: '2026-01-18',
    isDefault: true,
  },
  {
    id: 'sagarmatha-font',
    name: 'Sagarmatha Font',
    category: 'Traditional',
    description: 'Classic headline and book typesetting font used across Nepal for literature and governmental publications.',
    filename: 'Sagarmatha.ttf',
    fileUrl: '/fonts/Preeti.ttf',
    fileSize: '45.2 KB',
    downloadCount: 920,
    uploadedAt: '2026-01-20',
    isDefault: true,
  },
  {
    id: 'himali-font',
    name: 'Himali Font',
    category: 'Traditional',
    description: 'Clean and compact legacy font optimal for official documentation, notices, and certificates.',
    filename: 'Himali.ttf',
    fileUrl: '/fonts/Preeti.ttf',
    fileSize: '40.8 KB',
    downloadCount: 540,
    uploadedAt: '2026-01-25',
    isDefault: true,
  },
  {
    id: 'unicode-traditional',
    name: 'Nepali Unicode Traditional',
    category: 'Unicode',
    description: 'Official standard Devanagari Unicode font formatted for all modern platforms, websites, and mobile operating systems.',
    filename: 'NepaliUnicode.ttf',
    fileUrl: '/fonts/NepaliUnicode.ttf',
    fileSize: '214 KB',
    downloadCount: 1280,
    uploadedAt: '2026-02-10',
    isDefault: true,
  },
  {
    id: 'unicode-romanized',
    name: 'Nepali Unicode Romanized',
    category: 'Romanized',
    description: 'Optimized Devanagari font and keyboard layout for smooth Romanized phonetic typing and digital publishing.',
    filename: 'NepaliUnicodeRomanized.ttf',
    fileUrl: '/fonts/NepaliUnicodeRomanized.ttf',
    fileSize: '214 KB',
    downloadCount: 950,
    uploadedAt: '2026-03-01',
    isDefault: true,
  },
  {
    id: 'kalimati-font',
    name: 'Kalimati Unicode Font',
    category: 'Unicode',
    description: 'High-clarity open source Nepali Unicode font distributed for Linux, Windows, and web application interfaces.',
    filename: 'Kalimati.ttf',
    fileUrl: '/fonts/NepaliUnicode.ttf',
    fileSize: '180 KB',
    downloadCount: 1150,
    uploadedAt: '2026-02-15',
    isDefault: true,
  },
  {
    id: 'mangal-font',
    name: 'Mangal Devanagari Font',
    category: 'Unicode',
    description: 'Widely deployed Devanagari OpenType font supporting intricate conjuncts and complex ligatures.',
    filename: 'Mangal.ttf',
    fileUrl: '/fonts/NepaliUnicode.ttf',
    fileSize: '145 KB',
    downloadCount: 890,
    uploadedAt: '2026-02-22',
    isDefault: true,
  },
  {
    id: 'ganess-font',
    name: 'Ganess Font',
    category: 'Traditional',
    description: 'Bold stylistic traditional font popular in banners, book covers, and creative graphic posters.',
    filename: 'Ganess.ttf',
    fileUrl: '/fonts/Kantipur.ttf',
    fileSize: '39.5 KB',
    downloadCount: 480,
    uploadedAt: '2026-03-05',
    isDefault: true,
  },
  {
    id: 'aama-font',
    name: 'Aama Font',
    category: 'Traditional',
    description: 'Artistic legacy font with distinct traditional serifs, frequently selected for invitation cards and literature.',
    filename: 'Aama.ttf',
    fileUrl: '/fonts/Preeti.ttf',
    fileSize: '42.1 KB',
    downloadCount: 410,
    uploadedAt: '2026-03-08',
    isDefault: true,
  },
  {
    id: 'everest-font',
    name: 'Everest Font',
    category: 'Traditional',
    description: 'Distinctive tall-character font designed for maximum readability in compact tabular reports.',
    filename: 'Everest.ttf',
    fileUrl: '/fonts/Kantipur.ttf',
    fileSize: '43.6 KB',
    downloadCount: 390,
    uploadedAt: '2026-03-10',
    isDefault: true,
  },
  {
    id: 'annapurna-font',
    name: 'Annapurna Font',
    category: 'Traditional',
    description: 'Traditional Nepali typeface tailored for elegant heading typography and ceremonial certificates.',
    filename: 'Annapurna.ttf',
    fileUrl: '/fonts/Preeti.ttf',
    fileSize: '44.0 KB',
    downloadCount: 350,
    uploadedAt: '2026-03-12',
    isDefault: true,
  },
];

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY_HERO = 'nc_hero_settings';
const STORAGE_KEY_ABOUT = 'nc_about_settings';
const STORAGE_KEY_CONTACT = 'nc_contact_settings';
const STORAGE_KEY_FONTS = 'nc_fonts_list_v2';
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
      const saved = localStorage.getItem(STORAGE_KEY_FONTS) || localStorage.getItem('nc_fonts_list');
      if (!saved) return DEFAULT_FONTS;
      const parsed: FontItem[] = JSON.parse(saved);
      // Merge with default fonts so any new default fonts appear
      const existingIds = new Set(parsed.map((f) => f.id));
      const missingDefaults = DEFAULT_FONTS.filter((df) => !existingIds.has(df.id));
      return [...parsed, ...missingDefaults];
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

  const loginAdmin = (_password: string): boolean => {
    // Authentication is handled exclusively and securely via AuthContext (bcrypt + rate-limiting)
    const isAuthed = sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    setIsAdminAuthenticated(isAuthed);
    return isAuthed;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateHero = (settings: Partial<HeroSettings>) => {
    setHero((prev) => ({ ...prev, ...settings }));
  };

  const updateLogo = (logoUrl: string) => {
    setHero((prev) => ({ ...prev, logoUrl }));
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

  const addMultipleFonts = (newFontsList: Omit<FontItem, 'id' | 'downloadCount' | 'uploadedAt'>[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const items: FontItem[] = newFontsList.map((item, idx) => ({
      ...item,
      id: 'font-' + Date.now().toString(36) + '-' + idx + '-' + Math.random().toString(36).slice(2, 5),
      downloadCount: 0,
      uploadedAt: timestamp,
      isDefault: false,
    }));
    setFonts((prev) => [...items, ...prev]);
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
        updateLogo,
        updateAbout,
        updateContact,
        addFont,
        addMultipleFonts,
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
