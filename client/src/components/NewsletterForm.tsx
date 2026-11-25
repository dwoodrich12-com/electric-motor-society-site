import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type NewsletterFormProps = {
  variant?: 'footer' | 'page';
};

/**
 * Same signup the footer uses: POST /api/mailchimp/subscribe with { email }.
 * No extra fields or Mailchimp tags.
 */
export default function NewsletterForm({ variant = 'footer' }: NewsletterFormProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(t('common.success'));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || t('common.error'));
      }
    } catch {
      setStatus('error');
      setMessage(t('common.error'));
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  const isPage = variant === 'page';

  return (
    <form onSubmit={handleSubscribe} className={isPage ? 'space-y-3' : 'space-y-2'}>
      <div className={isPage ? 'flex flex-col sm:flex-row gap-3' : 'flex gap-2'}>
        <label htmlFor={inputId} className="sr-only">
          {t('blog.newsletter.placeholder')}
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('blog.newsletter.placeholder')}
          required
          className={
            isPage
              ? 'min-w-0 flex-1 px-4 py-3 text-base rounded-md bg-white border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary'
              : 'min-w-0 flex-1 px-3 py-2 text-sm rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30'
          }
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={
            isPage
              ? 'px-6 py-3 text-base font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50'
              : 'px-4 py-2 text-sm font-medium rounded-md bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors disabled:opacity-50'
          }
        >
          {status === 'loading' ? (
            <Loader2 className={`animate-spin ${isPage ? 'w-5 h-5' : 'w-4 h-4'}`} />
          ) : (
            t('blog.subscribe')
          )}
        </button>
      </div>
      {status === 'success' && (
        <p className={`text-sm flex items-center gap-1 ${isPage ? 'text-green-700' : 'text-green-300'}`}>
          <CheckCircle className="w-3 h-3" /> {message}
        </p>
      )}
      {status === 'error' && (
        <p className={`text-sm flex items-center gap-1 ${isPage ? 'text-red-700' : 'text-red-300'}`}>
          <AlertCircle className="w-3 h-3" /> {message}
        </p>
      )}
    </form>
  );
}
