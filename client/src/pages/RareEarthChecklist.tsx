import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  CHECKLIST_ACCESS_KEY,
  CHECKLIST_QUESTIONS,
  CHECKLIST_SOURCE,
  TEASER_COUNT,
} from '@/content/rareEarthChecklist';

const inputClass =
  'w-full px-4 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary';

export default function RareEarthChecklist() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');

  const teaser = CHECKLIST_QUESTIONS.slice(0, TEASER_COUNT);
  const locked = CHECKLIST_QUESTIONS.slice(TEASER_COUNT);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/forms/rare-earth-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          role: form.role.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        setStatus('error');
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const access = { name: form.name.trim(), company: form.company.trim() };
      sessionStorage.setItem(CHECKLIST_ACCESS_KEY, JSON.stringify(access));
      setLocation('/rare-earth-checklist/print');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative py-16 md:py-24 hero-gradient">
          <div className="container max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-primary mb-3">
              Free for motor engineers
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Heavy Rare Earth Exposure Checklist
            </h1>
            <p className="text-lg text-foreground/80">
              A one-page working sheet for the magnets already in your catalog. China’s controls on heavy rare earths (Dy, Tb, and the rest of that group) are still in force, and Dy/Tb oxide prices have roughly tripled and nearly doubled since spring 2025.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container max-w-3xl">
            <div className="space-y-4 text-foreground/80 text-base md:text-lg">
              <p>
                The only figures cited here are Platts assessments, CIF North America, reported by S&P Global. Dysprosium oxide was {CHECKLIST_SOURCE.dysprosium.recent}, against {CHECKLIST_SOURCE.dysprosium.earlier}. Terbium oxide was {CHECKLIST_SOURCE.terbium.recent}, against {CHECKLIST_SOURCE.terbium.earlier}.
              </p>
              <p>
                <a
                  href={CHECKLIST_SOURCE.url}
                  className="font-semibold text-primary hover:underline break-words"
                  target="_blank"
                  rel="noreferrer"
                >
                  {CHECKLIST_SOURCE.publisher}: China extends rare earth export suspension to January 2027
                </a>
              </p>
              <p>
                Stricter US DFARS magnet sourcing rules start January 1, 2027. The checklist is twelve questions to answer from your own spec, thermal model, and purchasing file. It is not a design recommendation.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-12 mb-6">
              What the sheet asks
            </h2>
            <ol className="space-y-4">
              {teaser.map((question) => (
                <li
                  key={question.n}
                  className="rounded-lg border border-border bg-secondary/30 p-4 md:p-5"
                >
                  <p className="font-semibold text-foreground">
                    {question.n}. {question.title}
                  </p>
                  <p className="mt-1 text-foreground/70">{question.prompt}</p>
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-lg border border-dashed border-border bg-white p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-semibold text-foreground">
                    Questions {TEASER_COUNT + 1}–{CHECKLIST_QUESTIONS.length} are on the printable sheet
                  </p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground/70">
                    {locked.map((question) => (
                      <li key={question.n}>
                        {question.n}. {question.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="get-checklist" className="pb-16 md:pb-24">
          <div className="container max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3 text-center">
              Get the printable checklist
            </h2>
            <p className="text-foreground/70 text-center mb-8">
              Name, work email, and company. Role is optional. The full sheet opens next, with a box and a note line for every question.
            </p>

            <form onSubmit={onSubmit} className="space-y-5 bg-secondary/30 p-6 md:p-8 rounded-lg border border-border">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={200}
                  value={form.name}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Work email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={200}
                  value={form.email}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-foreground mb-2">
                  Company *
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  maxLength={200}
                  value={form.company}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="Company"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
                  Role <span className="font-normal text-foreground/60">(optional)</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  autoComplete="organization-title"
                  maxLength={200}
                  value={form.role}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="Motor design, purchasing, ..."
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
Show the printable checklist <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-foreground/60">
                Your name, email, and company are saved with the other EMS form signups. The checklist opens on the next page. Membership is separate, on the{' '}
                <Link href="/members">
                  <a className="underline hover:text-primary">members page</a>
                </Link>
                .
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
