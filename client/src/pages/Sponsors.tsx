import { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Sponsors() {
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    region: '',
    interestType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutCanceled, setCheckoutCanceled] = useState(false);

  // Check URL params for checkout result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setCheckoutSuccess(true);
      window.history.replaceState({}, '', '/sponsors');
    }
    if (params.get('canceled') === 'true') {
      setCheckoutCanceled(true);
      window.history.replaceState({}, '', '/sponsors');
    }
  }, []);

  const handleCheckout = async (tierKey: string) => {
    setCheckoutLoading(tierKey);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierKey })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        alert('Unable to start checkout. Please contact us directly.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please contact us directly.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/forms/sponsor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ company: '', contact: '', email: '', phone: '', region: '', interestType: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const sponsorshipTiers = [
    {
      key: 'supporting',
      name: 'Supporting Sponsor',
      price: '$2,500/month',
      commitment: '12-month commitment',
      benefits: [
        'Company logo on website',
        'Social media recognition',
        'Event invitations',
        'Newsletter mention'
      ]
    },
    {
      key: 'strategic',
      name: 'Strategic Sponsor',
      price: '$5,000/month',
      commitment: '12-month commitment',
      benefits: [
        'All Supporting Sponsor benefits',
        'Speaking opportunity at event',
        'Quarterly newsletter feature',
        'Co-branded content',
        'Priority sponsor placement'
      ],
      featured: true
    },
    {
      key: 'flagship',
      name: 'Flagship Sponsor',
      price: '$7,500/month',
      commitment: '12-month commitment',
      benefits: [
        'All Strategic Sponsor benefits',
        'Premium placement across EMS materials',
        'Priority collaboration discussions',
        'Custom sponsorship package',
        'Executive networking access'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Success/Cancel Messages */}
        {checkoutSuccess && (
          <div className="bg-green-50 border-b border-green-200 py-4">
            <div className="container">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <p className="font-semibold">Thank you for becoming an EMS sponsor! We'll be in touch shortly with next steps.</p>
              </div>
            </div>
          </div>
        )}
        {checkoutCanceled && (
          <div className="bg-yellow-50 border-b border-yellow-200 py-4">
            <div className="container">
              <p className="text-yellow-800">Checkout was canceled. Feel free to try again or contact us with questions.</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Sponsorship Opportunities</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">
              Partner with Electric Motor Society to support innovation, research, and community building in the electric motor industry.
            </p>
          </div>
        </section>

        {/* Why Sponsor */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Why Sponsor Electric Motor Society (EMS)?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Industry Leadership',
                  description: 'Position your organization as a leader in electric motor innovation and technology.'
                },
                {
                  title: 'Networking Access',
                  description: 'Connect with engineers, researchers, manufacturers, and decision-makers in the industry.'
                },
                {
                  title: 'Brand Visibility',
                  description: 'Gain exposure through events, website, social media, and industry publications.'
                },
                {
                  title: 'Research Collaboration',
                  description: 'Collaborate with academic institutions on cutting-edge motor technology research.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-secondary/30 p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Donations Are Used */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">How Your Support Is Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Events & Conferences',
                  description: 'Hosting networking events, technical workshops, and annual conferences.'
                },
                {
                  title: 'Research Initiatives',
                  description: 'Supporting university research projects and technology development.'
                },
                {
                  title: 'Community Resources',
                  description: 'Creating educational content, technical resources, and industry insights.'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Sponsorship Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sponsorshipTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border-2 p-8 transition-all ${
                    tier.featured
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border bg-white hover:shadow-lg'
                  }`}
                >
                  {tier.featured && (
                    <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-primary mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">{tier.price}</p>
                  <p className="text-sm text-foreground/60 mb-6">{tier.commitment}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex gap-2 items-start">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    onClick={() => handleCheckout(tier.key)}
                    disabled={checkoutLoading === tier.key}
                  >
                    {checkoutLoading === tier.key ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Become a Sponsor'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OEM Partner Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">OEM Partners</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-foreground/80 mb-6">
                We partner with leading OEM manufacturers and industry organizations to showcase innovative motor solutions and drive industry advancement. Strategic sponsors receive custom partnership packages tailored to their business objectives.
              </p>
              <div className="bg-white border border-border rounded-lg p-8">
                <h3 className="text-xl font-semibold text-primary mb-4">Featured OEM Partners</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-foreground/60">
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                  <div className="py-4 border border-border rounded">Partner Logo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor Inquiry Form */}
        <section className="section-padding">
          <div className="container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Sponsor Inquiry Form</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Thank you for your inquiry!</p>
                <p>We'll be in touch shortly to discuss sponsorship opportunities.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/30 p-8 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Contact Name *</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Region</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select region</option>
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Interest Type</label>
                  <select
                    name="interestType"
                    value={formData.interestType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select interest</option>
                    <option value="supporting-sponsor">Supporting Sponsor</option>
                    <option value="industry-partner">Industry Partner</option>
                    <option value="strategic-sponsor">Strategic Sponsor</option>
                    <option value="oem">OEM Partnership</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your sponsorship interests..."
                />
              </div>

              <button type="submit" className="w-full btn-primary">
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
