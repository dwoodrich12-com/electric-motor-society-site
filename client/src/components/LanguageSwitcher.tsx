import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', short: 'EN', flag: '🇺🇸' },
  { code: 'es', name: 'Español', short: 'ES', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', short: 'DE', flag: '🇩🇪' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    
    // Update URL to reflect language (optional - for SEO)
    // This could be expanded to use proper URL routing
    localStorage.setItem('i18nextLng', code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white hover:bg-primary/5 hover:border-primary/30 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="inline-flex items-center gap-1">
          <span>{currentLang.flag}</span>
          <span className="font-medium">{currentLang.short}</span>
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-md shadow-lg z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-secondary transition-colors ${
                lang.code === i18n.language ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
