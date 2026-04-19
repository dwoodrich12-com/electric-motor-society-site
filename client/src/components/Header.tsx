import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/sponsors', label: t('nav.sponsors') },
    { href: '/universities', label: t('nav.universities') },
    { href: '/members', label: t('nav.members') },
    { href: '/motor-quote', label: t('nav.motorQuote') },
    { href: '/blog', label: t('nav.blog') },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/assets/ems-logo.webp"
              alt="Electric Motor Society logo"
              className="h-10 w-10 rounded-md object-cover border border-border"
            />
            <span className="font-bold text-lg text-primary hidden lg:inline">Electric Motor Society (EMS)</span>
            <span className="font-bold text-base text-primary hidden sm:inline lg:hidden">EMS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center min-w-0">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap">
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
