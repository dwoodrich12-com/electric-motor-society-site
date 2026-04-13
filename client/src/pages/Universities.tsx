import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Universities() {
  const [formData, setFormData] = useState({
    university: '',
    department: '',
    contact: '',
    email: '',
    region: '',
    collaborationType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/forms/university-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ university: '', department: '', contact: '', email: '', region: '', collaborationType: '', message: '' });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">University Collaboration</h1>
                <p className="text-lg text-foreground/80">
                  Partner with Electric Motor Society to advance motor technology research, education, and innovation through industry-academic collaboration.
                </p>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/ems-university-dtfjXPpXc4hpb44BeFnA8o.webp"
                  alt="University Research Lab"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Collaborate */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Why Collaborate with Electric Motor Society (EMS)?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Industry Connections',
                  description: 'Connect your research with leading manufacturers and OEM partners for real-world applications.'
                },
                {
                  title: 'Funding Opportunities',
                  description: 'Access research grants and sponsorship support for motor technology projects.'
                },
                {
                  title: 'Student Engagement',
                  description: 'Provide internship and career opportunities for students in the electric motor industry.'
                },
                {
                  title: 'Knowledge Exchange',
                  description: 'Share research findings and collaborate on cutting-edge motor technology development.'
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

        {/* Sample Project Types */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Sample Project Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'BLDC Motor Optimization',
                  description: 'Research and development of high-efficiency brushless DC motors for various applications.'
                },
                {
                  title: 'Control Systems',
                  description: 'Advanced control algorithms and electronics for motor speed and torque management.'
                },
                {
                  title: 'Thermal Analysis',
                  description: 'Thermal modeling and cooling solutions for high-performance motor applications.'
                },
                {
                  title: 'Materials Research',
                  description: 'Development of advanced materials for motor components and windings.'
                },
                {
                  title: 'Energy Efficiency',
                  description: 'Optimization of motor efficiency and power consumption reduction.'
                },
                {
                  title: 'EV Propulsion',
                  description: 'Electric motor systems for vehicle propulsion and electrification projects.'
                }
              ].map((project, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-primary mb-2">{project.title}</h3>
                  <p className="text-foreground/70">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Support Is Used */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">How University Support Is Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Research Grants',
                  description: 'Funding for motor technology research projects and student scholarships.'
                },
                {
                  title: 'Equipment & Resources',
                  description: 'Support for laboratory equipment, testing facilities, and development resources.'
                },
                {
                  title: 'Networking Events',
                  description: 'Industry conferences, workshops, and collaboration opportunities for faculty and students.'
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

        {/* University Interest Form */}
        <section className="section-padding bg-secondary/30">
          <div className="container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">University Interest Form</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Thank you for your interest!</p>
                <p>We'll be in touch to discuss collaboration opportunities.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">University Name *</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your university name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Department/Lab *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Department or laboratory name"
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Collaboration Type</label>
                <select
                  name="collaborationType"
                  value={formData.collaborationType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select collaboration type</option>
                  <option value="research">Research Partnership</option>
                  <option value="internship">Internship Program</option>
                  <option value="funding">Research Funding</option>
                  <option value="equipment">Equipment Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your research interests and collaboration goals..."
                />
              </div>

              <button type="submit" className="w-full btn-primary">
                Submit Interest Form
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
