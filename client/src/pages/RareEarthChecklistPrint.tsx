import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Printer } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  CHECKLIST_ACCESS_KEY,
  CHECKLIST_QUESTIONS,
  CHECKLIST_SOURCE,
  type ChecklistAccess,
} from '@/content/rareEarthChecklist';

export default function RareEarthChecklistPrint() {
  const [ready, setReady] = useState(false);
  const [access, setAccess] = useState<ChecklistAccess | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHECKLIST_ACCESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChecklistAccess;
        if (parsed?.name && parsed?.company) {
          setAccess(parsed);
        }
      }
    } catch {
      setAccess(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container py-16">
          <p className="text-foreground/70">Loading the checklist…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!access) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <section className="section-padding">
            <div className="container max-w-xl text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                The printable checklist opens after signup
              </h1>
              <p className="text-foreground/70 mb-8">
                Enter your name, email, and company on the checklist page. The full sheet opens in this browser afterward.
              </p>
              <Link href="/rare-earth-checklist#get-checklist">
                <a className="btn-primary inline-flex items-center justify-center">
                  Get the checklist
                </a>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .print-sheet { box-shadow: none !important; border: none !important; padding: 0 !important; }
          .print-sheet h1 { font-size: 18px !important; line-height: 1.2 !important; }
          .print-sheet .sheet-kicker,
          .print-sheet .sheet-intro,
          .print-sheet .sheet-foot { font-size: 10px !important; line-height: 1.3 !important; }
          .print-sheet .sheet-intro { margin-bottom: 8px !important; }
          .print-sheet ol { display: flex; flex-direction: column; gap: 6px !important; }
          .print-sheet .q-title { font-size: 11px !important; line-height: 1.25 !important; }
          .print-sheet .q-prompt { font-size: 10px !important; line-height: 1.25 !important; }
          .print-sheet .note-line { height: 12px !important; margin-top: 2px !important; }
          @page { margin: 0.4in; size: letter; }
        }
      `}</style>
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-1">
        <div className="no-print bg-secondary/40 border-b border-border">
          <div className="container py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-foreground/80">
              Prepared for {access.name}, {access.company}. Use Print and choose “Save as PDF” if you want a file.
            </p>
            <button
              type="button"
              className="btn-primary inline-flex items-center justify-center gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              Print checklist
            </button>
          </div>
        </div>

        <article className="container py-8 md:py-12 print:py-0">
          <div className="print-sheet max-w-3xl mx-auto bg-white border border-border rounded-lg p-6 md:p-10">
            <div className="border-b border-primary/20 pb-4 mb-4">
              <p className="sheet-kicker text-xs font-semibold tracking-wide text-primary uppercase">
                Electric Motor Society
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1">
                Heavy Rare Earth Exposure Checklist
              </h1>
              <p className="sheet-kicker text-sm text-foreground/70 mt-2">
                For {access.name}, {access.company}. Answer from the product spec, the thermal model, and purchasing’s current quotes. Leave a line blank if you do not know yet.
              </p>
            </div>

            <section className="sheet-intro text-sm text-foreground/80 space-y-2 mb-5">
              <p>
                China’s controls on heavy rare earths (Dy, Tb, and the rest of that group) are still in force. Dy/Tb oxide prices have roughly tripled and nearly doubled since spring 2025. Platts, CIF North America, via S&P Global: dysprosium oxide {CHECKLIST_SOURCE.dysprosium.recent} vs. {CHECKLIST_SOURCE.dysprosium.earlier}; terbium oxide {CHECKLIST_SOURCE.terbium.recent} vs. {CHECKLIST_SOURCE.terbium.earlier}. Stricter US DFARS magnet sourcing rules start January 1, 2027.
              </p>
              <p className="break-words">
                Source:{' '}
                <a href={CHECKLIST_SOURCE.url} className="text-primary underline">
                  {CHECKLIST_SOURCE.url}
                </a>
              </p>
            </section>

            <ol className="space-y-4">
              {CHECKLIST_QUESTIONS.map((question) => (
                <li key={question.n} className="break-inside-avoid">
                  <div className="flex gap-3">
                    <span
                      className="mt-0.5 inline-block h-4 w-4 shrink-0 border-2 border-primary"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="q-title font-semibold text-foreground text-sm">
                        {question.n}. {question.title}
                      </p>
                      <p className="q-prompt text-sm text-foreground/70">{question.prompt}</p>
                      <div className="note-line mt-2 border-b border-foreground/30 h-5" />
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="sheet-foot mt-6 text-xs text-foreground/60">
              Electric Motor Society · electricmotorsociety.com/rare-earth-checklist · Figures from S&P Global / Platts only. This sheet does not add other price claims.
            </p>
          </div>
        </article>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
