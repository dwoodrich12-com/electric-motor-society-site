import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
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
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Limit to 10MB
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add file if present
      if (file) {
        submitData.append('file', file);
      }

      const response = await fetch('/api/forms/motor-quote', {
        method: 'POST',
        body: submitData // No Content-Type header - browser sets it with boundary
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
          message: ''
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
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
                  src="https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Electric motor engineering"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">
                <p className="font-semibold">Quote request submitted!</p>
                <p>We'll review your requirements and connect you with the right experts.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-secondary/30 p-8 rounded-lg border border-border">
              {/* Contact Info Section */}
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                <div className="mt-4">
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
              </div>

              {/* Motor Specifications Section */}
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Motor Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Motor Type</label>
                    <select
                      name="motorType"
                      value={formData.motorType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select motor type</option>
                      <option value="ac-induction">AC Induction Motor</option>
                      <option value="brushless-dc">Brushless DC Motor</option>
                      <option value="permanent-magnet">Permanent Magnet Motor</option>
                      <option value="stepper">Stepper Motor</option>
                      <option value="servo">Servo Motor</option>
                      <option value="synchronous">Synchronous Motor</option>
                      <option value="other">Other / Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Power Rating</label>
                    <input
                      type="text"
                      name="powerRating"
                      value={formData.powerRating}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 10 kW, 50 HP"
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
                      placeholder="e.g., 240V AC, 48V DC"
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
                      placeholder="e.g., 1500-3000 RPM"
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
                    placeholder="Torque requirements, efficiency targets, environmental conditions, certifications needed..."
                  />
                </div>
              </div>

              {/* Additional Info Section */}
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Additional Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Message / Project Details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your project, timeline, quantity requirements..."
                  />
                </div>

                {/* File Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Attach Specifications (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                    />
                    {!file ? (
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-foreground/50" />
                        <p className="text-foreground/70">
                          <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-foreground/50 mt-1">PDF, DOC, XLS, images up to 10MB</p>
                      </label>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-foreground/50">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary flex items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </button>
            </form>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Submit Request',
                  description: 'Fill out your motor specifications and requirements.'
                },
                {
                  step: '2',
                  title: 'Expert Review',
                  description: 'Our network reviews your request and matches you with specialists.'
                },
                {
                  step: '3',
                  title: 'Receive Quotes',
                  description: 'Get competitive quotes from qualified motor suppliers.'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
