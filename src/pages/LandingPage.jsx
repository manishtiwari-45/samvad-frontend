import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Star, Award, BookOpen, Clock, Zap, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div 
    className="bg-card p-8 rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
  >
    <motion.div 
      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl text-accent mb-6 group-hover:scale-110 transition-transform duration-300"
      whileHover={{ rotate: 5 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{title}</h3>
    <p className="text-secondary leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Join Clubs",
      description: "Discover and join various student organizations and communities on campus."
    },
    {
      icon: <Calendar size={24} />,
      title: "Track Events",
      description: "Never miss out on important events, workshops, and activities."
    },
    {
      icon: <Star size={24} />,
      title: "Engage",
      description: "Connect with like-minded students and participate in exciting activities."
    },
    {
      icon: <Award size={24} />,
      title: "Earn Recognition",
      description: "Get certificates and recognition for your participation and achievements."
    }
  ];

  const stats = [
    { value: "50+", label: "Active Clubs" },
    { value: "1000+", label: "Students" },
    { value: "200+", label: "Events Monthly" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-background via-background-secondary to-background-tertiary text-primary overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover rounded-3xl flex items-center justify-center shadow-2xl mr-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-primary">StellarHub</h1>
                <p className="text-secondary font-medium">Campus Community Platform</p>
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connect, Engage,{' '}
              <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                Thrive
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-secondary max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your one-stop platform for student organizations, events, and campus engagement. 
              Build connections that last a lifetime.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/auth?mode=login" 
                  className="px-8 py-4 bg-gradient-to-r from-accent to-accent-hover text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 flex items-center justify-center gap-3 min-w-48"
                >
                  Sign In <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/auth?mode=signup" 
                  className="px-8 py-4 border-2 border-border bg-background text-primary font-semibold rounded-2xl hover:bg-background-secondary hover:border-accent/50 transition-all duration-300 flex items-center justify-center gap-3 min-w-48"
                >
                  Create Account
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Features Section */}
        <section className="py-20 md:py-32 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Why Choose StellarHub?</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
                Everything you need to make the most of your campus life in one place
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Get started in just a few simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Create Account</h3>
                <p className="text-secondary">Sign up with your student email to get started</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Join Clubs</h3>
                <p className="text-secondary">Browse and join clubs that match your interests</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Involved</h3>
                <p className="text-secondary">Participate in events and activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent/80 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-4">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm uppercase tracking-wider opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Zap size={16} className="mr-2" /> Ready to get started?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Join StellarHub Today</h2>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              Connect with your campus community, discover opportunities, and make the most of your student life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/auth?mode=register" 
                className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-3 border-2 border-border text-primary font-semibold rounded-lg hover:bg-card transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">StellarHub</h3>
              <p className="text-secondary text-sm">Empowering student communities and enhancing campus engagement through technology.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-secondary hover:text-accent text-sm transition-colors">About Us</Link></li>
                <li><Link to="/clubs" className="text-secondary hover:text-accent text-sm transition-colors">Browse Clubs</Link></li>
                <li><Link to="/events" className="text-secondary hover:text-accent text-sm transition-colors">Upcoming Events</Link></li>
                <li><Link to="/contact" className="text-secondary hover:text-accent text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-secondary hover:text-accent text-sm transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="text-secondary hover:text-accent text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-secondary hover:text-accent text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/faq" className="text-secondary hover:text-accent text-sm transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div className="mt-8">
                <p className="text-sm text-secondary">Subscribe to our newsletter</p>
                <form className="mt-2 sm:flex">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 border border-border rounded-md text-base text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background"
                    placeholder="Enter your email"
                  />
                  <div className="mt-2 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-secondary text-center">&copy; {new Date().getFullYear()} StellarHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
