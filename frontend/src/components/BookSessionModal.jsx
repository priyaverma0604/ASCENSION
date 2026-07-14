import React, { useState, useContext } from 'react';
import { X, CheckCircle, Calendar, MessageSquare, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const BookSessionModal = ({ service, onClose }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send as contact inquiry labeled as "Service Booking Request"
      const payload = {
        name,
        email,
        phone,
        message: `[SERVICE BOOKING REQUEST: ${service.title}]\nPreferred Date: ${date}\nMessage: ${message}`
      };
      
      const { data } = await axios.post('/api/contacts', payload);
      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Book Session
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5">
              {service.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success Screen */
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
            <h4 className="font-serif text-lg font-bold text-charcoal-dark">
              Session Inquiry Logged!
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-4">
              Blessings, {name}! Your inquiry for **{service.title}** has been received. Sonali will reach out to you via WhatsApp/Email to schedule your session slot.
            </p>
            <div className="flex flex-col gap-2 w-full mt-4 font-sans">
              <a
                href={`https://wa.me/918929061557?text=Hi%20Sonali,%20I%20have%20submitted%20a%20booking%20request%20for%20${encodeURIComponent(service.title)}.%20Looking%20forward%20to%20scheduling%20it!`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                Message on WhatsApp
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
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 font-sans text-xs">
            
            {/* Price Banner */}
            <div className="bg-cream p-3.5 rounded-xl border border-cream-dark flex justify-between items-center">
              <span className="text-charcoal-light">Investment</span>
              <span className="font-serif font-bold text-sm text-gold-dark">
                ₹{service.pricing} <span className="text-[10px] font-sans font-normal text-charcoal-light">/ {service.duration} mins</span>
              </span>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter 10-digit number"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Preferred Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sage" />
                Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-sage" />
                Special intentions / healing requests
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                placeholder="Let Sonali know if you have specific blockages or areas of concern..."
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center"
              >
                {submitting ? 'Sending Request...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookSessionModal;
