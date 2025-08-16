'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border-2 border-maple-blue bg-white hover:bg-maple-light transition-colors"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-bold text-maple-dark hidden sm:inline">
          {currentLanguage?.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-maple-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 bg-white border-2 border-maple-blue rounded-lg shadow-lg z-20 min-w-[160px]">
            {availableLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-maple-light transition-colors ${
                  lang.code === language ? 'bg-maple-light border-l-4 border-maple-orange' : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-bold text-maple-dark">{lang.name}</span>
                {lang.code === language && (
                  <span className="ml-auto text-maple-orange">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
