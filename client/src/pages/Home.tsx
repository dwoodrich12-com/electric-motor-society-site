import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Users, Target, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient overflow-hidden">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  {t('home.hero.title')}
                </h1>
                <p className="text-lg text-foreground/80">
                  {t('home.hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/join">
                    <a className="btn-primary inline-flex items-center justify-center gap-2">
                      {t('home.hero.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </Link>
                  <Link href="/sponsors">
                    <a className="btn-secondary inline-flex items-center justify-center gap-2">
                      {t('home.hero.ctaSecondary')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/ems-hero-oKDaDLoEcTWfGiovxTxkxW.webp"
                  alt="Electric Motor Cross-Section"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('home.mission.title')}</h2>
              <p className="text-lg text-foreground/80">
                {t('home.mission.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">{t('home.benefits.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, key: 'networking' },
                { icon: BookOpen, key: 'research' },
                { icon: Zap, key: 'resources' },
                { icon: Target, key: 'events' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <item.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t(`home.benefits.${item.key}.title`)}
                  </h3>
                  <p className="text-foreground/70">
                    {t(`home.benefits.${item.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('home.benefits.title')}</h2>
              <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                {t('home.mission.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/members">
                  <a className="btn-primary inline-flex items-center justify-center gap-2">
                    {t('members.cta')} <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
                <Link href="/sponsors">
                  <a className="btn-secondary inline-flex items-center justify-center gap-2">
                    {t('sponsors.cta')} <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
