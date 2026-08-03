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
import sevaLogo from '../assets/seva_logo.png';
import mandalaWatermark from '../assets/mandala_watermark.png';
import foodDistribution from '../assets/gallery/food_distribution.png';
import sanitaryDistribution1 from '../assets/gallery/sanitary_distribution_1.png';
import cowFeeding1 from '../assets/gallery/cow_feeding_1.png';
import sanitaryDistribution2 from '../assets/gallery/sanitary_distribution_2.png';
import cowFeeding2 from '../assets/gallery/cow_feeding_2.png';
import dogCare1 from '../assets/gallery/dog_care_1.png';
import educationSeva from '../assets/gallery/education_seva.png';
import dogCare2 from '../assets/gallery/dog_care_2.png';
import whoWeAreBg from '../assets/who_we_are_bg.jpg';
import whatWeDo from '../assets/what_we_do.jpg';
import whyChooseAscension from '../assets/why_choose_ascension.jpg';
import lionsGatePortalImg from '../assets/lions_gate_portal.jpg';

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
  const [loading, setLoading] = useState(true);

  // Dynamic check for Lion's Gate webinar details
  const lionsGateWebinar = workshops.find(w => w.title && w.title.toLowerCase().includes("lion's gate"));
  
  const getLionsGateDateText = () => {
    if (lionsGateWebinar && lionsGateWebinar.date) {
      const d = new Date(lionsGateWebinar.date);
      const day = d.getDate();
      const month = d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
      return `${month} ${day}`;
    }
    return "AUG 8";
  };

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Seva Section Animation State & Ref
  const [sevaVisible, setSevaVisible] = useState(false);
  const sevaRef = React.useRef(null);

  // Gallery Carousel State
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryVisibleItems, setGalleryVisibleItems] = useState(3);

  const galleryImages = [
    foodDistribution,
    sanitaryDistribution1,
    cowFeeding1,
    sanitaryDistribution2,
    cowFeeding2,
    dogCare1,
    educationSeva,
    dogCare2
  ];

  const galleryMaxIndex = Math.max(0, galleryImages.length - galleryVisibleItems);

  const nextGallerySlide = () => {
    setGalleryIndex((prev) => (prev >= galleryMaxIndex ? 0 : prev + 1));
  };

  const prevGallerySlide = () => {
    setGalleryIndex((prev) => (prev === 0 ? galleryMaxIndex : prev - 1));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGalleryVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setGalleryVisibleItems(2);
      } else {
        setGalleryVisibleItems(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (galleryIndex > galleryMaxIndex) {
      setGalleryIndex(galleryMaxIndex);
    }
  }, [galleryVisibleItems, galleryMaxIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextGallerySlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryIndex, galleryVisibleItems, galleryMaxIndex]);

  useEffect(() => {
    fetchHomeData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSevaVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sevaRef.current) {
      observer.observe(sevaRef.current);
    }
    return () => {
      if (sevaRef.current) {
        observer.unobserve(sevaRef.current);
      }
    };
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
    } finally {
      setLoading(false);
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

  const handleLionsGateRegister = () => {
    const found = workshops.find(w => w.title && w.title.toLowerCase().includes("lion's gate"));
    if (found) {
      setActiveWorkshop(found);
    } else {
      setActiveWorkshop({
        _id: "mockup-lions-gate-webinar-id",
        title: "Lion's Gate Portal Webinar: 8:8 Gateway of Abundance & Awakening",
        price: 2100,
        speakerName: "Sonali Bhasin Kumar",
        date: new Date('2026-08-08T18:00:00Z'),
        time: "6:00 PM - 7:30 PM IST",
        duration: "90 minutes",
        upiQrCodeImage: "/uploads/default_upi_qr.jpg",
        upiId: "sonalibhasinkumar@ptaxis",
        mobileNumber: "9999999999",
        zoomLink: "https://zoom.us/mock-link",
        maxSeats: 100,
        isWebinar: true
      });
    }
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
          <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Discover Ascension</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-dark mt-2">Begin Your Healing Journey</h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans mt-3">
            Discover who we are, what we offer, and why thousands trust Ascension.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

            {/* Card 1: Who We Are */}
            <Link to="/about" className="group relative rounded-[24px] p-8 shadow-md border border-cream-dark/50 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center h-[340px] min-h-[340px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${whoWeAreBg})` }} />
              <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/65 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col items-center h-full text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-4">Who We Are</h3>
                <p className="text-xs text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
                  Learn about our mission, values, vision, and the purpose behind Ascension.
                </p>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
            </Link>

            {/* Card 2: What We Do */}
            <Link to="/services" className="group relative rounded-[24px] p-8 shadow-md border border-cream-dark/50 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center h-[340px] min-h-[340px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${whatWeDo})` }} />
              <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/65 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col items-center h-full text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-4">What We Do</h3>
                <p className="text-xs text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
                  Explore our healing therapies, meditation, sound healing, workshops, retreats, and wellness programs.
                </p>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
            </Link>

            {/* Card 3: Why Choose Ascension */}
            <a href="#why-choose" className="group relative rounded-[24px] p-8 shadow-md border border-cream-dark/50 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center h-[340px] min-h-[340px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${whyChooseAscension})` }} />
              <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/65 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col items-center h-full text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-4">Why Choose Ascension</h3>
                <p className="text-xs text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
                  Discover why people trust Ascension for holistic healing, spiritual guidance, and a safe confidential environment.
                </p>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors duration-200 mt-auto">
                  <span>Discover More</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
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
            <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Meet The Founder</span>
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
          <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Premium Modalities</span>
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
                <img src={getImageUrl('/uploads/sound_healing_service.png')} alt="Sound Healing" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
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
          <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Sacred Safety & Experienced Care</span>
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
      {(loading || testimonials.length > 0) && (
        <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-4xl mx-auto">
            <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Testimonials</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Client Experiences</h2>

            <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-md border border-cream-dark/40 min-h-[260px] flex flex-col justify-center items-center gap-4 relative animate-fade-in">
              {loading ? (
                <div className="flex flex-col items-center gap-4 w-full animate-pulse">
                  <div className="h-4 bg-cream-dark rounded-full w-24"></div>
                  <div className="h-4 bg-cream-dark rounded-full w-3/4"></div>
                  <div className="h-4 bg-cream-dark rounded-full w-1/2"></div>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-12 h-12 bg-cream-dark rounded-full"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 bg-cream-dark rounded-full w-20"></div>
                      <div className="h-2 bg-cream-dark rounded-full w-12"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Star Rating */}
                  <div className="flex text-gold text-sm gap-1 mb-2">
                    {'★'.repeat(testimonials[activeTestimonial].rating || 5)}
                  </div>
                  <div className="h-[220px] sm:h-[180px] md:h-[140px] flex items-center justify-center overflow-y-auto py-2 w-full">
                    <p className="font-serif italic text-sm md:text-base text-charcoal-light leading-relaxed max-w-2xl text-center">
                      "{testimonials[activeTestimonial].reviewText}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-6 font-sans text-left">
                    {testimonials[activeTestimonial].image ? (
                      <img
                        src={getImageUrl(testimonials[activeTestimonial].image)}
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
                      {testimonials[activeTestimonial].designation && (
                        <p className="text-[9px] text-gold-dark uppercase tracking-wider font-bold mt-0.5">
                          {testimonials[activeTestimonial].designation}
                        </p>
                      )}
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
                </>
              )}
            </div>

            {/* Testimonial Indicators */}
            {!loading && testimonials.length > 1 && (
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
      <section ref={sevaRef} className="py-10 md:py-14 bg-[#FCFBF7] px-6 md:px-12 border-b border-cream-dark/30 w-full relative overflow-hidden flex items-center md:min-h-[calc(100vh-80px)]">
        {/* Subtle Mandala Watermark */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-[0.05] bg-contain bg-no-repeat bg-left z-0 mix-blend-multiply"
          style={{ backgroundImage: `url(${mandalaWatermark})` }}
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch w-full relative z-10">
          <div className={`flex flex-col justify-between h-full gap-4 text-left transition-all duration-[1s] transform ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col gap-2 md:gap-3">
              {/* Eyebrow */}
              <span className="font-sans text-[10px] tracking-[0.25em] font-bold text-gold-dark uppercase select-none">
                Healing Humanity
              </span>

              {/* Logo */}
              <div className="flex justify-start w-full">
                <img 
                  src={`${sevaLogo}?v=3`} 
                  alt="Ascension Seva Logo" 
                  className="h-16 md:h-20 w-auto object-contain transition-all duration-300 transform hover:scale-[1.02]" 
                />
              </div>

              {/* Mission Statement */}
              <p className="text-xs sm:text-[13px] text-charcoal-light leading-relaxed font-sans max-w-[520px] my-1">
                True spirituality extends beyond personal healing—it is reflected in selfless service to humanity. Through Ascension Seva, we uplift underprivileged families, educate children, empower women, and nurture communities with compassion.
              </p>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {[
                  { 
                    icon: "🍲", 
                    title: "Daily Food Seva Drives", 
                    desc: "Distributing warm nutritious meals to underprivileged families." 
                  },
                  { 
                    icon: "🎓", 
                    title: "Education & Child Mentorship", 
                    desc: "Providing free education, books and mentoring." 
                  },
                  { 
                    icon: "🌿", 
                    title: "Women Empowerment & Skill Development", 
                    desc: "Helping women become financially independent." 
                  }
                ].map((card, idx) => (
                  <div 
                    key={card.title} 
                    className={`glass bg-white/70 hover:bg-white/95 border border-cream-dark/30 hover:border-gold/40 p-3 rounded-xl flex items-start gap-3 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm group ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${(idx + 1) * 200}ms` }}
                  >
                    <span className="text-xl mt-0.5 filter drop-shadow-sm select-none">{card.icon}</span>
                    <div className="flex flex-col text-left">
                      <h4 className="font-bold text-[11px] uppercase tracking-wide text-charcoal-dark font-sans group-hover:text-gold-dark transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-charcoal-light font-light text-[10px] leading-relaxed mt-0.5 font-sans">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-2">
              {/* Quote */}
              <div className={`my-2 text-center md:text-left py-1 border-l border-gold/30 pl-4 transition-all duration-700 delay-800 ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="font-serif italic text-xs sm:text-sm text-charcoal-dark/90 tracking-wide">
                  "Compassion is the highest form of spirituality."
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={`flex items-center gap-4 mt-1 font-sans transition-all duration-700 delay-1000 ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <Link
                  to="/donate"
                  className="bg-gradient-to-r from-gold via-gold-light to-gold-dark hover:brightness-[1.03] text-charcoal-dark font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Donate Now
                </Link>
                <Link
                  to="/ngo"
                  className="bg-transparent hover:bg-cream-light/30 border border-cream-dark/80 text-charcoal-dark font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
          </div>

          <div className={`relative z-10 w-full flex items-center justify-center transition-all duration-[1.2s] transform ${sevaVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Image Wrapper */}
            <div className="relative w-full h-[420px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl border border-cream-dark/50 bg-cream group">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                alt="Ascension Seva NGO"
                className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
              />
              
              {/* Floating Badge Top Left */}
              <div className="absolute top-6 left-6 z-20 backdrop-blur-md bg-white/75 border border-cream-dark/40 shadow-lg rounded-2xl p-3 px-4 flex items-center gap-2.5 animate-float-slow select-none">
                <span className="text-xl filter drop-shadow-xs">🍲</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-charcoal-dark uppercase tracking-wider">Meals</span>
                  <span className="text-[9px] text-sage font-semibold uppercase tracking-wide">Distributed</span>
                </div>
              </div>

              {/* Floating Badge Bottom Right */}
              <div className="absolute bottom-6 right-6 z-20 backdrop-blur-md bg-white/75 border border-cream-dark/40 shadow-lg rounded-2xl p-3 px-4 flex items-center gap-2.5 animate-float-slower select-none">
                <span className="text-xl filter drop-shadow-xs">❤️</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-charcoal-dark uppercase tracking-wider">500+</span>
                  <span className="text-[9px] text-sage font-semibold uppercase tracking-wide">Volunteers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Upcoming Workshops */}
      {(loading || workshops.length > 0) && (
        <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-6xl mx-auto">
            <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Sacred Gatherings</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Upcoming Workshops</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 p-6 flex flex-col gap-4 animate-pulse h-[400px]">
                    <div className="h-48 bg-cream rounded-2xl w-full"></div>
                    <div className="h-6 bg-cream rounded-full w-3/4 mt-2"></div>
                    <div className="h-4 bg-cream rounded-full w-full"></div>
                    <div className="h-4 bg-cream rounded-full w-1/2"></div>
                    <div className="mt-auto h-10 bg-cream rounded-xl w-full"></div>
                  </div>
                ))
              ) : (
                <>
                  {/* Premium Featured Lion's Gate Portal Webinar Card */}
                  <div className="group bg-[#FFFDF7]/75 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(212,160,23,0.12)] border border-[#EAE3D2] hover:border-[#D4A017]/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col text-left h-full">
                    {/* Image Section */}
                    <div className="h-48 overflow-hidden bg-cream relative">
                      <img
                        src={lionsGatePortalImg}
                        alt="Lion's Gate Portal Webinar"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[800ms] ease-out"
                      />
                      
                      {/* Floating Date Badge */}
                      <div className="absolute top-4 left-4 bg-[#FCFBF7]/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-sage-dark shadow-sm flex items-center gap-1 font-sans border border-cream-dark/30 select-none">
                        <Calendar className="w-3 h-3 text-sage" />
                        <span>{getLionsGateDateText()}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2 leading-snug">
                        {lionsGateWebinar ? lionsGateWebinar.title : "Lion's Gate Portal Webinar: 8:8 Gateway of Abundance & Awakening"}
                      </h3>
                      <p className="text-xs text-charcoal-light leading-relaxed font-sans line-clamp-3 mb-6">
                        {lionsGateWebinar ? lionsGateWebinar.shortDescription : "Step into the powerful energies of the Lion's Gate Portal 2026. Discover how this cosmic alignment opens the doors to manifestation, spiritual awakening, and divine transformation."}
                      </p>

                      {/* Footer Section */}
                      <div className="mt-auto border-t border-cream-dark/40 pt-4 flex justify-between items-center font-sans text-xs">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] text-charcoal-light uppercase tracking-wider font-semibold">INVESTMENT</span>
                          <span className="font-serif font-bold text-gold-dark text-sm mt-0.5">₹{lionsGateWebinar ? lionsGateWebinar.price : 2100}</span>
                        </div>
                        
                        <button
                          onClick={handleLionsGateRegister}
                          className="bg-[#D4A017] hover:bg-[#B38610] text-[#111111] text-[10px] font-bold uppercase tracking-wider py-2.5 px-5 rounded-lg transition-all duration-300 shadow-sm"
                        >
                          REGISTER NOW
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Other Database-fetched Workshops/Webinars */}
                  {workshops
                    .filter((workshop) => !workshop.title || !workshop.title.toLowerCase().includes("lion's gate"))
                    .slice(0, 2)
                    .map((workshop) => (
                      <div key={workshop._id} className="group bg-white rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 hover:shadow-2xl hover:border-gold-dark/45 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left h-full">
                        <div className="h-48 overflow-hidden bg-cream relative">
                          <img
                            src={getImageUrl(workshop.coverImage || workshop.image)}
                            alt={workshop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-sage-dark shadow-sm flex items-center gap-1 font-sans">
                            <Calendar className="w-3.5 h-3.5 text-sage" />
                            <span>{new Date(workshop.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="font-serif text-base font-bold text-charcoal-dark mb-2 leading-snug">{workshop.title}</h3>
                          <p className="text-xs text-charcoal-light leading-relaxed font-sans line-clamp-3 mb-6">
                            {workshop.description || workshop.shortDescription}
                          </p>

                          <div className="mt-auto border-t border-cream-dark/40 pt-4 flex justify-between items-center font-sans text-xs">
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] text-charcoal-light uppercase tracking-wider">Investment</span>
                              <span className="font-serif font-bold text-gold-dark text-sm mt-0.5">₹{workshop.pricing || workshop.price}</span>
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
                </>
              )}
            </div>

            {/* If more than 3, redirect to programs page */}
            {!loading && workshops.length > 3 && (
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
      {(loading || products.length > 0) && (
        <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-6xl mx-auto">
            <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Spiritual Tools</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Sacred Intentions Shop</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 p-5 flex flex-col gap-4 animate-pulse h-[360px]">
                    <div className="h-56 bg-cream-light rounded-2xl w-full"></div>
                    <div className="h-4 bg-cream-light rounded-full w-20 mt-2"></div>
                    <div className="h-5 bg-cream-light rounded-full w-3/4"></div>
                    <div className="mt-auto h-8 bg-cream-light rounded-lg w-full"></div>
                  </div>
                ))
              ) : (
                products.map((product) => (
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
                ))
              )}
            </div>

            {!loading && (
              <div className="mt-12">
                <Link to="/shop" className="bg-white hover:bg-cream-light text-gold-dark border border-gold/45 text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 self-center hover:-translate-y-0.5 inline-block shadow-sm">
                  Explore Full Sacred Collection
                </Link>
              </div>
            )}
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
      <section className="py-24 bg-cream/20 px-6 md:px-12 border-b border-cream-dark/30 w-full text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-12 relative">
          <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Ascension Circles</span>
          <h2 className="font-serif text-3xl font-bold text-charcoal-dark mt-2 mb-12">Community Gallery</h2>

          {/* Carousel Wrapper */}
          <div className="relative overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${galleryIndex * (100 / galleryVisibleItems)}%)` }}
            >
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${100 / galleryVisibleItems}%` }}
                  className="shrink-0 p-2 sm:p-3"
                >
                  <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-cream-dark/50 hover:shadow-md transition-shadow duration-300">
                    <img 
                      src={img} 
                      alt="Community Gallery" 
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {galleryMaxIndex > 0 && (
              <>
                <button
                  onClick={prevGallerySlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white border border-cream-dark/40 shadow-sm hover:shadow-md text-charcoal hover:scale-105 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-charcoal" />
                </button>
                <button
                  onClick={nextGallerySlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white border border-cream-dark/40 shadow-sm hover:shadow-md text-charcoal hover:scale-105 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Indicator Dots */}
          {galleryMaxIndex > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: galleryMaxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setGalleryIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    galleryIndex === idx ? 'bg-gold-dark w-6' : 'bg-cream-dark/60 w-2 hover:bg-gold-light'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 12. Newsletter Section */}
      <section className="py-24 bg-[#FFFDF7] px-6 md:px-12 text-center w-full">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4 font-sans">
          <span className="font-sans text-[10px] sm:text-xs text-gold-dark tracking-[0.25em] font-bold uppercase">Stay Aligned</span>
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
