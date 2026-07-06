import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Calendar, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Check, 
  ShieldCheck, UserCheck, Heart, Lock, Sparkles, Award, Users, Shield, Star, Leaf, 
  TrendingUp, ShoppingBag, Eye, HeartHandshake, MapPin, Mail, Phone, CalendarRange,
  Moon, Sun
} from 'lucide-react';
import axios from 'axios';
import RegisterWorkshopModal from '../components/RegisterWorkshopModal';
import RegisterWebinarModal from '../components/RegisterWebinarModal';
import waterfallBg from '../assets/waterfall_bg.jpg';
import founderImg from '../assets/founder.jpg';
import foodSeva from '../assets/food_seva.png';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const Home = () => {
  const [workshops, setWorkshops] = useState([]);
  const [activeWorkshop, setActiveWorkshop] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [products, setProducts] = useState([]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const resWorkshops = await axios.get('/api/workshops');
      const resWebinars = await axios.get('/api/webinars');
      let combined = [];
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      if (resWorkshops.data.success) {
        const activeWorkshops = resWorkshops.data.data.filter(w => new Date(w.date) >= todayStart);
        combined = [...combined, ...activeWorkshops];
      }
      if (resWebinars.data.success) {
        const activeWebinars = resWebinars.data.data.filter(w => new Date(w.date) >= todayStart);
        combined = [...combined, ...activeWebinars];
      }
      combined.sort((a, b) => new Date(a.date) - new Date(b.date));
      setWorkshops(combined);

      const resServices = await axios.get('/api/services');
      if (resServices.data.success) {
        setServices(resServices.data.data.slice(0, 6)); // We need 6 premium cards now
      }

      const resTestimonials = await axios.get('/api/testimonials');
      if (resTestimonials.data.success) {
        setTestimonials(resTestimonials.data.data);
      }

      const resProducts = await axios.get('/api/products');
      if (resProducts.data.success) {
        setProducts(resProducts.data.data.slice(0, 4)); // Show 4 featured products
      }
    } catch (err) {
      console.error('Error fetching home data:', err.message);
    }
  };

  const nextWorkshop = () => {
    if (workshops.length === 0) return;
    setCarouselIndex((prev) => (prev === workshops.length - 1 ? 0 : prev + 1));
  };

  const prevWorkshop = () => {
    if (workshops.length === 0) return;
    setCarouselIndex((prev) => (prev === 0 ? workshops.length - 1 : prev - 1));
  };

  // Auto-scroll testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Section */}
      <section className="relative min-h-[500px] lg:h-screen lg:min-h-[600px] lg:max-h-[960px] flex flex-col justify-center items-center px-6 md:px-12 lg:px-20 text-center overflow-hidden border-b border-cream-dark/30 bg-cream-light py-12 lg:py-0">
        {/* Blurred & Softened Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${waterfallBg})`,
            filter: 'brightness(1.1)'
          }}
        />
        {/* Soft Radial Contrast Overlay to enhance text readability without fading the bottom edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0)_80%)] z-0" />

        <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-4xl mx-auto animate-fade-in lg:-translate-y-8">

          <span className="font-cormorant text-sm sm:text-base text-black font-bold tracking-wider uppercase">
            Reclaim your peace. Reconnect with your light.
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-charcoal-dark leading-tight mt-2">
            A Sanctuary for <br />
            <span className="text-gold drop-shadow-[0_1.5px_2px_rgba(31,29,26,0.4)] font-bold">Spiritual Awakening</span> <br />
            & Healing
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans mt-0.5">
            Embark on a profound journey of self-realization, emotional release, and energetic alignment. Experience custom angelic guidance, therapeutic sound baths, and subconscious healing in a secure, sacred environment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto mt-3.5 font-sans">
            <Link
              to="/services"
              className="bg-sage hover:bg-sage-dark text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              to="/donate"
              className="bg-cream-light hover:bg-cream-dark text-gold-dark border border-gold/45 text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-center w-full sm:w-auto"
            >
              Support Our NGO
            </Link>
          </div>

        </div>

        {/* 1b. Trust Building Section Floating Card - Positioned absolute bottom inside Hero */}
        <div className="relative lg:absolute lg:bottom-8 left-0 right-0 z-20 max-w-5xl w-full mx-auto px-6 mt-8 lg:mt-0 animate-slide-up">
          <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-4 md:p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-4 items-center shadow-xl border border-cream-dark/50 hover:shadow-2xl transition-all duration-300">

            {/* Column 1: Lives Touched */}
            <div className="flex flex-col text-left gap-1.5 px-3 py-1 border-b lg:border-b-0 lg:border-r border-cream-dark/50 last:border-0 last:pr-0 w-full pb-3 lg:pb-0">
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Lives Touched</span>
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Heart className="w-4 h-4" />
                </span>
                <span className="font-serif text-lg md:text-xl font-bold text-charcoal-dark leading-none">
                  10,000+
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light font-light mt-0.5 leading-none">Individuals guided</p>
            </div>

            {/* Column 2: Experience */}
            <div className="flex flex-col text-left gap-1.5 px-3 py-1 border-b lg:border-b-0 lg:border-r border-cream-dark/50 last:border-0 last:pr-0 w-full pb-3 lg:pb-0">
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Experience</span>
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="font-serif text-lg md:text-xl font-bold text-charcoal-dark leading-none">
                  150+
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light font-light mt-0.5 leading-none">Sessions Conducted</p>
            </div>

            {/* Column 3: Holistic Approach */}
            <div className="flex flex-col text-left gap-1.5 px-3 py-1 border-b lg:border-b-0 lg:border-r border-cream-dark/50 last:border-0 last:pr-0 w-full pb-3 lg:pb-0">
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Holistic Approach</span>
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="font-serif text-sm font-bold text-charcoal-dark leading-none">
                  Mind • Body • Soul
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light font-light mt-0.5 leading-none">Healing & Alignment</p>
            </div>

            {/* Column 4: Safe & Sacred Space */}
            <div className="flex flex-col text-left gap-1.5 px-3 py-1 border-b lg:border-b-0 lg:border-r border-cream-dark/50 last:border-0 last:pr-0 w-full pb-3 lg:pb-0">
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Sacred Space</span>
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-serif text-lg md:text-xl font-bold text-charcoal-dark leading-none">
                  100%
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light font-light mt-0.5 leading-none">Confidential & Secure</p>
            </div>

            {/* Column 5: Guided By */}
            <div className="flex flex-col text-left gap-1.5 px-3 py-1 last:border-0 last:pr-0 w-full">
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Guided by</span>
              <div className="flex items-center gap-2.5">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <UserCheck className="w-4 h-4" />
                </span>
                <span className="font-serif text-[11px] font-bold text-charcoal-dark leading-tight whitespace-nowrap">
                  Sonali Bhasin Kumar
                </span>
              </div>
              <p className="text-[10px] text-charcoal-light font-light mt-0.5 leading-none">Expert. Healer. Mentor.</p>
            </div>

          </div>
        </div>
      </section>
      <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div className="max-w-6xl mx-auto">
          <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Discover Ascension</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark mt-2">Begin Your Healing Journey</h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans mt-3">
            Discover who we are, what we offer, and why thousands trust Ascension.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            
            {/* Card 1: Who We Are */}
            <Link to="/about" className="group bg-white rounded-[24px] p-8 shadow-md border border-cream-dark/50 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal-dark mb-4">Who We Are</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-8 flex-grow">
                Learn about our mission, values, vision, and the purpose behind Ascension.
              </p>
              <span className="text-xs font-bold text-sage-dark uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>

            {/* Card 2: What We Do */}
            <Link to="/services" className="group bg-white rounded-[24px] p-8 shadow-md border border-cream-dark/50 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal-dark mb-4">What We Do</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-8 flex-grow">
                Explore our healing therapies, meditation, sound healing, workshops, retreats, and wellness programs.
              </p>
              <span className="text-xs font-bold text-sage-dark uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>

            {/* Card 3: Why Choose Ascension */}
            <a href="#why-choose" className="group bg-white rounded-[24px] p-8 shadow-md border border-cream-dark/50 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal-dark mb-4">Why Choose Ascension</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-8 flex-grow">
                Discover why people trust Ascension for holistic healing, spiritual guidance, and a safe confidential environment.
              </p>
              <span className="text-xs font-bold text-sage-dark uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                <span>Discover More</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* 3. Meet the Founder */}
      <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Picture */}
          <div className="relative justify-self-center">
            <div className="w-72 h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gold-dark/20 relative">
              <img
                src={founderImg}
                alt="Sonali Bhasin Kumar"
                className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            {/* Elegant quote bubble */}
            <div className="absolute -bottom-8 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-xl border border-cream-dark/40 max-w-[240px] mx-auto md:left-auto md:right-[-24px] md:bottom-[-24px] md:max-w-[220px]">
              <p className="font-cormorant text-[13px] text-gold-dark font-bold">"Together, we rise by uplifting others and healing within."</p>
              <p className="font-sans text-[9px] uppercase tracking-wider text-charcoal-light mt-2">- Sonali Bhasin Kumar</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-6 text-left">
            <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Meet The Founder</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark">Sonali Bhasin Kumar</h2>
            <div className="w-12 h-[1px] bg-gold-dark/40"></div>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              Sonali Bhasin Kumar is a certified spiritual healer, manifestation coach, and holistic therapist. Combining subconscious restructuring through Theta healing, high-frequency sound baths, and intuitive angelic guidance, she serves as a compassionate channel for your self-realization and release.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              Her ultimate mission is to help individuals transcend deep-seated emotional trauma, clear karmic residue, and align with the light of their true essence, nurturing a peaceful recovery.
            </p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-b border-cream-dark/50 py-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="font-serif text-gold-dark font-bold text-lg">10+ Years</span>
                <span className="text-[10px] text-charcoal-light uppercase tracking-wider">Healing Experience</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-serif text-gold-dark font-bold text-lg">10,000+</span>
                <span className="text-[10px] text-charcoal-light uppercase tracking-wider">Lives Empowered</span>
              </div>
            </div>

            <Link
              to="/about"
              className="bg-sage hover:bg-sage-dark text-white font-sans text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl shadow-md transition-all duration-300 self-start hover:-translate-y-0.5 mt-2"
            >
              Know My Journey
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Healing Services */}
      <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div className="max-w-6xl mx-auto">
          <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Premium Modalities</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark mt-2 mb-16">Healing Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service 1: Theta Healing */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80" alt="Theta Healing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Theta Healing</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Release deep subconscious blocks, negative patterns, and emotional trauma to align with your highest potential.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 2: Sound Healing */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80" alt="Sound Healing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Sound Healing</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Rebalance your energetic fields, reduce stress, and achieve deep relaxation through sacred sound baths.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 3: Chakra Healing */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" alt="Chakra Healing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Chakra Healing</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Harmonize your primary energy centers (chakras) using crystals, energy transfer, and focused intentions.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 4: Meditation */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80" alt="Meditation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Meditation</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Cultivate mindfulness, quieten the inner mind, and build a lasting connection to your spiritual wisdom.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 5: Oracle Guidance */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80" alt="Oracle Guidance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <Moon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Oracle Guidance</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Receive intuitive divine messages, clarity for your path, and answers to your soul's deepest questions.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Service 6: Retreats */}
            <div className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left">
              <div className="h-40 rounded-xl overflow-hidden mb-5 relative">
                <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" alt="Retreats" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm">
                  <Sun className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2">Retreats</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Immerse yourself in nature-inspired, sacred environments for transformative multi-day healing programs.
              </p>
              <Link to="/services" className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Why Choose Ascension */}
      <section id="why-choose" className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full text-center scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Sacred Safety & Experienced Care</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark mt-2 mb-16">Why Choose Ascension</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Personalized Healing</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                Customized energy sessions tailored specifically to your unique physical, mental, and emotional needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Safe & Confidential</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                A completely secure, non-judgmental sanctuary where your vulnerability is treated with the highest sacred respect.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Experienced Guidance</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                Led by Sonali Bhasin Kumar, offering years of proven certification in Theta healing, sound therapy, and manifestation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Nature Inspired Healing</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                Harnessing natural frequencies, crystals, sound baths, and nature retreats to ground and align your spirit.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Holistic Wellness</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                Bridging the mind, body, and soul connection to ensure true recovery, clarity, and life purpose.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/30 hover:border-gold-dark/45 transition-all duration-300 text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark">Trusted by Thousands</h3>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                A vibrant community of souls who have successfully broke free from past blocks and transformed their lives.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-4xl mx-auto">
            <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Testimonials</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Client Experiences</h2>

            <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-md border border-cream-dark/40 min-h-[260px] flex flex-col justify-center items-center gap-4 relative animate-fade-in">
              {/* Star Rating */}
              <div className="flex text-gold text-sm gap-1 mb-2">
                {'★'.repeat(testimonials[activeTestimonial].rating || 5)}
              </div>
              <p className="font-serif italic text-sm md:text-base text-charcoal-light leading-relaxed max-w-2xl">
                "{testimonials[activeTestimonial].reviewText}"
              </p>
              
              <div className="flex items-center gap-3 mt-6 font-sans text-left">
                {testimonials[activeTestimonial].image ? (
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover border border-cream-dark"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-cream-dark font-serif font-bold text-sm">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-charcoal-dark">{testimonials[activeTestimonial].name}</p>
                  <p className="text-[10px] text-charcoal-light">Verified Client</p>
                </div>
              </div>

              {/* Slider Arrows */}
              {testimonials.length > 1 && (
                <div className="absolute inset-y-0 w-full flex items-center justify-between pointer-events-none px-2 sm:px-4">
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white hover:bg-cream-light border border-cream-dark/50 flex items-center justify-center text-charcoal hover:text-gold transition-colors focus:outline-none shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white hover:bg-cream-light border border-cream-dark/50 flex items-center justify-center text-charcoal hover:text-gold transition-colors focus:outline-none shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Testimonial Indicators */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none ${idx === activeTestimonial ? 'bg-gold w-5' : 'bg-gold/30'
                      }`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Ascension Seva NGO */}
      <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-6 text-left">
            <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Healing Humanity</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark">Ascension Seva NGO</h2>
            <div className="w-12 h-[1px] bg-gold-dark/40"></div>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              We believe true spirituality extends beyond personal healing—it is reflected in selfless service (Seva) to humanity. Founded by Sonali Bhasin Kumar, our NGO initiatives support underprivileged families, feed local communities, mentor school children, and foster animal compassion.
            </p>
            <div className="flex flex-col gap-3.5 mt-2 font-sans text-xs">
              {[
                { label: 'Daily Food Seva Drives', desc: 'Distributing warm, nutritious meals to disadvantaged families.' },
                { label: 'Women Empowerment & Skill Building', desc: 'Providing craft training to secure independent livelihood options.' },
                { label: 'Shiksha Kendra Child Mentorship', desc: 'Free educational classes and tutoring for underprivileged kids.' },
                { label: 'Holistic Health & Healing Camps', desc: 'Bringing free sound baths, meditation, and stress-release to target circles.' }
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className="bg-sage/10 p-1.5 rounded-full inline-flex text-sage mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-charcoal-dark">{item.label}</span>
                    <span className="text-charcoal-light font-light text-[11px] mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mt-4 font-sans">
              <Link
                to="/ngo"
                className="bg-sage hover:bg-sage-dark text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md"
              >
                Learn More
              </Link>
              <Link
                to="/donate"
                className="text-xs font-bold text-gold-dark uppercase tracking-wider hover:text-sage transition-colors duration-200"
              >
                Donate Now →
              </Link>
            </div>
          </div>

          <div className="h-[460px] rounded-3xl overflow-hidden shadow-xl border border-cream-dark/50 bg-cream order-first md:order-last">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
              alt="Ascension Seva NGO"
              className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 8. Upcoming Workshops */}
      {workshops.length > 0 && (
        <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-6xl mx-auto">
            <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Sacred Gatherings</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Upcoming Workshops</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.slice(0, 3).map((workshop) => (
                <div key={workshop._id} className="group bg-white rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 hover:shadow-2xl hover:border-gold-dark/45 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left">
                  <div className="h-48 overflow-hidden bg-cream relative">
                    <img 
                      src={getImageUrl(workshop.coverImage || workshop.image)} 
                      alt={workshop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-sage-dark shadow-sm flex items-center gap-1 font-sans">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(workshop.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2 leading-snug">{workshop.title}</h3>
                    <p className="text-xs text-charcoal-light leading-relaxed font-sans line-clamp-3 mb-6">
                      {workshop.description || workshop.shortDescription}
                    </p>
                    
                    <div className="mt-auto border-t border-cream-dark/40 pt-4 flex justify-between items-center font-sans text-xs">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-charcoal-light uppercase">Investment</span>
                        <span className="font-serif font-bold text-gold-dark text-sm">₹{workshop.pricing || workshop.price}</span>
                      </div>
                      <button
                        onClick={() => setActiveWorkshop(workshop)}
                        className="bg-sage hover:bg-sage-dark text-white text-[10px] font-bold uppercase tracking-wider py-2.5 px-5 rounded-lg transition-all duration-300 shadow-sm"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* If more than 3, redirect to programs page */}
            {workshops.length > 3 && (
              <div className="mt-12">
                <Link to="/programs" className="text-xs font-bold text-sage-dark uppercase tracking-wider hover:text-gold flex items-center justify-center gap-1">
                  <span>View All Upcoming Gatherings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9. Featured Shop */}
      {products.length > 0 && (
        <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-6xl mx-auto">
            <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Spiritual Tools</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Sacred Intentions Shop</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="group bg-white rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 hover:shadow-2xl hover:border-gold-dark/45 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left">
                  <div className="h-56 overflow-hidden bg-cream-light relative">
                    <img 
                      src={getImageUrl(product.images[0])} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs rounded-full p-2 text-gold shadow-sm">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-[9px] uppercase tracking-wider text-sage font-medium font-sans mb-1">{product.category}</span>
                    <h3 className="font-serif text-sm font-bold text-charcoal-dark mb-3 line-clamp-1">{product.name}</h3>
                    
                    <div className="mt-auto pt-3 border-t border-cream-dark/30 flex justify-between items-center font-sans text-xs">
                      <span className="font-serif font-bold text-gold-dark text-sm">₹{product.price}</span>
                      <Link 
                        to={`/product/${product._id}`} 
                        className="text-sage hover:text-gold font-bold uppercase tracking-wider flex items-center gap-1 text-[10px]"
                      >
                        <span>View Product</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/shop" className="bg-white hover:bg-cream-light text-gold-dark border border-gold/45 text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 self-center hover:-translate-y-0.5 inline-block shadow-sm">
                Explore Full Sacred Collection
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 10. Donation CTA Banner (Premium placement near bottom) */}
      <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div 
          className="max-w-5xl mx-auto rounded-3xl text-white p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center gap-8 animate-fade-in bg-cover bg-center border border-cream-dark/30"
          style={{ backgroundImage: `url(${foodSeva})` }}
        >
          {/* Dark Overlay for premium text contrast */}
          <div className="absolute inset-0 bg-charcoal-dark/75 z-0"></div>

          <div className="flex flex-col items-center max-w-2xl relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-gold mb-5">
              <Heart className="w-6 h-6 text-gold fill-gold/15" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-white leading-tight">
              Your Contribution Creates Healing
            </h2>
            <p className="text-xs md:text-sm text-cream-light/90 max-w-xl mt-3.5 leading-relaxed font-light">
              Every donation helps us provide healing workshops, food distribution, skill training, and vital support to those who need it most.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md relative z-10">
            <Link
              to="/donate"
              className="bg-gold hover:bg-gold-dark text-charcoal-dark rounded-xl py-4 px-8 font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-xs uppercase tracking-wider shrink-0 font-sans flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              <span>Donate Now</span>
              <Heart className="w-4 h-4 text-charcoal-dark shrink-0 fill-charcoal-dark" />
            </Link>
          </div>

          {/* Luxury Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/15 pt-8 w-full max-w-3xl mt-2 font-sans text-xs relative z-10">
            <div className="flex flex-col items-center gap-1 text-center">
              <Lock className="w-5 h-5 text-gold shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">Secure Donation</span>
              <span className="text-[9px] text-cream-light/80 font-light">Encrypted checkout portals</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">Transparent Accounts</span>
              <span className="text-[9px] text-cream-light/80 font-light">Regular audits & open ledgers</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <HeartHandshake className="w-5 h-5 text-gold shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">Real Local Impact</span>
              <span className="text-[9px] text-cream-light/80 font-light">Direct grassroot mobilization</span>
            </div>
          </div>

        </div>
      </section>

      {/* 11. Instagram / Community Gallery */}
      <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div className="max-w-6xl mx-auto">
          <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Ascension Circles</span>
          <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Community Gallery</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80', tag: 'Sound Healing' },
              { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80', tag: 'Women Circles' },
              { src: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80', tag: 'Sacred Crystals' },
              { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', tag: 'Seva Drives' },
              { src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80', tag: 'Meditation' },
              { src: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80', tag: 'Intention Candles' }
            ].map((pic, idx) => (
              <div key={idx} className="group relative h-48 rounded-2xl overflow-hidden shadow-sm border border-cream-dark/50">
                <img src={pic.src} alt={pic.tag} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-charcoal/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-white font-bold">{pic.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Newsletter Section */}
      <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 text-center w-full">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4 font-sans">
          <span className="font-serif italic text-xs text-gold-dark tracking-wider uppercase font-semibold">Stay Aligned</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-dark">Subscribe to the Ascension Newsletter</h2>
          <p className="text-xs text-charcoal-light leading-relaxed max-w-sm">
            Receive monthly newsletters detailing full Moon rituals, energy forecasts, and upcoming retreats.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-md mt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter email address..."
              required
              className="flex-1 bg-cream-light border border-cream-dark/60 rounded-xl py-3 px-4 text-xs text-charcoal focus:outline-none focus:border-sage transition-all"
            />
            <button
              type="submit"
              className="bg-sage hover:bg-sage-dark text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all duration-300 shadow-sm shrink-0"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-sage font-bold animate-pulse mt-2">
              Blessings! You have subscribed successfully.
            </p>
          )}
        </div>
      </section>

      {/* Workshop Registration Modal */}
      {activeWorkshop && activeWorkshop.isWebinar ? (
        <RegisterWebinarModal
          webinar={activeWorkshop}
          onClose={() => setActiveWorkshop(null)}
        />
      ) : activeWorkshop && (
        <RegisterWorkshopModal
          workshop={activeWorkshop}
          onClose={() => setActiveWorkshop(null)}
        />
      )}
    </div>
  );
};

export default Home;
