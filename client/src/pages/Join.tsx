import { Link } from 'wouter';
import { Users, Building2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Join() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">Join Electric Motor Society</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto text-center">
              Choose your path to get involved with the electric motor industry community.
            </p>
          </div>
        </section>

        {/* Member vs Sponsor */}
        <section className="section-padding">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Member Path */}
              <div className="bg-secondary/30 rounded-lg border border-border p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Become a Member</h2>
                <p className="text-foreground/80 mb-6">
                  Join our community of engineers, researchers, and professionals. Get access to events, resources, and networking opportunities.
                </p>
                
                <div className="space-y-3 mb-8">
                  <h3 className="font-semibold text-foreground">Member Benefits:</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✓ Access to exclusive events and webinars</li>
                    <li>✓ Industry news and research updates</li>
                    <li>✓ Networking with peers and experts</li>
                    <li>✓ Member directory access</li>
                    <li>✓ Discounted conference registration</li>
                    <li>✓ Collaboration opportunities</li>
                  </ul>
                </div>

                <Link href="/members">
                  <a className="btn-primary inline-flex items-center justify-center gap-2 w-full">
                    Join as Member <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>

              {/* Sponsor Path */}
              <div className="bg-primary/5 rounded-lg border-2 border-primary p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Become a Sponsor</h2>
                <p className="text-foreground/80 mb-6">
                  Support the electric motor industry and position your organization as a leader. Sponsorship packages tailored to your goals.
                </p>
                
                <div className="space-y-3 mb-8">
                  <h3 className="font-semibold text-foreground">Sponsor Benefits:</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>✓ Brand visibility and recognition</li>
                    <li>✓ Speaking and exhibition opportunities</li>
                    <li>✓ Industry leadership positioning</li>
                    <li>✓ Networking with decision-makers</li>
                    <li>✓ Research collaboration access</li>
                    <li>✓ Custom sponsorship packages</li>
                  </ul>
                </div>

                <Link href="/sponsors">
                  <a className="btn-primary inline-flex items-center justify-center gap-2 w-full">
                    Explore Sponsorship <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* University Collaboration */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">University Collaboration</h2>
              <p className="text-lg text-foreground/80 mb-8">
                Are you from an academic institution? We offer specialized collaboration programs for universities and research labs.
              </p>
              <Link href="/universities">
                <a className="btn-primary inline-flex items-center justify-center gap-2">
                  Learn About University Programs <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Have Questions?</h2>
            <div className="bg-secondary/30 rounded-lg border border-border p-8 text-center">
              <p className="text-lg text-foreground/80 mb-4">
                Our team is here to help you find the right way to get involved with Electric Motor Society.
              </p>
              <p className="text-foreground/80 mb-6">
                Contact us at <a href="mailto:info@electricmotorsociety.com" className="font-semibold text-primary hover:underline">info@electricmotorsociety.com</a>
              </p>
              <p className="text-sm text-foreground/60">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Whether you want to join our community, sponsor our initiatives, or collaborate with universities, we're excited to have you on board.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/members">
                <a className="bg-white text-primary hover:bg-primary-foreground px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center gap-2">
                  Join Now <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/sponsors">
                <a className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center gap-2">
                  Sponsor Us <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
