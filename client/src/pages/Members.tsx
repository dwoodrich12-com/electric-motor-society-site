import { useState, useEffect } from 'react';
import { CheckCircle, Zap, Users, TrendingUp, Heart, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Members() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    country: '',
    donationType: 'monthly'
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
      window.history.replaceState({}, '', '/members');
    }
    if (params.get('canceled') === 'true') {
      setCheckoutCanceled(true);
      window.history.replaceState({}, '', '/members');
    }
  }, []);

  const handleCheckout = async (tierKey: string) => {
    setCheckoutLoading(tierKey);
    try {
      const response = await fetch('/api/stripe/create-member-checkout', {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/forms/member-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', organization: '', country: '', donationType: 'monthly' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const memberTiers = [
    { 
      key: 'monthly',
      amount: '$25/month', 
      name: 'Monthly Member',
      description: 'Flexible monthly support'
    },
    { 
      key: 'quarterly',
      amount: '$100/quarter', 
      name: 'Silver Member',
      description: 'Quarterly contributor',
      featured: true 
    },
    { 
      key: 'yearly',
      amount: '$500/year', 
      name: 'Elite Member',
      description: 'Annual leadership supporter'
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
                <p className="font-semibold">Welcome to Electric Motor Society! Thank you for your membership support.</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Membership</h1>
            <p className="text-lg text-foreground/80 max-w-2xl">
              Join the Electric Motor Society community and stay connected with the latest advancements, events, and opportunities in electric motor technology.
            </p>
          </div>
        </section>

        {/* Who Joins */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Who Joins Electric Motor Society (EMS)?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: 'Engineers & Technicians',
                  description: 'Professionals working with electric motors in design, manufacturing, and testing.'
                },
                {
                  icon: Users,
                  title: 'Researchers & Academics',
                  description: 'Faculty and students advancing motor technology through research and innovation.'
                },
                {
                  icon: TrendingUp,
                  title: 'Business Leaders',
                  description: 'Executives and decision-makers from OEM manufacturers and technology companies.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-secondary/30 p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <item.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Membership Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                'Access to exclusive networking events',
                'Monthly technical webinars and workshops',
                'Industry news and research updates',
                'Discounted conference registration',
                'Member directory and networking portal',
                'Early access to new resources and content',
                'Collaboration opportunities with peers',
                'Special member-only events and dinners'
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Support Our Mission</h2>
            <p className="text-lg text-foreground/80 mb-8 text-center max-w-3xl mx-auto">
              Your membership directly supports our research initiatives, events, and educational programs. Every contribution helps advance the electric motor industry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {memberTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border-2 text-center transition-all ${
                    tier.featured
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border bg-white hover:shadow-lg'
                  }`}
                >
                  {tier.featured && (
                    <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-3">
                      Most Popular
                    </div>
                  )}
                  <p className="text-3xl font-bold text-primary mb-1">{tier.amount}</p>
                  <p className="font-semibold text-foreground mb-1">{tier.name}</p>
                  <p className="text-sm text-foreground/70 mb-4">{tier.description}</p>
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
                      'Join Now'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Participation */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Ways to Participate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Attend Events',
                  description: 'Join our networking events, technical workshops, and annual conferences.'
                },
                {
                  title: 'Share Knowledge',
                  description: 'Present your research or expertise at our events and in our publications.'
                },
                {
                  title: 'Collaborate',
                  description: 'Work with other members on research projects and industry initiatives.'
                },
                {
                  title: 'Volunteer',
                  description: 'Help organize events and support the EMS community.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Signup Form */}
        <section className="section-padding">
          <div className="container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Questions? Get in Touch</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Thank you for your interest!</p>
                <p>We've received your information and will be in touch shortly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/30 p-8 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your country"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
