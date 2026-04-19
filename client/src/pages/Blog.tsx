import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  author: string;
}

export default function Blog() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts
    fetch(`/api/blog/posts${selectedCategory ? `?category=${selectedCategory}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts:', err);
        setLoading(false);
      });

    // Fetch categories
    fetch('/api/blog/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to load categories:', err));
  }, [selectedCategory]);

  // Set page meta
  useEffect(() => {
    document.title = 'Electric Motor Blog | Electric Motor Society';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Insights, technical articles, and industry news about electric motor technology, innovation, and best practices from the Electric Motor Society.');
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const featuredPosts = posts.filter(post => post.featured).slice(0, 2);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t('blog.title')}</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">
              Insights, technical articles, and industry news about electric motor technology, innovation, and best practices.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 border-b border-border">
          <div className="container">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-foreground/70">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === '' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {t('blog.allPosts')}
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-lg border text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                      : 'bg-white text-foreground border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="container">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70">No posts found.</p>
              </div>
            ) : (
              <>
                {featuredPosts.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-2xl font-bold text-primary">Featured Articles</h2>
                      <span className="text-sm text-foreground/60">Latest insights from EMS</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {featuredPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                          <a className="group block h-full">
                            <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                              <div className="relative h-64 overflow-hidden bg-secondary">
                                <img
                                  src={post.image}
                                  alt={post.imageAlt || post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                  Featured
                                </span>
                              </div>
                              <div className="p-6 flex flex-col flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    {post.category}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-foreground/60">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(post.date)}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-foreground/70 mb-5 flex-1">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                                  Read Article <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-primary">All Articles</h2>
                  <span className="text-sm text-foreground/60">{posts.length} posts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <a className="group block h-full">
                        <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                          <div className="relative h-48 overflow-hidden bg-secondary">
                            <img
                              src={post.image}
                              alt={post.imageAlt || post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {post.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-foreground/60">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.date)}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-foreground/70 text-sm mb-4 flex-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                              Read More <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.newsletter.title')}</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              {t('blog.newsletter.description')}
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
