import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/ems-logo.webp"
                alt="Electric Motor Society logo"
                className="h-8 w-8 rounded-md object-cover border border-primary-foreground/20 bg-white"
              />
              <span className="font-bold text-lg">Electric Motor Society</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.home')}</a>
                </Link>
              </li>
              <li>
                <Link href="/sponsors">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.sponsors')}</a>
                </Link>
              </li>
              <li>
                <Link href="/universities">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.universities')}</a>
                </Link>
              </li>
              <li>
                <Link href="/members">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.members')}</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/motor-quote">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.motorQuote')}</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.blog')}</a>
                </Link>
              </li>
              <li>
                <Link href="/subscribe">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('nav.subscribe')}</a>
                </Link>
              </li>
              <li>
                <Link href="/rare-earth-checklist">
                  <a className="hover:text-primary-foreground/80 transition-colors">{t('footer.checklist')}</a>
                </Link>
              </li>
              <li>
                <a href="mailto:info@electricmotorsociety.com" className="hover:text-primary-foreground/80 transition-colors">
                  info@electricmotorsociety.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">{t('blog.newsletter.title')}</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              {t('blog.newsletter.description')}
            </p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
