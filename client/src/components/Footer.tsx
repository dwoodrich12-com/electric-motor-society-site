import { Link } from 'wouter';
import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
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
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

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
              <span className="font-bold text-lg">Electric Motor Society (EMS)</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Founded in 2026. Bringing together professionals and enthusiasts in electric motor technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-primary-foreground/80 transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/sponsors">
                  <a className="hover:text-primary-foreground/80 transition-colors">Sponsors</a>
                </Link>
              </li>
              <li>
                <Link href="/universities">
                  <a className="hover:text-primary-foreground/80 transition-colors">Universities</a>
                </Link>
              </li>
              <li>
                <Link href="/members">
                  <a className="hover:text-primary-foreground/80 transition-colors">Members</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/motor-quote">
                  <a className="hover:text-primary-foreground/80 transition-colors">Motor Quote</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="hover:text-primary-foreground/80 transition-colors">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/join">
                  <a className="hover:text-primary-foreground/80 transition-colors">Join Us</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Subscribe to our newsletter for industry updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Join'
                  )}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-sm text-green-300 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {message}
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {message}
                </p>
              )}
            </form>
            <div className="mt-4 text-sm">
              <a href="mailto:info@electricmotorsociety.com" className="hover:text-primary-foreground/80 transition-colors">
                info@electricmotorsociety.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>&copy; {currentYear} Electric Motor Society. All rights reserved.</p>
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
