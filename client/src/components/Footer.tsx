import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@electricmotorsociety.com" className="hover:text-primary-foreground/80 transition-colors">
                  info@electricmotorsociety.com
                </a>
              </li>
              <li className="text-primary-foreground/80">
                Connecting the electric motor industry
              </li>
            </ul>
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
