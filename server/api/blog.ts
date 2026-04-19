import { Router, Request, Response } from 'express';

const router = Router();

// Blog posts data - in production, this would come from a database or CMS
const blogPosts = [
  {
    slug: 'welcome-to-ems',
    title: 'Welcome to Electric Motor Society',
    excerpt: 'Introducing the Electric Motor Society — a professional community dedicated to advancing electric motor technology and connecting industry leaders.',
    date: '2026-04-18',
    author: 'Electric Motor Society',
    category: 'News',
    featured: true,
    image: '/assets/ems-logo.webp',
    keywords: ['electric motor association', 'professional organization', 'motor engineering'],
    content: `
      <h2>A New Era for Electric Motor Professionals</h2>
      <p>We are thrilled to announce the official launch of the Electric Motor Society (EMS) — a professional membership organization dedicated to advancing electric motor technology, fostering industry collaboration, and supporting the engineers, researchers, and companies that power our world.</p>

      <h2>Our Mission</h2>
      <p>The Electric Motor Society exists to accelerate innovation in electric motor technology through research collaboration, professional development, and industry networking. As the world transitions to electric transportation and sustainable energy systems, the importance of efficient, reliable electric motors has never been greater.</p>

      <h2>What We Offer</h2>
      <p>EMS provides a comprehensive platform for electric motor professionals:</p>
      <ul>
        <li><strong>Research Collaboration:</strong> Connect with universities and research institutions working on next-generation motor technologies</li>
        <li><strong>Industry Networking:</strong> Join a community of motor engineers, designers, and manufacturers</li>
        <li><strong>Technical Resources:</strong> Access technical papers, standards guidance, and best practices</li>
        <li><strong>Professional Development:</strong> Participate in workshops, webinars, and certification programs</li>
        <li><strong>Advocacy:</strong> Help shape industry standards and policy discussions</li>
      </ul>

      <h2>Join Us</h2>
      <p>Whether you're an individual engineer, a startup developing new motor technologies, or a Fortune 500 company looking to lead industry innovation, EMS welcomes you. Together, we can drive the future of electric motor technology.</p>

      <p>Visit our <a href="/members">membership page</a> to learn about joining, or explore <a href="/sponsors">sponsorship opportunities</a> for organizations looking to make a significant impact.</p>
    `
  },
  {
    slug: 'state-of-electric-motors-2026',
    title: 'The State of Electric Motors in 2026',
    excerpt: 'An industry overview of electric motor technology trends, market growth, and emerging innovations shaping the future of electrification.',
    date: '2026-04-15',
    author: 'Electric Motor Society',
    category: 'Industry',
    featured: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    keywords: ['electric motor industry', 'motor technology trends', 'EV motors', 'industrial motors'],
    content: `
      <h2>A Transformative Year for Electric Motors</h2>
      <p>2026 marks a pivotal year for the electric motor industry. Global electrification efforts, advancing battery technology, and increasing efficiency standards are driving unprecedented growth and innovation in motor technology.</p>

      <h2>Market Overview</h2>
      <p>The global electric motor market continues its strong growth trajectory:</p>
      <ul>
        <li>Market size exceeding $180 billion globally</li>
        <li>EV motor segment growing at 25%+ annually</li>
        <li>Industrial motor efficiency upgrades driving replacement cycle</li>
        <li>HVAC sector transitioning to high-efficiency motors</li>
      </ul>

      <h2>Key Technology Trends</h2>
      <h3>1. Higher Power Density</h3>
      <p>Advances in materials and cooling systems are enabling motors that deliver more power in smaller packages. Silicon carbide (SiC) inverters and advanced thermal management are key enablers.</p>

      <h3>2. Integrated Motor-Drive Units</h3>
      <p>The integration of motors, inverters, and gearboxes into single units is reducing complexity, weight, and cost while improving efficiency.</p>

      <h3>3. Permanent Magnet Alternatives</h3>
      <p>Supply chain concerns around rare earth magnets are driving development of switched reluctance and induction motor alternatives that reduce or eliminate rare earth dependency.</p>

      <h3>4. Software-Defined Performance</h3>
      <p>Advanced control algorithms and over-the-air updates are enabling continuous motor performance optimization throughout the product lifecycle.</p>

      <h2>Looking Ahead</h2>
      <p>The electric motor industry is positioned for continued growth as electrification expands across transportation, industrial, and consumer applications. EMS is committed to supporting this growth through research collaboration, professional development, and industry networking.</p>
    `
  },
  {
    slug: 'why-join-professional-motor-association',
    title: 'Why Join a Professional Motor Association',
    excerpt: 'Discover the career and business benefits of joining a professional organization like the Electric Motor Society.',
    date: '2026-04-12',
    author: 'Electric Motor Society',
    category: 'Membership',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    keywords: ['professional association', 'motor engineering career', 'networking', 'professional development'],
    content: `
      <h2>The Value of Professional Community</h2>
      <p>In a rapidly evolving field like electric motor technology, staying connected to peers, research, and industry trends is essential for career growth and business success. Professional associations provide a structured way to maintain these connections.</p>

      <h2>Benefits for Individual Engineers</h2>
      <ul>
        <li><strong>Career Advancement:</strong> Access to job boards, mentorship programs, and professional certifications</li>
        <li><strong>Technical Knowledge:</strong> Stay current with latest research, standards, and best practices</li>
        <li><strong>Networking:</strong> Connect with peers across companies and specializations</li>
        <li><strong>Visibility:</strong> Present at conferences, contribute to publications, build reputation</li>
        <li><strong>Resources:</strong> Discounts on training, conferences, and technical resources</li>
      </ul>

      <h2>Benefits for Companies</h2>
      <ul>
        <li><strong>Talent Access:</strong> Recruit from a pool of engaged, committed professionals</li>
        <li><strong>Industry Influence:</strong> Participate in standards development and policy discussions</li>
        <li><strong>Research Partnerships:</strong> Connect with universities and research institutions</li>
        <li><strong>Brand Visibility:</strong> Sponsorship and speaking opportunities</li>
        <li><strong>Competitive Intelligence:</strong> Stay informed on industry trends and competitor activities</li>
      </ul>

      <h2>Why EMS?</h2>
      <p>The Electric Motor Society is specifically focused on electric motor technology — not a broad engineering association where motors are a small subtopic. This focus means:</p>
      <ul>
        <li>Every member shares your specific professional interest</li>
        <li>Events and resources are deeply relevant to your work</li>
        <li>You're connecting with true peers, not adjacent fields</li>
        <li>Your voice has greater impact in a focused community</li>
      </ul>

      <p>Ready to join? Visit our <a href="/members">membership page</a> to get started.</p>
    `
  },
  {
    slug: 'ems-research-priorities-2026',
    title: 'EMS Research Priorities for 2026-2027',
    excerpt: 'Outlining the key research areas the Electric Motor Society is focused on advancing through collaboration and funding.',
    date: '2026-04-10',
    author: 'Electric Motor Society',
    category: 'Research',
    featured: true,
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    keywords: ['motor research', 'electric motor R&D', 'university research', 'motor efficiency'],
    content: `
      <h2>Driving Innovation Through Focused Research</h2>
      <p>The Electric Motor Society is committed to advancing motor technology through strategic research initiatives. Our research priorities for 2026-2027 focus on the most impactful areas for industry advancement.</p>

      <h2>Priority 1: Ultra-High Efficiency Motors</h2>
      <p>Pushing motor efficiency beyond current limits through:</p>
      <ul>
        <li>Advanced magnetic materials and geometries</li>
        <li>Optimized winding techniques and configurations</li>
        <li>Integrated thermal management systems</li>
        <li>Loss reduction at the inverter-motor interface</li>
      </ul>

      <h2>Priority 2: Rare Earth Reduction</h2>
      <p>Reducing dependency on rare earth materials through:</p>
      <ul>
        <li>Advanced switched reluctance motor designs</li>
        <li>Ferrite magnet optimization</li>
        <li>Hybrid motor architectures</li>
        <li>Recycling and recovery technologies</li>
      </ul>

      <h2>Priority 3: Manufacturing Innovation</h2>
      <p>Improving manufacturing efficiency and quality through:</p>
      <ul>
        <li>Automated winding and assembly techniques</li>
        <li>Additive manufacturing for complex geometries</li>
        <li>In-line quality inspection systems</li>
        <li>Supply chain optimization</li>
      </ul>

      <h2>Priority 4: Motor-System Integration</h2>
      <p>Optimizing the motor within the larger system through:</p>
      <ul>
        <li>Integrated motor-inverter-gearbox units</li>
        <li>Vehicle-level efficiency optimization</li>
        <li>Predictive maintenance and diagnostics</li>
        <li>Software-defined performance tuning</li>
      </ul>

      <h2>University Partnerships</h2>
      <p>EMS is actively seeking university partners for collaborative research. If your institution is working in these areas, visit our <a href="/universities">university partnership page</a> to connect with us.</p>

      <h2>Sponsor Research</h2>
      <p>Companies interested in funding or participating in these research initiatives can explore our <a href="/sponsors">sponsorship opportunities</a>.</p>
    `
  },
  {
    slug: 'bldc-motors-guide',
    title: 'Guide to Brushless DC Motors',
    excerpt: 'Learn about BLDC motor technology, advantages, applications, and how they compare to traditional brushed motors.',
    date: '2026-03-12',
    author: 'Electric Motor Society',
    category: 'Technology',
    featured: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    keywords: ['BLDC motors', 'brushless DC motors', 'motor technology', 'electronic commutation'],
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
  {
    slug: 'ecm-motors-efficiency',
    title: 'ECM Motors: Efficiency and Control',
    excerpt: 'Explore electronically commutated motors and how advanced control systems enable variable speed operation and energy savings.',
    date: '2026-03-30',
    author: 'Electric Motor Society',
    category: 'Efficiency',
    featured: false,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    keywords: ['ECM motors', 'motor efficiency', 'variable speed motors', 'HVAC motors'],
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
  }
];

// Get all posts (for listing)
router.get('/posts', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const featured = req.query.featured === 'true';
  const limit = parseInt(req.query.limit as string) || undefined;

  let filtered = [...blogPosts];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (featured) {
    filtered = filtered.filter(p => p.featured);
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  // Return without full content for listing
  const posts = filtered.map(({ content, ...rest }) => rest);

  res.json({ posts });
});

// Get single post (full content)
router.get('/posts/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ post });
});

// Get categories
router.get('/categories', (req: Request, res: Response) => {
  const categories = [...new Set(blogPosts.map(p => p.category))];
  res.json({ categories });
});

// Generate sitemap data for blog posts
router.get('/sitemap', (req: Request, res: Response) => {
  const baseUrl = 'https://electricmotorsociety.com';
  const urls = blogPosts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: post.featured ? 0.8 : 0.6
  }));

  res.json({ urls });
});

export default router;
