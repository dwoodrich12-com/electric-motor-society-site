import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Calendar, User, Share2, Linkedin, Twitter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  featured: boolean;
  image: string;
  keywords: string[];
  content: string;
}

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/blog/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Set SEO meta tags
  useEffect(() => {
    if (!post) return;

    // Title
    document.title = `${post.title} | Electric Motor Society`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', post.excerpt);

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', post.keywords?.join(', ') || '');

    // Open Graph
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', post.title);
    setOgTag('og:description', post.excerpt);
    setOgTag('og:image', post.image);
    setOgTag('og:url', `https://electricmotorsociety.com/blog/${post.slug}`);
    setOgTag('og:type', 'article');

    // Twitter Card
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', post.title);
    setTwitterTag('twitter:description', post.excerpt);
    setTwitterTag('twitter:image', post.image);

    // Cleanup on unmount
    return () => {
      document.title = 'Electric Motor Society';
    };
  }, [post]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `https://electricmotorsociety.com/blog/${slug}`
    : '';

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container py-20">
          <p className="text-center text-foreground/70">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-foreground/70 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link href="/blog">
              <a className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container py-4 flex justify-between items-center">
            <Link href="/blog">
              <a className="flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </a>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/60 mr-2">Share:</span>
              <button
                onClick={shareOnTwitter}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="section-padding">
          <div className="container max-w-3xl">
            {/* Meta Information */}
            <div className="mb-8 pb-8 border-b border-border">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{post.title}</h1>
              <div className="flex flex-wrap gap-6 text-foreground/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground/80 space-y-4 
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                  [&_li]:text-foreground/80
                  [&_a]:text-primary [&_a]:underline [&_a]:hover:no-underline
                  [&_strong]:text-foreground [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags/Keywords */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Related Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-secondary text-foreground/70 px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts CTA */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">More Articles</h2>
            <p className="text-lg text-foreground/80 mb-8">
              Explore more insights about electric motor technology and industry trends.
            </p>
            <Link href="/blog">
              <a className="btn-primary inline-flex items-center justify-center gap-2">
                View All Articles
              </a>
            </Link>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss an Update</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Subscribe to get the latest articles and industry insights delivered to your inbox.
            </p>
            <form 
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                try {
                  const res = await fetch('/api/mailchimp/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  });
                  if (res.ok) {
                    alert('Thanks for subscribing!');
                    form.reset();
                  } else {
                    alert('Subscription failed. Please try again.');
                  }
                } catch {
                  alert('Subscription failed. Please try again.');
                }
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-foreground focus:outline-none"
                required
              />
              <button type="submit" className="bg-white text-primary hover:bg-primary-foreground px-6 py-3 rounded-md font-semibold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
