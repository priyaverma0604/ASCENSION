import React, { useState, useContext } from 'react';
import { Mail, Phone, MapPin, CheckCircle, MessageSquare, Compass } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { name, email, phone, message };
      const { data } = await axios.post('/api/contacts', payload);
      if (data.success) {
        setSuccess(true);
        setMessage('');
        setPhone('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send query');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto flex flex-col gap-10 sm:gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Connect With Us</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide text-charcoal-dark leading-tight">
            Reach Out to Ascension
          </h1>
          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed">
            Whether you want to schedule a distance Theta healing session, inquire about programs, ask about retreats, or volunteer for our Seva campaigns, we are here to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Left: Contact Info & Details */}
          <div className="flex flex-col gap-6 text-left">
            
            {/* Serene Sanctuary Space Image */}
            <div className="w-full h-52 rounded-[24px] overflow-hidden bg-cream border border-cream-dark/50 shadow-sm group">
              <img 
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80" 
                alt="Ascension Healing Sanctuary Hauz Khas" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>

            {/* Cards */}
            <div className="glass p-6 rounded-2xl border border-cream-dark/50 flex flex-col gap-5 text-charcoal text-xs">
              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider mb-2">
                Sanctuary Coordinates
              </h3>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[10px] text-charcoal-light uppercase">Location Address</span>
                  <span className="leading-relaxed">K-30A, Hauz Khas Enclave, New Delhi - 110016</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[10px] text-charcoal-light uppercase">WhatsApp / Call</span>
                  <a href="tel:+918929061557" className="hover:text-gold transition-colors font-medium">+91 89290 61557</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[10px] text-charcoal-light uppercase">Email Support</span>
                  <a href="mailto:ascension.sonalibhasin@gmail.com" className="hover:text-gold transition-colors font-medium">ascension.sonalibhasin@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call banner */}
            <div className="glass p-5 rounded-2xl border border-sage/30 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-sage" />
                <span className="text-xs font-bold text-charcoal-dark uppercase tracking-wide">Direct WhatsApp Chat</span>
              </div>
              <a
                href="https://wa.me/918929061557?text=Hi%20Sonali,%20I'd%20like%20to%20inquire%20about%20your%20spiritual%20healing%20services."
                target="_blank"
                rel="noreferrer"
                className="bg-sage hover:bg-sage-dark text-white text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl shadow-sm transition-all duration-300"
              >
                Chat Now
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="https://www.instagram.com/ascension_sonalibhasinkumar/" target="_blank" rel="noreferrer" className="p-2.5 bg-cream hover:bg-cream-dark border border-cream-dark/60 rounded-xl transition-colors text-charcoal hover:text-gold" title="Instagram">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/sonali.kumar.102" target="_blank" rel="noreferrer" className="p-2.5 bg-cream hover:bg-cream-dark border border-cream-dark/60 rounded-xl transition-colors text-charcoal hover:text-gold" title="Facebook">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/@ascensionmeditations7775" target="_blank" rel="noreferrer" className="p-2.5 bg-cream hover:bg-cream-dark border border-cream-dark/60 rounded-xl transition-colors text-charcoal hover:text-gold" title="YouTube">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/sonali-bhasin-kumar-a319301a8/" target="_blank" rel="noreferrer" className="p-2.5 bg-cream hover:bg-cream-dark border border-cream-dark/60 rounded-xl transition-colors text-charcoal hover:text-gold" title="LinkedIn">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/></svg>
              </a>
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-cream-dark/50">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider text-left border-b border-cream-dark pb-2 mb-6">
              Send a Query
            </h3>

            {success ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
                <CheckCircle className="w-12 h-12 text-sage animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-charcoal-dark">Query Logged!</h4>
                <p className="text-xs text-charcoal-light leading-relaxed px-4">
                  Blessings! Your query has been logged. An email notification has been dispatched to Sonali, and we will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-8 rounded-xl text-xs uppercase tracking-wider mt-4"
                >
                  Write Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs text-left text-charcoal">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Message / Inquiry</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Write your questions or notes here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider mt-2"
                >
                  {submitting && <Compass className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
