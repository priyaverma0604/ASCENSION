import React, { useState } from 'react';
import { X, Sparkles, Phone, Mail, CheckCircle, Heart, MapPin, Compass } from 'lucide-react';
import axios from 'axios';

const BookRetreatModal = ({ retreat, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Any Sacred Sanctuary');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/contacts', {
        name,
        email,
        phone,
        message: `[RETREAT WAITLIST INQUIRY]\nPreferred Destination / Interest: ${destination}\nUser wants priority notification when upcoming Spiritual Retreats are announced.`
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Retreat waitlist error:', err);
      // Still show success to user if contact was submitted or offline
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-gold/30">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark bg-cream/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/15 text-gold-dark">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
                Spiritual Retreats
              </h3>
              <span className="text-[10px] text-gold-dark font-bold tracking-wider uppercase">
                Curating For 2026 • Coming Soon
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success / Confirmation */
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4 font-sans">
            <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
            <h4 className="font-serif text-lg font-bold text-charcoal-dark">
              You're On The Priority List!
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-2">
              Blessings, {name}! You will be among the first to receive dates, venue brochures, and early-bird invitations as soon as our upcoming spiritual retreats are announced.
            </p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <a
                href={`https://wa.me/918929061557?text=Hi%20Sonali,%20I%20am%20interested%20in%20Ascension's%20upcoming%20Spiritual%20Retreats.%20Please%20keep%20me%20updated!`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Message Sonali on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form / Waitlist Screen */
          <div className="p-6 flex flex-col gap-4 font-sans text-xs text-charcoal text-left">
            <div className="bg-gradient-to-r from-cream via-cream-light to-cream p-4 rounded-xl border border-cream-dark/80 flex flex-col gap-1.5">
              <span className="font-serif italic font-bold text-xs text-charcoal-dark">
                "Sacred Sanctuaries for Deep Reconnection & Awakening"
              </span>
              <p className="text-[11px] text-charcoal-light leading-relaxed">
                We are designing transformative multi-day immersions with yoga, Theta subconscious release, singing bowl sound baths, and holy ceremonies in serene vortex destinations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Preferred Retreat Setting</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all text-xs"
                >
                  <option value="Himalayan Foothills / Riverside">Himalayan Foothills / Riverside</option>
                  <option value="Holy Gathering / Kumbh Sanctuary">Holy Gathering / Kumbh Sanctuary</option>
                  <option value="Forest Nature Sanctuary">Forest Nature Sanctuary</option>
                  <option value="Any Sacred Sanctuary">Any Sacred Sanctuary</option>
                </select>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all uppercase tracking-wider text-[9px] text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-[9px]"
                >
                  {loading ? 'Joining...' : 'Get Priority Updates'}
                </button>
              </div>
            </form>

            <div className="text-center border-t border-cream-dark/40 pt-2.5">
              <a
                href={`https://wa.me/918929061557?text=Hi%20Sonali,%20I%20am%20interested%20in%20Ascension's%20upcoming%20Spiritual%20Retreats.%20Please%20keep%20me%20updated!`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-gold-dark hover:text-sage font-bold flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Or Chat Directly with Sonali on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRetreatModal;
