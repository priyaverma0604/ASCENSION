import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Compass } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-cream-dark/40 pt-16 pb-8 border-t border-cream-dark/60 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand & Story */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <img src={logo} alt="Ascension by Sonali Bhasin Kumar" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-xs text-charcoal-light leading-relaxed font-sans mt-2">
            At Ascension, we help you reconnect with your inner light. Founded by Sonali Bhasin Kumar, we guide you to release emotional blocks, raise your vibration, and manifest your soul's deepest desires.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark">
            Healing & Community
          </h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/about" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">About Sonali</Link>
            <Link to="/services" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Healing Services</Link>
            <Link to="/programs" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Wellness Programs</Link>
            <Link to="/ngo" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Ascension Seva NGO</Link>
            <Link to="/community" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Community Feed</Link>
          </div>
        </div>

        {/* E-Commerce Categories */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark">
            Spiritual Shop
          </h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/shop?category=Crystals" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Gemstone Crystals</Link>
            <Link to="/shop?category=Selenite Products" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Selenite Products</Link>
            <Link to="/shop?category=Candles" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Intention Candles</Link>
            <Link to="/shop?category=Crystal Trees" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Gemstone Trees</Link>
            <Link to="/shop?category=Bracelets" className="text-xs text-charcoal-light hover:text-gold transition-colors duration-200">Healing Bracelets</Link>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-dark">
            Connect
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 text-xs text-charcoal-light">
              <MapPin className="w-4 h-4 text-sage shrink-0" />
              <span>K-30A, Hauz Khas Enclave, New Delhi - 110016</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal-light">
              <Phone className="w-4 h-4 text-sage shrink-0" />
              <a href="tel:+919818577751" className="hover:text-gold transition-colors">+91 98185 77751</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal-light">
              <Mail className="w-4 h-4 text-sage shrink-0" />
              <a href="mailto:ascension.sonalibhasin@gmail.com" className="hover:text-gold transition-colors">ascension.sonalibhasin@gmail.com</a>
            </div>
          </div>

          {/* Newsletter Input */}
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Join our Newsletter..."
              required
              className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 pr-10 text-xs text-charcoal focus:outline-none focus:border-sage transition-all duration-300 font-sans"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-sage hover:bg-sage-dark text-white rounded-lg p-1.5 transition-colors duration-200"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
          {subscribed && (
            <p className="text-[10px] text-sage font-semibold animate-pulse">
              Blessings! You have subscribed successfully.
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 my-8 border-t border-cream-dark/60"></div>

      {/* Bottom Info & Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-4 font-sans">
        <p className="text-[10px] text-charcoal-light/70 leading-relaxed text-center italic">
          Disclaimer: Spiritual healing modalities, workshops, and products provided on this platform are complementary practices and should not be used as a substitute for professional medical advice, clinical diagnosis, or psychological treatment. Please consult a qualified practitioner for physical/mental conditions.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-sage/80 mt-2 gap-4">
          <p>© {new Date().getFullYear()} Ascension by Sonali Bhasin Kumar. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/ascension_sonalibhasinkumar/" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Instagram</a>
            <a href="https://www.facebook.com/sonali.kumar.102" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Facebook</a>
            <a href="https://www.youtube.com/@ascensionmeditations7775" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">YouTube</a>
            <a href="https://www.linkedin.com/in/sonali-bhasin-kumar-a319301a8/" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
