import React, { useState, useEffect } from 'react';
import { Compass, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import BookSessionModal from '../components/BookSessionModal';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/api/services');
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto flex flex-col gap-10 sm:gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Our Sacred Offerings</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide text-charcoal-dark">
            Wellness & Energy Healing Services
          </h1>
          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed">
            At Ascension, we combine ancient modalities, vibration therapies, and compassionate guidance to restore balance, release emotional blocks, and manifest your highest potential.
          </p>
        </div>

        {loading ? (
          /* Shimmer Loading */
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="shimmer h-96 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : (
          /* Services list */
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="glass rounded-2xl shadow-xs sm:shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 border border-cream-dark/50"
              >
                {/* Image */}
                <div className="h-48 sm:h-56 bg-cream overflow-hidden relative">
                  <img 
                    src={getImageUrl(service.image)} 
                    alt={service.title} 
                    className={`w-full h-full object-cover hover:scale-102 transition-transform duration-700 ${service.title === 'Sound Healing' ? 'object-top' : ''}`}
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-sage font-bold py-1 px-3 sm:px-3.5 rounded-full flex items-center gap-1.5 shadow-xs text-[10px] font-sans">
                    <Clock className="w-3.5 h-3.5 text-sage" />
                    <span>{service.duration} mins</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3 sm:gap-4 text-left">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-dark leading-snug">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-cream-dark/50 pt-3 sm:pt-4 mt-2">
                      <span className="text-[9px] uppercase tracking-widest text-sage font-bold font-sans">Key Benefits</span>
                      <div className="flex flex-col gap-1.5 sm:gap-2 font-sans text-xs">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2 text-charcoal-light">
                            <CheckCircle className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                            <span className="leading-snug text-xs">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing and Button */}
                  <div className="mt-auto pt-4 sm:pt-6 border-t border-cream-dark/50 flex justify-between items-center font-sans">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] sm:text-[10px] text-charcoal-light uppercase tracking-wider">Exchange</span>
                      <span className="font-serif font-bold text-xs sm:text-sm text-gold-dark">₹{service.pricing}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedService(service)}
                      className="bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-2 sm:py-2.5 px-4 sm:px-6 rounded-xl transition-all duration-300 text-[11px] sm:text-xs shadow-xs flex items-center gap-1.5 group"
                    >
                      <span>Book Session</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Book Session Modal */}
      {selectedService && (
        <BookSessionModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};

export default Services;
