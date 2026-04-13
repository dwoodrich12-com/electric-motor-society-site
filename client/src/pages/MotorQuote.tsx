import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MotorQuote() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    motorType: '',
    powerRating: '',
    voltage: '',
    speed: '',
    specifications: '',
    message: '',
    fileName: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/forms/motor-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          organization: '',
          motorType: '',
          powerRating: '',
          voltage: '',
          speed: '',
          specifications: '',
          message: '',
          fileName: ''
        });
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
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Motor Quote Request</h1>
                <p className="text-lg text-foreground/80">
                  Get a professional quote for your custom electric motor requirements. Provide your specifications and we'll connect you with industry experts.
                </p>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/ems-motor-diagram-iJtkqP7pkBQmKL95S4DV7o.webp"
                  alt="Motor Types Diagram"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is Motor Quote */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">What is Motor Quote?</h2>
            <div className="space-y-4 text-foreground/80">
              <p>
                The Motor Quote service connects you with electric motor specialists and manufacturers who can provide customized solutions for your specific application requirements.
              </p>
              <p>
                Whether you need a BLDC motor for a drone, a stepper motor for precision equipment, a fan motor for HVAC systems, or a custom solution for industrial applications, our network of experts can help.
              </p>
              <p>
                Simply submit your specifications, drawings, or requirements, and we'll match you with qualified manufacturers and engineers who can provide detailed quotes and technical support.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Submit Request',
                  description: 'Fill out the form with your motor specifications and requirements.'
                },
                {
                  step: '2',
                  title: 'Review & Match',
                  description: 'We review your request and match you with qualified manufacturers.'
                },
                {
                  step: '3',
                  title: 'Receive Quotes',
                  description: 'Get detailed quotes and technical proposals from industry experts.'
                },
                {
                  step: '4',
                  title: 'Collaborate',
                  description: 'Work directly with manufacturers to finalize your custom motor solution.'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Motor Quote Form */}
        <section className="section-padding">
          <div className="container max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Request a Motor Quote</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Thank you for your quote request!</p>
                <p>We've received your submission and will connect you with qualified manufacturers shortly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/30 p-8 rounded-lg border border-border">
              {/* Contact Information */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    <label className="block text-sm font-semibold text-foreground mb-2">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your company or organization"
                    />
                  </div>
                </div>
              </div>

              {/* Motor Specifications */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Motor Specifications</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Motor Type *</label>
                  <select
                    name="motorType"
                    value={formData.motorType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select motor type</option>
                    <option value="bldc">BLDC (Brushless DC)</option>
                    <option value="stepper">Stepper Motor</option>
                    <option value="gear">Gear Motor</option>
                    <option value="fan">Fan Motor</option>
                    <option value="ecm">ECM (Electronically Commutated)</option>
                    <option value="ac-induction">AC Induction</option>
                    <option value="dc-brushed">DC Brushed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Power Rating</label>
                    <input
                      type="text"
                      name="powerRating"
                      value={formData.powerRating}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 5 kW, 500 W"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voltage</label>
                    <input
                      type="text"
                      name="voltage"
                      value={formData.voltage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 48V DC, 230V AC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Speed (RPM)</label>
                    <input
                      type="text"
                      name="speed"
                      value={formData.speed}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 3000, 5000"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">Additional Specifications</label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Torque, efficiency, mounting type, cooling requirements, etc."
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Drawings & Documentation</h3>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.dwg,.step,.iges"
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-foreground/60">
                      PDF, PNG, JPG, DWG, STEP, IGES (Max 10MB)
                    </p>
                  </label>
                </div>

                {formData.fileName && (
                  <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-md p-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">{formData.fileName}</span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Additional Notes</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your application, timeline, budget, or any special requirements..."
                />
              </div>

              <button type="submit" className="w-full btn-primary">
                Submit Quote Request
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
