# Electric Motor Society Website

A responsive React + Vite website for the Electric Motor Society, with an Express server for forms, Stripe Checkout, and the blog.

## Features

- **Multiple Pages**: Home, Sponsors, Universities, Members, Motor Quote, Join, Blog
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Forms with Logging**: All forms log submissions server-side to console
- **Blog System**: Markdown-backed blog with multiple posts
- **File Upload**: Motor Quote form supports file attachments (PDF, images, CAD drawings)
- **Professional Branding**: Navy blue and white color scheme matching Electric Motor Society
- **TypeScript**: Fully typed for better development experience
- **Render**: Production web service. Auto-deploys from `main`

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: Wouter (lightweight alternative to Next.js routing)
- **UI Components**: shadcn/ui
- **Backend**: Express.js (for form handling)
- **Build Tool**: Vite

## Project Structure

```
electric-motor-society/
├── client/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components (Header, Footer)
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── lib/         # Utilities
│   │   ├── App.tsx      # Main app with routing
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Global styles & design tokens
│   └── index.html       # HTML template
├── server/
│   ├── api/
│   │   └── forms.ts     # Form submission API routes
│   └── index.ts         # Express server
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Git

### Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```
   
   The site will be available at `http://localhost:3000`

3. **Build for production**:
   ```bash
   pnpm build
   ```

4. **Preview production build**:
   ```bash
   pnpm preview
   ```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, mission, and CTAs |
| `/sponsors` | Sponsorship opportunities and inquiry form |
| `/universities` | University collaboration programs |
| `/members` | Membership benefits and signup form |
| `/motor-quote` | Motor quote request with file upload |
| `/join` | Join page with member/sponsor split |
| `/blog` | Blog post listing |
| `/blog/[slug]` | Individual blog post |

## Forms & API Routes

All forms submit to server-side API routes:

- `POST /api/forms/member-signup` - Member inquiry (not checkout)
- `POST /api/forms/sponsor-inquiry` - Sponsor inquiry. Flagship is handled privately, not on the site. The server still accepts `interestType: "flagship-inquiry"` and does not start checkout
- `POST /api/forms/university-interest` - University interest form
- `POST /api/forms/motor-quote` - Motor quote request with file upload
- `POST /api/forms/rare-earth-checklist` - Checklist signup
- `GET /api/forms/logs` - Form log review. Requires `ADMIN_TOKEN` (Bearer or `X-Admin-Token`). Returns 404 when the token is unset and 401 when it does not match

### Form Submission Flow

1. User fills out form in browser
2. Form data submitted to API route via fetch
3. Server logs submission to console with timestamp
4. Success message displayed to user
5. Form resets for next submission

Forms log to `FORM_LOGS_PATH` (default `/tmp/ems-form-logs.json`, ephemeral on Render), subscribe the address in Mailchimp when that integration is configured, and send a notice through AgentMail when `AGENTMAIL_API_KEY` is set.

## Environment Variables

Set these on the Render service. Do not commit values.

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MEMBER_MONTHLY=price_...
STRIPE_PRICE_MEMBER_QUARTERLY=price_...
STRIPE_PRICE_MEMBER_YEARLY=price_...
STRIPE_PRICE_SUPPORTING=price_...
STRIPE_PRICE_STRATEGIC=price_...
STRIPE_PRICE_PREMIER=price_...
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
AGENTMAIL_API_KEY=...
AGENTMAIL_FROM=inbox@example.com
NOTIFICATION_EMAIL=info@electricmotorsociety.com
ADMIN_TOKEN=long-random-string
```

Flagship is handled privately, not on the site. `STRIPE_PRICE_FLAGSHIP` is unused. Leave any existing Stripe price in place.

`STRIPE_PRICE_PREMIER` is the Premier Sponsor price ($7,500/month). Set it on the Render service before Premier checkout can succeed.

If `STRIPE_SECRET_KEY` is empty, the process still boots and checkout routes return 503. Membership and Supporting, Strategic, and Premier checkout use Stripe Checkout Sessions. Those three sponsor tiers are monthly prices with a 12-month commitment recorded in Checkout and subscription metadata (`commitment_months`, `commitment_start`, `commitment_end`). The subscription is not wrapped in a Subscription Schedule.

## Stripe webhook

After this is deployed, add one endpoint in the Stripe Dashboard (Developers → Webhooks). Do not create or edit products or prices.

- URL: `https://electricmotorsociety.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copy the signing secret into Render as `STRIPE_WEBHOOK_SECRET`

The route reads the raw body and rejects the request when the secret is missing or the signature is wrong. A completed checkout updates customer and subscription metadata, tags Mailchimp (`ems-member`, and `ems-sponsor-<tier>` for sponsors), and emails `NOTIFICATION_EMAIL` through AgentMail. Mailchimp or email failures are logged and still return 200 after the Stripe event is accepted. Set `AGENTMAIL_API_KEY` or those notices are only written to the log.

`GET /api/forms/logs` stays closed until `ADMIN_TOKEN` is set. Generate a long random value and send it as `Authorization: Bearer <token>`.

## Design System

### Colors
- **Primary**: Navy Blue (#1e3a5f)
- **Secondary**: Light Gray (#f3f4f6)
- **Accent**: Electric Blue (#2563eb)
- **Background**: White (#ffffff)
- **Foreground**: Dark Gray (#1f2937)

### Typography
- **Display Font**: Plus Jakarta Sans (bold, headings)
- **Body Font**: Plus Jakarta Sans (regular, body text)
- **Font Sizes**: Responsive scaling from mobile to desktop

### Components
- Custom button styles (`.btn-primary`, `.btn-secondary`)
- Responsive container with padding
- Hero gradient backgrounds
- Section padding utilities

## Blog Posts

Sample blog posts included:

1. **Guide to Brushless DC Motors** - BLDC technology overview
2. **ECM Motors: Efficiency and Control** - Electronically commutated motors
3. **Types of Electric Motors Explained** - Comprehensive motor type guide

Blog posts are stored in `BlogPost.tsx` with sample content. To add new posts:

1. Add post data to the `posts` object in `BlogPost.tsx`
2. Create a new slug entry with title, date, content
3. Content supports HTML formatting

Production is the Render web service `electric-motor-society-site`, which auto-deploys from `main`. The Vercel notes below are leftover from the original scaffold.

## Deployment to Vercel

### Option 1: Git Integration (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel auto-detects Next.js configuration
5. Add environment variables in project settings
6. Deploy!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Configuration

The project is pre-configured for Vercel:
- `package.json` includes build script
- `server/index.ts` handles API routes
- Static files served from `dist/public`

## Customization

### Adding New Pages

1. Create new file in `client/src/pages/`
2. Import Header and Footer components
3. Add route to `App.tsx`

### Updating Branding

1. Edit colors in `client/src/index.css` (CSS variables)
2. Update logo in Header component
3. Modify footer contact email

### Adding Blog Posts

1. Edit `client/src/pages/BlogPost.tsx`
2. Add new entry to `posts` object
3. Include title, date, content, image

## Performance

- **Optimized Images**: Using CDN URLs for hero and blog images
- **Code Splitting**: Route-based code splitting via Vite
- **CSS**: Tailwind CSS with PurgeCSS for production
- **Compression**: Gzip compression on Vercel

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact & Support

**Email**: info@electricmotorsociety.com

For questions about the website or to report issues, please contact the Electric Motor Society team.

## License

© 2026 Electric Motor Society. All rights reserved.

---

**Built with ❤️ for the electric motor industry**
