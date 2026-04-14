import { Link } from 'wouter';
import { ArrowRight, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Blog() {
  const posts = [
    {
      slug: 'bldc-motors-guide',
      title: 'Guide to Brushless DC Motors',
      excerpt: 'Learn about BLDC motor technology, advantages, applications, and how they compare to traditional brushed motors.',
      date: 'March 12, 2026',
      category: 'Technology',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/blog-bldc-motors-WF2m37CK3Yfv7jTB6VVMTZ.webp'
    },
    {
      slug: 'ecm-motors-efficiency',
      title: 'ECM Motors: Efficiency and Control',
      excerpt: 'Explore electronically commutated motors and how advanced control systems enable variable speed operation and energy savings.',
      date: 'March 30, 2026',
      category: 'Efficiency',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/blog-ecm-motors-WKK8LGZUDsGweNKiBrcsGC.webp'
    },
    {
      slug: 'motor-types-explained',
      title: 'Types of Electric Motors Explained',
      excerpt: 'A comprehensive overview of different electric motor types including AC, DC, stepper, and specialty motors for various applications.',
      date: 'March 26, 2026',
      category: 'Education',
      // Using local EMS logo image as a stable placeholder for now
      image: '/assets/ems-logo.webp'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Electric Motor Blog</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">
              Insights, technical articles, and industry news about electric motor technology, innovation, and best practices.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <a className="group block h-full">
                    <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-secondary">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-foreground/60">
                            <Calendar className="w-3 h-3" />
                            {post.date}
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
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Subscribe to our newsletter for the latest articles, industry insights, and motor technology news.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
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
