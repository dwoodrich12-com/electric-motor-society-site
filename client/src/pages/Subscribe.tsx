import { useEffect } from 'react';
import { Link } from 'wouter';
import { SUBSCRIBE_PAGE_DESCRIPTION, SUBSCRIBE_PAGE_TITLE } from '@shared/subscribePage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';

export default function Subscribe() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = SUBSCRIBE_PAGE_TITLE;

    const metaDesc = document.querySelector('meta[name="description"]');
    const previousDescription = metaDesc?.getAttribute('content') ?? '';
    if (metaDesc) {
      metaDesc.setAttribute('content', SUBSCRIBE_PAGE_DESCRIPTION);
    }

    return () => {
      document.title = previousTitle;
      if (metaDesc) metaDesc.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative py-16 md:py-24 hero-gradient">
          <div className="container max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary mb-3">Newsletter</p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Weekly EMS briefing</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">{SUBSCRIBE_PAGE_DESCRIPTION}</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container max-w-xl">
            <NewsletterForm variant="page" />
            <p className="mt-4 text-sm text-foreground/60">Same list as the signup in the footer.</p>
            <p className="mt-8 text-foreground/80">
              Membership is separate from this list.{' '}
              <Link href="/members">
                <a className="font-semibold text-primary hover:underline">Join the Electric Motor Society</a>
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
