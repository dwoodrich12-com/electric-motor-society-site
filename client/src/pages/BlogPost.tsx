import { useRoute, Link } from 'wouter';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Sample blog posts data
  const posts: Record<string, any> = {
    'bldc-motors-guide': {
      title: 'Guide to Brushless DC Motors',
      date: 'March 12, 2026',
      author: 'Electric Motor Society',
      category: 'Technology',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/blog-bldc-motors-WF2m37CK3Yfv7jTB6VVMTZ.webp',
      content: `
        <h2>What are Brushless DC Motors?</h2>
        <p>Brushless DC (BLDC) motors are electric motors powered by direct current that use electronic commutation instead of mechanical brushes. They represent a significant advancement in motor technology, offering superior efficiency, reliability, and performance compared to traditional brushed motors.</p>

        <h2>Key Advantages of BLDC Motors</h2>
        <p><strong>Higher Efficiency:</strong> BLDC motors typically achieve 85-90% efficiency compared to 75-80% for brushed motors, resulting in lower power consumption and reduced heat generation.</p>
        <p><strong>Longer Lifespan:</strong> Without brushes and commutators, BLDC motors have fewer wear components, leading to extended operational life and reduced maintenance requirements.</p>
        <p><strong>Better Performance:</strong> BLDC motors provide superior torque characteristics, faster acceleration, and smoother operation across a wide speed range.</p>
        <p><strong>Lower Noise:</strong> Electronic commutation eliminates the brush noise associated with traditional DC motors, making BLDC motors quieter and more suitable for noise-sensitive applications.</p>

        <h2>How BLDC Motors Work</h2>
        <p>BLDC motors use permanent magnets on the rotor and electromagnets on the stator. An electronic controller (ESC) switches the current flow to the stator windings based on rotor position feedback from Hall effect sensors or back-EMF sensing. This creates a rotating magnetic field that drives the rotor.</p>

        <h2>Applications</h2>
        <p>BLDC motors are used in a wide variety of applications including:</p>
        <ul>
          <li>Electric vehicles and e-bikes</li>
          <li>Drones and aerial systems</li>
          <li>Industrial automation</li>
          <li>HVAC systems</li>
          <li>Power tools</li>
          <li>Computer cooling fans</li>
          <li>Medical equipment</li>
        </ul>

        <h2>Conclusion</h2>
        <p>BLDC motors represent the future of electric motor technology. Their superior efficiency, reliability, and performance make them the ideal choice for modern applications where energy efficiency and reliability are paramount.</p>
      `
    },
    'ecm-motors-efficiency': {
      title: 'ECM Motors: Efficiency and Control',
      date: 'March 30, 2026',
      author: 'Electric Motor Society',
      category: 'Efficiency',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/blog-ecm-motors-WKK8LGZUDsGweNKiBrcsGC.webp',
      content: `
        <h2>Understanding ECM Motors</h2>
        <p>Electronically Commutated Motors (ECM) are a type of brushless DC motor specifically designed for high efficiency and variable speed operation. They incorporate advanced electronic controllers that optimize motor performance based on load and operating conditions.</p>

        <h2>Energy Efficiency Benefits</h2>
        <p>ECM motors can achieve efficiency levels of 80-90%, making them ideal for applications where energy consumption is a critical concern. The electronic control allows the motor to operate at optimal efficiency across a wide range of speeds and loads.</p>

        <h2>Variable Speed Control</h2>
        <p>Unlike traditional AC motors that operate at fixed speeds, ECM motors can vary their speed electronically. This enables:</p>
        <ul>
          <li>Reduced energy consumption during partial load conditions</li>
          <li>Better comfort control in HVAC applications</li>
          <li>Extended motor life through reduced thermal stress</li>
          <li>Quieter operation at lower speeds</li>
        </ul>

        <h2>Applications in HVAC</h2>
        <p>ECM motors are increasingly used in HVAC systems, where they can reduce energy consumption by 30-50% compared to traditional motors. The variable speed capability allows the system to modulate airflow based on actual heating or cooling demand.</p>

        <h2>Future Outlook</h2>
        <p>As energy efficiency regulations become stricter worldwide, ECM motor adoption is expected to accelerate. Manufacturers are continuously improving control algorithms and reducing costs to make these motors more accessible for various applications.</p>
      `
    },
    'motor-types-explained': {
      title: 'Types of Electric Motors Explained',
      date: 'March 26, 2026',
      author: 'Electric Motor Society',
      category: 'Education',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/blog-motor-types-CjSqVKYhtVHs9EqceBGxys.webp',
      content: `
        <h2>Overview of Electric Motor Types</h2>
        <p>Electric motors come in many varieties, each designed for specific applications and operating conditions. Understanding the differences can help you select the right motor for your needs.</p>

        <h2>AC Induction Motors</h2>
        <p>AC induction motors are the most common type of electric motor. They use alternating current to create a rotating magnetic field that induces current in the rotor, producing torque. They are robust, reliable, and relatively inexpensive, making them ideal for industrial applications.</p>

        <h2>DC Brushed Motors</h2>
        <p>Traditional DC motors use brushes and a commutator to switch current direction. While they offer good speed control and torque characteristics, they require more maintenance due to brush wear.</p>

        <h2>Brushless DC Motors</h2>
        <p>BLDC motors eliminate brushes by using electronic commutation. They offer higher efficiency, longer lifespan, and better performance, making them increasingly popular in modern applications.</p>

        <h2>Stepper Motors</h2>
        <p>Stepper motors move in discrete steps and are ideal for precise positioning applications. They are commonly used in 3D printers, CNC machines, and automation equipment.</p>

        <h2>Synchronous Motors</h2>
        <p>Synchronous motors rotate at a speed synchronized with the AC line frequency. They are used in applications requiring precise speed control and high power factor.</p>

        <h2>Choosing the Right Motor</h2>
        <p>When selecting a motor, consider factors such as power requirements, speed range, efficiency, maintenance needs, and cost. Each motor type has its strengths and is suited for different applications.</p>
      `
    }
  };

  const post = posts[slug || ''];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container py-20">
          <p className="text-center text-foreground/70">Post not found</p>
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
          <div className="container py-4">
            <Link href="/blog">
              <a className="flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </a>
            </Link>
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
                  <span>{post.date}</span>
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
                className="text-foreground/80 space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
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
      </main>

      <Footer />
    </div>
  );
}
