import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-lg text-foreground/80 mb-8">
              We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <a className="btn-primary inline-flex items-center justify-center gap-2">
                Go Home <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
            <Link href="/blog">
              <a className="btn-secondary inline-flex items-center justify-center gap-2">
                Visit Blog <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
