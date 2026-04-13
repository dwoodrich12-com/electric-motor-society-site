import { Link } from 'wouter';
import { ArrowRight, Zap, Users, Target, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 hero-gradient overflow-hidden">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  Innovative Solutions for Electric Motor Technology
                </h1>
                <p className="text-lg text-foreground/80">
                  Join us for the latest advancements in electric motor technology, including innovations in BLDC, fan motors, gear motors, and stepper motors, as well as exciting events and networking opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/join">
                    <a className="btn-primary inline-flex items-center justify-center gap-2">
                      Join the Community <ArrowRight className="w-4 h-4" />
                    </a>
                  </Link>
                  <Link href="/sponsors">
                    <a className="btn-secondary inline-flex items-center justify-center gap-2">
                      Become a Sponsor <ArrowRight className="w-4 h-4" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663421992935/mFHKDo73JJ655LVTBdqMS7/ems-hero-oKDaDLoEcTWfGiovxTxkxW.webp"
                  alt="Electric Motor Cross-Section"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Who We Are</h2>
              <p className="text-lg text-foreground/80">
                Electric Motor Society is a community dedicated to advancing the electric motor industry through innovation, collaboration, and knowledge sharing. We bring together professionals, engineers, manufacturers, and enthusiasts to drive the future of motor technology.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">Who We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Industry Professionals',
                  description: 'Engineers, designers, and manufacturers working with electric motors across all sectors.'
                },
                {
                  icon: BookOpen,
                  title: 'Academic Institutions',
                  description: 'Universities and research labs advancing motor technology and education.'
                },
                {
                  icon: Zap,
                  title: 'OEM Partners',
                  description: 'Companies developing innovative motor solutions and applications.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <item.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-foreground/80 mb-4">
                To advance the electric motor industry through:
              </p>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span><strong>Knowledge Sharing:</strong> Facilitating the exchange of technical expertise and best practices</span>
                </li>
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span><strong>Collaboration:</strong> Connecting industry, academia, and innovators to solve challenges</span>
                </li>
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span><strong>Innovation:</strong> Supporting research and development of next-generation motor technologies</span>
                </li>
                <li className="flex gap-3">
                  <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span><strong>Networking:</strong> Building a vibrant community of professionals and enthusiasts</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Motors Matter */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Electric Motors Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Global Impact</h3>
                <p className="text-primary-foreground/90">
                  Electric motors power everything from industrial machinery to electric vehicles. As the world transitions to sustainable energy, motor technology is more critical than ever.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Innovation Frontier</h3>
                <p className="text-primary-foreground/90">
                  BLDC motors, stepper motors, ECM technology, and advanced control systems are revolutionizing efficiency, performance, and sustainability across industries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Ready to Get Involved?</h2>
              <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                Whether you're looking to join our community, sponsor our initiatives, or collaborate with universities, we have opportunities for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join">
                  <a className="btn-primary inline-flex items-center justify-center gap-2">
                    Become a Member <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
                <Link href="/sponsors">
                  <a className="btn-secondary inline-flex items-center justify-center gap-2">
                    Sponsor Us <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
                <Link href="/universities">
                  <a className="btn-secondary inline-flex items-center justify-center gap-2">
                    University Collaboration <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
