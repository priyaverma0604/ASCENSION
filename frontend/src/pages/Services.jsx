import React, { useState, useEffect } from 'react';
import { Compass, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import BookSessionModal from '../components/BookSessionModal';

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
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">Our Sacred Offerings</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark">
            Wellness & Energy Healing Services
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed">
            At Ascension, we combine ancient modalities, vibration therapies, and compassionate guidance to restore balance, release emotional blocks, and manifest your highest potential.
          </p>
        </div>

        {loading ? (
          /* Shimmer Loading */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 4].map(n => (
              <div key={n} className="shimmer h-96 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : (
          /* Services list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="glass rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 border border-cream-dark/50"
              >
                {/* Image */}
                <div className="h-56 bg-cream overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-sage font-bold py-1 px-3.5 rounded-full flex items-center gap-1.5 shadow-sm text-[10px] font-sans">
                    <Clock className="w-3.5 h-3.5 text-sage" />
                    <span>{service.duration} mins</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col gap-4 text-left">
                  <h3 className="font-serif text-lg font-bold text-charcoal-dark leading-snug">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-cream-dark/50 pt-4 mt-2">
                      <span className="text-[9px] uppercase tracking-widest text-sage font-bold font-sans">Key Benefits</span>
                      <div className="flex flex-col gap-2 font-sans text-xs">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2 text-charcoal-light">
                            <CheckCircle className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                            <span className="leading-snug">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing and Button */}
                  <div className="mt-auto pt-6 border-t border-cream-dark/50 flex justify-between items-center font-sans">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-charcoal-light uppercase tracking-wider">Exchange</span>
                      <span className="font-serif font-bold text-sm text-gold-dark">₹{service.pricing}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedService(service)}
                      className="bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all duration-300 text-xs shadow-sm flex items-center gap-1.5 group"
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
