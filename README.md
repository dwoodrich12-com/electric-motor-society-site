# Electric Motor Society Website

A modern, responsive Next.js + Tailwind CSS website for the Electric Motor Society, featuring multiple pages, forms with server-side logging, and a blog system.

## Features

- **Multiple Pages**: Home, Sponsors, Universities, Members, Motor Quote, Join, Blog
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Forms with Logging**: All forms log submissions server-side to console
- **Blog System**: Markdown-backed blog with multiple posts
- **File Upload**: Motor Quote form supports file attachments (PDF, images, CAD drawings)
- **Professional Branding**: Navy blue and white color scheme matching Electric Motor Society
- **TypeScript**: Fully typed for better development experience
- **Ready for Vercel**: Configured for easy deployment

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

All forms submit to server-side API routes that log submissions to console:

- `POST /api/forms/member-signup` - Member signup form
- `POST /api/forms/sponsor-inquiry` - Sponsor inquiry form
- `POST /api/forms/university-interest` - University interest form
- `POST /api/forms/motor-quote` - Motor quote request with file upload

### Form Submission Flow

1. User fills out form in browser
2. Form data submitted to API route via fetch
3. Server logs submission to console with timestamp
4. Success message displayed to user
5. Form resets for next submission

**Note**: Forms currently show success messages without real backend processing. The server logs all submissions to console for verification.

## Environment Variables

For Vercel deployment, add these environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
```

**Current Status**: These are placeholders for future integration. Forms currently show UI stubs without real payment processing.

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
