import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/universities', label: 'Universities' },
    { href: '/members', label: 'Members' },
    { href: '/motor-quote', label: 'Motor Quote' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/ems-logo.webp"
              alt="Electric Motor Society logo"
              className="h-10 w-10 rounded-md object-cover border border-border"
            />
            <span className="font-bold text-lg text-primary hidden sm:inline">Electric Motor Society (EMS)</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/join">
              <a className="btn-primary text-sm">Join Us</a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Navigation */}
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
              <Link href="/join">
                <a
                  className="block px-4 py-2 text-sm font-medium btn-primary text-center mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  Join Us
                </a>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
