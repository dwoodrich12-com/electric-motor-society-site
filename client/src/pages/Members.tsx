import { useState } from 'react';
import { CheckCircle, Zap, Users, TrendingUp, Heart } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
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

        {/* Donations Section */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Support Our Mission</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-foreground/80 mb-8 text-center">
                Your donations directly support our research initiatives, events, and educational programs. Every contribution helps advance the electric motor industry.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { amount: '$25/month', description: 'Monthly supporter' },
                  { amount: '$100/month', description: 'Monthly contributor', featured: true },
                  { amount: '$500/month', description: 'Leadership supporter' }
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-lg border-2 text-center transition-all ${
                      tier.featured
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:shadow-lg'
                    }`}
                  >
                    <p className="text-3xl font-bold text-primary mb-2">{tier.amount}</p>
                    <p className="text-foreground/70">{tier.description}</p>
                  </div>
                ))}
              </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Join EMS Today</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Welcome to Electric Motor Society!</p>
                <p>We've received your signup. Check your email for next steps.</p>
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

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Donation Type</label>
                <select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="monthly">Monthly Recurring</option>
                  <option value="annual">Annual Recurring</option>
                  <option value="custom">Custom Support Level</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-900">
                  <Heart className="w-4 h-4 inline mr-2" />
                  After signup, you'll be directed to complete your support using Stripe. PayPal is not used for EMS site payments.
                </p>
              </div>

              <button type="submit" className="w-full btn-primary">
                Sign Up & Donate
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
