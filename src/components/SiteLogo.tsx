import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface SiteLogoProps {
  className?: string; // e.g. "w-10 h-10" or "w-12 h-12"
  imageClassName?: string;
  fallbackLetter?: string;
  alt?: string;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  className = 'w-10 h-10',
  imageClassName = '',
  fallbackLetter = 'ने',
  alt,
}) => {
  const { hero } = useSiteSettings();

  if (hero.logoUrl && hero.logoUrl.trim() !== '') {
    return (
      <div
        className={`${className} rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center shadow-xs overflow-hidden transition-all shrink-0`}
      >
        <img
          src={hero.logoUrl}
          alt={alt || hero.title || 'Site Logo'}
          className={`w-full h-full object-contain ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 transition-transform shrink-0`}
    >
      <span className="font-nepali text-xl font-bold leading-none select-none">{fallbackLetter}</span>
    </div>
  );
};
