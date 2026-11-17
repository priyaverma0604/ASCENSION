import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Compass, Calendar, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Check,
  ShieldCheck, UserCheck, Heart, Lock, Sparkles, Award, Users, Shield, Star, Leaf,
  TrendingUp, ShoppingBag, Eye, HeartHandshake, MapPin, Mail, Phone, CalendarRange,
  Moon, Sun, Zap, Flame, X, Video, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import RegisterWorkshopModal from '../components/RegisterWorkshopModal';
import RegisterWebinarModal from '../components/RegisterWebinarModal';
import { DIWALI_DUO_CANDLES } from '../data/diwaliOffers';
import BookRetreatModal from '../components/BookRetreatModal';
import BookSessionModal from '../components/BookSessionModal';
import SeamlessWaterBackground from '../components/SeamlessWaterBackground';
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
import meditationCircle from '../assets/gallery/meditation_circle_candlelight.png';
import kunzumSpeaker from '../assets/gallery/kunzum_event_speaker.jpg';
import healingBooth from '../assets/gallery/healing_booth_reading.jpg';
import kunzumCommunity from '../assets/gallery/kunzum_community_group.jpg';
import whoWeAreBg from '../assets/who_we_are_bg.jpg';
import whatWeDo from '../assets/what_we_do.jpg';
import whyChooseAscension from '../assets/why_choose_ascension.jpg';
import personalizedHealingImg from '../assets/why_choose/personalized_healing.jpg';
import safeConfidentialImg from '../assets/why_choose/safe_and_confidential.jpg';
import experiencedGuidanceImg from '../assets/why_choose/experienced_guidance.jpg';
import holisticWellnessImg from '../assets/why_choose/holistic_wellness.jpg';
import natureInspiredImg from '../assets/why_choose/nature_inspired_healing.jpg';
import trustedByThousandsImg from '../assets/why_choose/trusted_by_thousands.jpg';
import smallLearnersSeva from '../assets/small_learners_seva.jpg';
import navratriBanner from '../assets/navratri_9_days_banner.jpg';

const getImageUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'string' && path.includes('navratri')) return navratriBanner;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || '';
  return `${apiBase}${path}`;
};

const DEFAULT_VIDEO_TESTIMONIALS = [
  {
    _id: 'video-1',
    name: 'Sonali Bhasin Kumar Healing Journey',
    designation: 'Sacred Spiritual Transformation',
    rating: 5,
    videoUrl: 'https://www.instagram.com/tv/CV68_YQBQS4/?xtok=c2IydGFnMnlxcWZt',
    embedUrl: 'https://www.instagram.com/p/CV68_YQBQS4/embed/',
    reviewText: 'A heartfelt client video testimonial reflecting on sacred angelic guidance, emotional release, and spiritual healing with Sonali Bhasin Kumar.',
    isVideo: true,
    videoType: 'instagram'
  },
  {
    _id: 'video-2',
    name: 'Sacred Awakening Experience',
    designation: 'Client Transformation & Energy Healing',
    rating: 5,
    videoUrl: 'https://www.instagram.com/reel/CZOJrvNLXlN/?cplk=bnA3d2JidjJreGN6',
    embedUrl: 'https://www.instagram.com/reel/CZOJrvNLXlN/embed/',
    reviewText: 'A transformative client video reflection on divine alignment, emotional peace, and miraculous inner healing through Ascension.',
    isVideo: true,
    videoType: 'instagram'
  }
];

const getInstagramEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed')) return url;
  const match = url.match(/instagram\.com\/(tv|reel|p)\/([A-Za-z0-9_-]+)/);
  if (match && match[2]) {
    const type = match[1] === 'reel' ? 'reel' : 'p';
    return `https://www.instagram.com/${type}/${match[2]}/embed/`;
  }
  return url;
};

const Home = ({ scrollToWebinar = false, autoOpenAncestral = false }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [workshops, setWorkshops] = useState([]);
  const [activeWorkshop, setActiveWorkshop] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialTab, setTestimonialTab] = useState('video');
  const [products, setProducts] = useState([]);
  const [diwaliProducts, setDiwaliProducts] = useState([]);
  const [retreats, setRetreats] = useState([]);
  const [activeRetreat, setActiveRetreat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-scroll to webinar section when accessed via /webinars, /webinar, direct ancestral route, #webinars, or prop
  useEffect(() => {
    const shouldScroll =
      scrollToWebinar ||
      autoOpenAncestral ||
      location.pathname === '/webinars' ||
      location.pathname === '/webinar' ||
      location.pathname === '/ancestral-healing-webinar' ||
      location.pathname === '/ancestral-webinar' ||
      location.pathname === '/webinar/ancestral-healing' ||
      location.pathname === '/webinars/ancestral-healing' ||
      location.hash === '#webinars' ||
      location.hash === '#webinar' ||
      location.hash === '#upcoming-events';

    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById('webinars') || document.getElementById('upcoming-events') || document.getElementById('webinar');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [location, scrollToWebinar, autoOpenAncestral]);

  // Auto-open active ancestral webinar modal if accessed via direct route or query param
  useEffect(() => {
    const isAncestralRoute =
      autoOpenAncestral ||
      location.pathname === '/ancestral-healing-webinar' ||
      location.pathname === '/ancestral-webinar' ||
      location.pathname === '/webinar/ancestral-healing' ||
      location.pathname === '/webinars/ancestral-healing' ||
      searchParams.get('webinar') === 'ancestral' ||
      searchParams.get('webinar') === 'ancestral-healing' ||
      searchParams.get('register') === 'true';

    if (isAncestralRoute) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const found = workshops.find(
        w => ((w.title && w.title.toLowerCase().includes('ancestral')) || (w.name && w.name.toLowerCase().includes('ancestral')) || w.isWebinar) && new Date(w.date) >= todayStart
      );

      if (found) {
        setActiveWorkshop(found);
      }
    }
  }, [location, searchParams, workshops, loading, autoOpenAncestral]);

  const handleOpenWorkshop = (workshop) => {
    setActiveWorkshop(workshop);
    const isAncestral =
      (workshop.title && workshop.title.toLowerCase().includes('ancestral')) ||
      (workshop.name && workshop.name.toLowerCase().includes('ancestral'));

    if (isAncestral) {
      window.history.pushState(null, '', '/ancestral-healing-webinar');
    }
  };

  const handleCloseWorkshop = () => {
    setActiveWorkshop(null);
    const isAncestralPath =
      location.pathname === '/ancestral-healing-webinar' ||
      location.pathname === '/ancestral-webinar' ||
      location.pathname === '/webinar/ancestral-healing' ||
      location.pathname === '/webinars/ancestral-healing' ||
      window.location.pathname === '/ancestral-healing-webinar';

    if (isAncestralPath) {
      window.history.pushState(null, '', '/webinars');
    }
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
    kunzumCommunity,
    healingBooth,
    meditationCircle,
    kunzumSpeaker,
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

  // Smooth scroll to webinars/workshops if page loads with hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#upcoming-events' || hash === '#webinars' || hash === '#workshops') {
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById('upcoming-events');
        if (element) {
          clearInterval(interval);
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
        attempts++;
        if (attempts > 20) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading, window.location.hash]);

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
        const activeWebinars = resWebinars.data.data
          .filter(w => new Date(w.date) >= todayStart && w.status !== 'Completed' && w.status !== 'Cancelled')
          .map(w => ({ ...w, isWebinar: true }));
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

      const resDiwali = await axios.get('/api/products', {
        params: { category: 'Diwali Special' }
      });
      if (resDiwali.data?.success && resDiwali.data.data.length > 0) {
        setDiwaliProducts(resDiwali.data.data.slice(0, 6)); // Top 6 featured Diwali creations
      }

      const resRetreats = await axios.get('/api/retreats');
      if (resRetreats.data.success) {
        setRetreats(resRetreats.data.data);
      }
    } catch (err) {
      console.error('Error fetching home data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRetreat = () => {
    setActiveRetreat({
      _id: 'spiritual-retreats-coming-soon',
      title: 'Spiritual Retreats',
      isComingSoon: true,
      description: 'Transformative multi-day spiritual retreats and sacred immersions in serene, nature-inspired sanctuaries. Curated destinations and dates will be announced soon.',
      images: ['/uploads/retreat_service.png']
    });
  };

  const handleOpenService = (serviceQuery) => {
    if (typeof serviceQuery === 'object' && serviceQuery !== null) {
      setSelectedService(serviceQuery);
      return;
    }
    const query = (serviceQuery || '').toLowerCase();
    const matched = services.find(s => 
      (s.title && s.title.toLowerCase().includes(query)) ||
      (query.includes('theta') && s.title?.toLowerCase().includes('theta')) ||
      (query.includes('sound') && s.title?.toLowerCase().includes('sound')) ||
      (query.includes('chakra') && s.title?.toLowerCase().includes('chakra')) ||
      (query.includes('oracle') && s.title?.toLowerCase().includes('oracle')) ||
      (query.includes('counsell') && s.title?.toLowerCase().includes('counsell')) ||
      (query.includes('meditat') && s.title?.toLowerCase().includes('meditat'))
    );

    if (matched) {
      setSelectedService(matched);
    } else {
      if (query.includes('theta')) {
        setSelectedService({
          _id: 'theta-healing-service',
          title: 'Distance Healing using Theta Modality',
          description: 'Theta Healing is a powerful energy healing technique that works at the subconscious level to identify and release limiting beliefs, fears, emotional trauma, and energetic blockages. Many individuals unknowingly carry deep-rooted emotional wounds from childhood, relationships, or past experiences. Theta Healing helps you release limiting beliefs, fears, emotional trauma, and energetic blockages at the subconscious level, transforming your reality and raising your vibration.',
          benefits: [
            'Identify and reprogram subconscious blockages',
            'Release deep-rooted fears, anxiety, and trauma',
            'Heal childhood wounds and relationship baggages',
            'Align mind, body, and soul with abundance and health'
          ],
          duration: 60,
          pricing: 3500,
          image: '/uploads/theta_healing_service.png'
        });
      } else if (query.includes('sound')) {
        setSelectedService({
          _id: 'sound-healing-service',
          title: 'Sound Healing',
          description: 'Sound Healing is a therapeutic modality that uses frequencies, vibrations, and instruments like Tibetan singing bowls to restore energetic balance and emotional harmony. Frequencies bypass logical blocks to touch the cellular level, restoring balance and deep relaxation to your nervous system.',
          benefits: [
            'Induce profound meditative states and deep relaxation',
            'Relieve physical tension and alleviate chronic insomnia',
            'Calm active mental chatter and reset cortisol levels',
            'Restore cell-level resonance using harmonic bowls'
          ],
          duration: 60,
          pricing: 2500,
          image: '/uploads/sound_healing_service.png'
        });
      } else if (query.includes('chakra')) {
        setSelectedService({
          _id: 'chakra-healing-service',
          title: 'Chakra Healing',
          description: 'Align and balance the seven major energy centers in your body. Purge stagnant, heavy, and negative energies from your auric field and restore the natural flow of prana/vitality. This session leaves you feeling completely grounded, centered, and physically re-energized.',
          benefits: [
            'Purify and rebalance the seven major chakra centers',
            'Harmonize emotional swings and remove energetic lethargy',
            'Strengthen your aura against negative ambient energies',
            'Increase physical vitality and mental clear-sightedness'
          ],
          duration: 60,
          pricing: 2800,
          image: '/uploads/chakra_healing_service.png'
        });
      } else if (query.includes('meditat')) {
        setSelectedService({
          _id: 'meditation-breathwork-service',
          title: 'Meditation & Breathwork Immersion',
          description: 'Cultivate mindfulness, quieten the inner chatter, and build a lasting connection to your spiritual wisdom. Guided breathing and stillness practices restore neurological equilibrium, lower stress, and awaken your intuitive capacity.',
          benefits: [
            'Cultivate profound inner stillness and mindfulness',
            'Master conscious Pranayama to reset cortisol levels',
            'Strengthen daily focus and emotional equilibrium',
            'Awaken intuitive connection and spiritual peace'
          ],
          duration: 45,
          pricing: 1800,
          image: '/uploads/meditation_service.png'
        });
      } else if (query.includes('oracle')) {
        setSelectedService({
          _id: 'oracle-card-reading-service',
          title: 'Oracle Card Reading Session',
          description: 'Sometimes the soul seeks direction and insight. Our Oracle Card Reading sessions provide intuitive guidance for career, relationships, financial decisions, and personal growth. Every reading is conducted with intuition, compassion, and positive energy.',
          benefits: [
            'Gain direct clarity on relationship and career roadblocks',
            'Receive supportive guidance from divine spiritual energies',
            'Re-align with your higher self and path forward',
            'Heal indecisiveness and find peace in current actions'
          ],
          duration: 45,
          pricing: 2100,
          image: '/uploads/oracle_card_reading_service.png'
        });
      } else if (query.includes('counsell')) {
        setSelectedService({
          _id: 'personal-counselling-service',
          title: 'Personal Counselling Session',
          description: 'Create a safe, confidential, and nurturing space to discuss emotional pain, anxiety, stress, or career roadblocks. Sonali Bhasin Kumar combines active empathy, transpersonal psychology, and energy understanding to guide you to find actionable paths forward.',
          benefits: [
            'Receive compassionate, non-judgmental professional counsel',
            'Explore stress and anxiety triggers in a supportive space',
            'Generate actionable frameworks for resolving life conflicts',
            'Restore self-love, boundaries, and personal empowerment'
          ],
          duration: 60,
          pricing: 3000,
          image: '/uploads/personal_counselling_service.png'
        });
      }
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

  const videoTestimonials = testimonials.filter(t => t.isVideo || Boolean(t.videoUrl));
  const writtenTestimonials = testimonials.filter(t => !t.isVideo && !t.videoUrl);
  const displayVideos = videoTestimonials.length > 0 ? videoTestimonials : DEFAULT_VIDEO_TESTIMONIALS;

  // Auto-scroll written testimonials when on written reviews tab
  useEffect(() => {
    if (writtenTestimonials.length <= 1 || testimonialTab !== 'written') return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev >= writtenTestimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [writtenTestimonials.length, testimonialTab]);

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
      <section className="relative min-h-[100svh] flex flex-col justify-between items-center px-4 sm:px-6 md:px-12 lg:px-20 text-center overflow-hidden border-b border-cream-dark/30 bg-cream-light pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8 2xl:pb-10">
        {/* Living Seamless Cinemagraph Water Flow Background */}
        <SeamlessWaterBackground />
        {/* Soft Radial Contrast Overlay to enhance text readability without fading the bottom edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.1)_80%)] z-0 pointer-events-none" />

        <div className="flex flex-col items-center gap-2.5 sm:gap-3.5 relative z-10 w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto animate-fade-in my-auto">

          {/* Flashy Live Webinar Announcement Flash Banner - Dynamic: only render when an active upcoming webinar exists */}
          {(() => {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const activeWebinar = workshops.find(w => w.isWebinar && new Date(w.date) >= todayStart && w.status !== 'Completed' && w.status !== 'Cancelled');
            if (activeWebinar) {
              return (
                <div 
                  onClick={() => handleOpenWorkshop(activeWebinar)}
                  className="group cursor-pointer inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/95 hover:bg-white border-2 border-[#D4A017] shadow-[0_4px_25px_rgba(212,160,23,0.35)] hover:shadow-[0_8px_35px_rgba(212,160,23,0.5)] transition-all duration-300 transform hover:scale-[1.03] mb-1 select-none animate-pulse"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    <span>REGISTRATIONS LIVE</span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-charcoal-dark tracking-wide font-sans truncate max-w-[170px] sm:max-w-none">
                    {activeWebinar.title}
                  </span>
                  <span className="text-[11px] sm:text-xs font-serif font-bold text-gold-dark flex items-center gap-1 group-hover:text-gold-darker">
                    <span className="hidden sm:inline">•</span> ₹{activeWebinar.price} Pass <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              );
            }

            return null;
          })()}

          <span className="font-cormorant text-xs sm:text-base 2xl:text-lg text-black font-bold tracking-wider uppercase">
            Reclaim your peace. Reconnect with your light.
          </span>

          <h1 className="font-noto text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold tracking-tight text-charcoal-dark leading-tight mt-1 sm:mt-2">
            A Sanctuary for <br />
            <span className="text-gold drop-shadow-[0_1.5px_2px_rgba(31,29,26,0.4)] font-extrabold">Spiritual Awakening</span> <br />
            & Healing
          </h1>

          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed font-sans mt-0.5">
            Embark on a profound journey of self-realization, emotional release, and energetic alignment. Experience custom angelic guidance, therapeutic sound baths, and subconscious healing in a secure, sacred environment.
          </p>

          {/* CTA Buttons - Guaranteed single line on all screen sizes */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto max-w-xl mx-auto mt-3.5 font-sans">
            <Link
              to="/services"
              className="bg-sage hover:bg-sage-dark text-white text-xs 2xl:text-sm font-bold uppercase tracking-wider py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group w-full sm:w-auto whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Explore Services</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              to="/donate"
              className="bg-cream-light hover:bg-cream-dark text-gold-dark border border-gold/45 text-xs 2xl:text-sm font-bold uppercase tracking-wider py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-center w-full sm:w-auto whitespace-nowrap shrink-0"
            >
              Support Our NGO
            </Link>
          </div>

        </div>

        {/* 1b. Trust Building Section Floating Card - Positioned cleanly below content without overlap */}
        <div className="relative z-20 max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl w-full mx-auto px-2 sm:px-6 mt-6 sm:mt-8 animate-slide-up">
          <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center shadow-xl border border-cream-dark/50 hover:shadow-2xl transition-all duration-300">

            {/* Column 1: Lives Touched */}
            <div className="flex flex-col text-left gap-1 px-2 sm:px-3 py-1 border-r border-cream-dark/50 w-full">
              <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">Lives Touched</span>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-serif text-base sm:text-lg md:text-xl 2xl:text-2xl font-bold text-charcoal-dark leading-none">
                  10,000+
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-light font-light mt-0.5 leading-none">Individuals guided</p>
            </div>

            {/* Column 2: Experience */}
            <div className="flex flex-col text-left gap-1 px-2 sm:px-3 py-1 lg:border-r border-cream-dark/50 w-full">
              <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">Experience</span>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-serif text-base sm:text-lg md:text-xl 2xl:text-2xl font-bold text-charcoal-dark leading-none">
                  150+
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-light font-light mt-0.5 leading-none">Sessions Conducted</p>
            </div>

            {/* Column 3: Holistic Approach */}
            <div className="flex flex-col text-left gap-1 px-2 sm:px-3 py-1 border-r border-cream-dark/50 w-full">
              <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">Holistic</span>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-serif text-xs sm:text-sm 2xl:text-base font-bold text-charcoal-dark leading-tight">
                  Mind • Body • Soul
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-light font-light mt-0.5 leading-none">Healing & Alignment</p>
            </div>

            {/* Column 4: Safe & Sacred Space */}
            <div className="flex flex-col text-left gap-1 px-2 sm:px-3 py-1 lg:border-r border-cream-dark/50 w-full">
              <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">Sacred Space</span>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-serif text-base sm:text-lg md:text-xl 2xl:text-2xl font-bold text-charcoal-dark leading-none">
                  100%
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-light font-light mt-0.5 leading-none">Confidential & Secure</p>
            </div>

            {/* Column 5: Guided By */}
            <div className="flex flex-col text-left gap-1 px-2 sm:px-3 py-1 col-span-2 sm:col-span-2 lg:col-span-1 border-t lg:border-t-0 pt-2 lg:pt-0 border-cream-dark/50 w-full">
              <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">Guided by</span>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gold/10 text-gold shrink-0">
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark leading-tight whitespace-nowrap">
                  Sonali Bhasin Kumar
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-charcoal-light font-light mt-0.5 leading-none">Expert. Healer. Mentor.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE DIWALI SALE - FEATURED FESTIVE STOREFRONT (Zepto / Amazon Festive Sale Style) */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EC] to-[#FFFDF7] px-3 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full relative overflow-hidden text-center">
        {/* Festive Ambient Background Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-amber-300/25 via-orange-200/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto relative z-10">
          
          {/* Festive Sale Header */}
          <div className="flex flex-col items-center text-center gap-2 max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-400/50 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-2xs">
              <span className="text-base">✨</span>
              <span>ARTISANAL BOTANICAL COLLECTION</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-bold text-charcoal-dark tracking-tight mt-1">
              Handcrafted Floral Candles & <span className="text-amber-700">Auspicious Lotus Diyas</span>
            </h2>

            <p className="text-xs sm:text-sm text-charcoal-light font-sans leading-relaxed max-w-2xl mt-0.5">
              Pure artisanal botanical soy wax with hand-poured fragrant floral motifs and blessed lotus diyas. Bring warmth, divine light, and fragrance into every corner of your home.
            </p>

            {/* Festive Deals Spotlight Card (Zepto / Amazon Sale Hero Card) */}
            <div className="w-full mt-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md shadow-md flex flex-col lg:flex-row items-center justify-between gap-4 text-left border border-amber-200/60">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <span>🎁</span>
                    <span>FESTIVE DUO DEAL</span>
                  </span>
                  <span className="font-serif text-sm sm:text-base font-bold text-charcoal-dark">
                    Buy Any 2 Candle Colors for ₹999
                  </span>
                  <span className="font-serif text-xs text-charcoal-light line-through decoration-red-400">
                    ₹1,110
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Save ₹111
                  </span>
                </div>
                {/* Color Swatch Preview Pills */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-sans">
                  <span className="text-charcoal-light font-medium text-[10px] uppercase tracking-wider">Available Colors:</span>
                  {DIWALI_DUO_CANDLES.map((c) => (
                    <Link
                      key={c.id}
                      to={`/product/${c.id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-light/80 hover:bg-amber-100 border border-cream-dark/60 text-charcoal-dark text-[11px] font-medium transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs border border-white" style={{ backgroundColor: c.colorHex }} />
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/shop?category=Diwali%20Special"
                className="w-full lg:w-auto bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:brightness-105 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap text-center"
              >
                Shop Festive Duo →
              </Link>
            </div>
          </div>

          {/* 6-Candle Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {DIWALI_DUO_CANDLES.map((candle) => {
              const apiProduct = diwaliProducts.find(p => p.name?.toLowerCase().includes(candle.name.toLowerCase()));
              const productId = apiProduct?._id || candle.id;
              const displayImage = candle.image;

              return (
                <div
                  key={candle.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col text-left p-2.5 sm:p-3 relative border border-cream-dark/40"
                >
                  <Link to={`/product/${productId}`} className="h-32 sm:h-36 bg-cream-light rounded-xl overflow-hidden relative mb-2 block">
                    <img
                      src={getImageUrl(displayImage)}
                      alt={candle.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Buy 2 @ ₹999
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-2 h-2 rounded-full border border-white shadow-2xs shrink-0" style={{ backgroundColor: candle.colorHex }} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 font-sans truncate">
                          {candle.colorName}
                        </span>
                      </div>
                      <Link to={`/product/${productId}`}>
                        <h4 className="font-serif text-xs font-bold text-charcoal-dark line-clamp-1 group-hover:text-amber-800 transition-colors">
                          {candle.name}
                        </h4>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between border-t border-cream-dark/40 pt-2">
                      <div className="flex flex-col">
                        <span className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark leading-tight">
                          ₹555
                        </span>
                        <span className="text-[9px] text-amber-800 font-sans font-semibold">
                          Duo: ₹999
                        </span>
                      </div>
                      <Link
                        to={`/product/${productId}`}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Buy Duo
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action: View All */}
          <div className="flex items-center justify-center mt-8 font-sans">
            <Link
              to="/shop?category=Diwali%20Special"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
            >
              <span>Explore Handcrafted Candles & Hampers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Discover Ascension */}
      <section className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto">
          <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Discover Ascension</span>
          <h2 className="font-serif text-3xl md:text-4xl 2xl:text-5xl font-bold text-charcoal-dark mt-2">Begin Your Healing Journey</h2>
          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed font-sans mt-3">
            Discover who we are, what we offer, and why thousands trust Ascension.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">

            {/* Card 1: Who We Are */}
            <Link to="/about" className="group relative rounded-[24px] p-8 shadow-md border border-cream-dark/50 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center h-[340px] min-h-[340px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${whoWeAreBg})` }} />
              <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/65 transition-colors duration-300" />
              <div className="relative z-10 flex flex-col items-center h-full text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg 2xl:text-xl font-bold text-white mb-4">Who We Are</h3>
                <p className="text-xs 2xl:text-sm text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
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
                <h3 className="font-serif text-lg 2xl:text-xl font-bold text-white mb-4">What We Do</h3>
                <p className="text-xs 2xl:text-sm text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
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
                <h3 className="font-serif text-lg 2xl:text-xl font-bold text-white mb-4">Why Choose Ascension</h3>
                <p className="text-xs 2xl:text-sm text-cream-light/95 leading-relaxed font-sans mb-8 flex-grow">
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

      {/* 3. Upcoming Webinars & Workshops */}
      {(loading || workshops.filter(w => !w.title || !w.title.toLowerCase().includes("lion")).length > 0) && (
        <section id="webinars" className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center scroll-mt-24 relative">
          <span id="webinar" className="absolute -top-24"></span>
          <span id="upcoming-events" className="absolute -top-24"></span>
          <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto">
            {workshops.some(w => w.isWebinar) && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/25 text-red-600 font-sans text-[10px] font-extrabold uppercase tracking-widest mb-3 animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span>LIVE GATHERINGS & WEBINARS</span>
              </div>
            )}
            <h2 className="font-serif text-3xl 2xl:text-4xl font-bold text-charcoal-dark mt-1 mb-10 sm:mb-12">Upcoming Webinars & Workshops</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                workshops
                  .filter((workshop) => !workshop.title || !workshop.title.toLowerCase().includes("lion"))
                  .slice(0, 3)
                  .map((workshop) => {
                    const isAncestral = workshop.title && workshop.title.toLowerCase().includes("ancestral");
                    const dateObj = workshop.date ? new Date(workshop.date) : new Date();
                    const dateFormatted = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                    return (
                      <div 
                        key={workshop._id} 
                        onClick={() => handleOpenWorkshop(workshop)}
                        className={`group bg-white rounded-3xl overflow-hidden transition-all duration-300 flex flex-col text-left h-full cursor-pointer hover:-translate-y-1 ${
                          isAncestral 
                            ? 'border-2 border-[#D4A017] ring-2 ring-[#D4A017]/40 shadow-[0_12px_45px_rgba(212,160,23,0.3)] hover:shadow-[0_24px_65px_rgba(212,160,23,0.45)] bg-[#FFFDF7]' 
                            : 'border border-cream-dark/50 hover:border-gold-dark/45 shadow-md hover:shadow-2xl'
                        }`}
                      >
                        {/* Image Section */}
                        <div className="h-48 overflow-hidden bg-cream relative">
                          <img
                            src={getImageUrl(workshop.coverImage || workshop.image || (isAncestral ? "/uploads/ancestral_healing_webinar_bg.png" : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"))}
                            alt={workshop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Date Badge */}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase text-sage-dark shadow-sm flex items-center gap-1 font-sans border border-cream-dark/30 select-none z-10">
                            <Calendar className="w-3.5 h-3.5 text-sage" />
                            <span>{dateFormatted}</span>
                          </div>

                          {workshop.isWebinar && (
                            <div className="absolute top-3.5 right-3.5 bg-red-600 text-white font-sans px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-red-600/50 flex items-center gap-1.5 animate-pulse border border-white/40 z-10">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                              <span>REGISTRATIONS LIVE</span>
                            </div>
                          )}
                        </div>

                        {/* Urgency Ribbon for Live Webinar */}
                        {isAncestral && (
                          <div className="bg-gradient-to-r from-amber-600 via-red-500 to-amber-600 text-white text-[10px] font-bold px-4 py-1.5 flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1.5 font-sans">
                              <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-bounce" />
                              <span>Live Zoom Session • Limited Seats</span>
                            </span>
                            <span className="bg-black/30 text-yellow-300 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                              🔥 85% Booked
                            </span>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2 leading-snug group-hover:text-gold-dark transition-colors">
                            {workshop.title}
                          </h3>
                          <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans line-clamp-3 mb-6">
                            {workshop.shortDescription || workshop.description}
                          </p>

                          {/* Footer Section */}
                          <div className="mt-auto border-t border-cream-dark/40 pt-4 flex justify-between items-center font-sans text-xs">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] text-charcoal-light uppercase tracking-wider font-semibold">Investment</span>
                              <span className="font-serif font-bold text-gold-dark text-sm 2xl:text-base mt-0.5">
                                ₹{workshop.price !== undefined ? workshop.price : (workshop.pricing || 99)}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWorkshop(workshop);
                              }}
                              className={`text-[10px] font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all duration-300 shadow-md flex items-center gap-1.5 ${
                                isAncestral 
                                  ? 'bg-gradient-to-r from-[#D4A017] via-[#F3C048] to-[#D4A017] hover:from-[#B38610] hover:to-[#B38610] text-[#111111] ring-2 ring-[#D4A017]/60 shadow-gold/40 animate-pulse hover:scale-105' 
                                  : 'bg-sage hover:bg-sage-dark text-white'
                              }`}
                            >
                              {isAncestral ? (
                                <>
                                  <Zap className="w-3.5 h-3.5 text-charcoal-dark fill-charcoal-dark" />
                                  <span>⚡ REGISTER NOW (LIVE)</span>
                                </>
                              ) : (
                                <span>Register Now</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* If more than 3, redirect to programs page */}
            {!loading && workshops.filter(w => !w.title || !w.title.toLowerCase().includes("lion")).length > 3 && (
              <div className="mt-12">
                <Link to="/webinars" className="text-xs font-bold text-sage-dark uppercase tracking-wider hover:text-gold flex items-center justify-center gap-1">
                  <span>View All Upcoming Gatherings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Healing Services */}
      <section className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto">
          <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Premium Modalities</span>
          <h2 className="font-serif text-3xl md:text-4xl 2xl:text-5xl font-bold text-charcoal-dark mt-2 mb-12 sm:mb-16">Healing Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Service 1: Theta Healing */}
            <div 
              onClick={() => handleOpenService('theta')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/theta_healing_service.png')} 
                  alt="Theta Healing" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Theta Healing</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Release deep subconscious blocks, negative patterns, and emotional trauma to align with your highest potential.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('theta'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 2: Sound Healing */}
            <div 
              onClick={() => handleOpenService('sound')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/sound_healing_service.png')} 
                  alt="Sound Healing" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Sound Healing</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Rebalance your energetic fields, reduce stress, and achieve deep relaxation through sacred sound baths.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('sound'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 3: Chakra Healing */}
            <div 
              onClick={() => handleOpenService('chakra')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/chakra_healing_service.png')} 
                  alt="Chakra Healing" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Chakra Healing</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Harmonize your primary energy centers (chakras) using crystals, energy transfer, and focused intentions.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('chakra'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 4: Meditation */}
            <div 
              onClick={() => handleOpenService('meditat')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/meditation_service.png')} 
                  alt="Meditation" 
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Meditation</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Cultivate mindfulness, quieten the inner mind, and build a lasting connection to your spiritual wisdom.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('meditat'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 5: Oracle Guidance */}
            <div 
              onClick={() => handleOpenService('oracle')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/oracle_card_reading_service.png')} 
                  alt="Oracle Guidance" 
                  className="w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <Moon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Oracle Guidance</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Receive intuitive divine messages, clarity for your path, and answers to your soul's deepest questions.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('oracle'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 6: Personal Counselling */}
            <div 
              onClick={() => handleOpenService('counsell')}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/personal_counselling_service.png')} 
                  alt="Personal Counselling" 
                  className="w-full h-full object-cover object-[center_22%] group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gold shadow-sm z-20">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark mb-2">Personal Counselling</h3>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Confidential one-on-one sessions to navigate life transitions, release anxiety, and restore emotional equilibrium.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenService('counsell'); }}
                className="text-xs font-bold text-sage hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Service 7: Spiritual Retreats */}
            <div 
              onClick={() => handleOpenRetreat()}
              className="group bg-white rounded-[24px] p-6 shadow-md border border-cream-dark/40 hover:border-gold-dark/45 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col text-left cursor-pointer relative overflow-hidden"
            >
              <div className="h-52 rounded-2xl overflow-hidden mb-5 relative bg-cream border border-cream-dark/40 shadow-2xs">
                <img 
                  src={getImageUrl('/uploads/retreat_service.png')} 
                  alt="Spiritual Retreats" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-gold-dark font-sans text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-20 flex items-center gap-1 border border-gold/30">
                  <Sparkles className="w-3 h-3 text-gold-dark" />
                  <span>Coming Soon</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-base 2xl:text-lg font-bold text-charcoal-dark">Spiritual Retreats</h3>
                <span className="text-[9px] bg-gold/15 text-gold-dark font-bold px-2 py-0.5 rounded-full border border-gold/30 uppercase tracking-wider">
                  Curating
                </span>
              </div>
              <p className="text-xs 2xl:text-sm text-charcoal-light leading-relaxed font-sans mb-6 flex-grow">
                Immerse yourself in nature-inspired, sacred sanctuaries and holy gatherings for transformative multi-day healing programs. Dates and destinations announcing soon.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenRetreat(); }}
                className="text-xs font-bold text-gold-dark hover:text-sage uppercase tracking-wider flex items-center gap-1 mt-auto font-sans text-left"
              >
                <span>Coming Soon — Get Priority Access</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Why Choose Ascension */}
      <section id="why-choose" className="py-20 md:py-24 bg-cream/20 px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center scroll-mt-20">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto">
          <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Sacred Safety & Experienced Care</span>
          <h2 className="font-serif text-3xl md:text-4xl 2xl:text-5xl font-bold text-charcoal-dark mt-2 mb-12 sm:mb-16">Why Choose Ascension</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Feature 1: Personalized Healing */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={personalizedHealingImg} 
                alt="Personalized Healing" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Feature 2: Safe & Confidential */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={safeConfidentialImg} 
                alt="Safe & Confidential" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Feature 3: Experienced Guidance */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={experiencedGuidanceImg} 
                alt="Experienced Guidance" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Feature 4: Nature Inspired Healing */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={natureInspiredImg} 
                alt="Nature Inspired Healing" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Feature 5: Holistic Wellness */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={holisticWellnessImg} 
                alt="Holistic Wellness" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

            {/* Feature 6: Trusted by Thousands */}
            <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/40 hover:border-gold-dark/45 transition-all duration-300 bg-white">
              <img 
                src={trustedByThousandsImg} 
                alt="Trusted by Thousands" 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Meet the Founder */}
      <section className="py-20 md:py-24 bg-cream/20 px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: Picture */}
          <div className="relative justify-self-center">
            <div className="w-64 sm:w-72 2xl:w-80 h-[380px] sm:h-[420px] 2xl:h-[460px] rounded-3xl overflow-hidden shadow-xl border border-gold-dark/20 relative">
              <img
                src={founderImg}
                alt="Sonali Bhasin Kumar"
                className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            {/* Elegant quote bubble */}
            <div className="absolute -bottom-6 left-2 right-2 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl shadow-xl border border-cream-dark/40 max-w-[240px] mx-auto md:left-auto md:right-[-24px] md:bottom-[-24px] md:max-w-[220px]">
              <p className="font-cormorant text-xs sm:text-[13px] 2xl:text-sm text-gold-dark font-bold">"Together, we rise by uplifting others and healing within."</p>
              <p className="font-sans text-[9px] uppercase tracking-wider text-charcoal-light mt-1.5">- Sonali Bhasin Kumar</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-5 sm:gap-6 text-left">
            <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Meet The Founder</span>
            <h2 className="font-serif text-3xl md:text-4xl 2xl:text-5xl font-bold text-charcoal-dark">Sonali Bhasin Kumar</h2>
            <div className="w-12 h-[1px] bg-gold-dark/40"></div>
            <p className="text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed font-sans">
              Sonali Bhasin Kumar is a certified spiritual healer, manifestation coach, and holistic therapist. Combining subconscious restructuring through Theta healing, high-frequency sound baths, and intuitive angelic guidance, she serves as a compassionate channel for your self-realization and release.
            </p>
            <p className="text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed font-sans">
              Her ultimate mission is to help individuals transcend deep-seated emotional trauma, clear karmic residue, and align with the light of their true essence, nurturing a peaceful recovery.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-cream-dark/50 py-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="font-serif text-gold-dark font-bold text-lg 2xl:text-xl">10+ Years</span>
                <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider">Healing Experience</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-serif text-gold-dark font-bold text-lg 2xl:text-xl">10,000+</span>
                <span className="text-[10px] sm:text-xs text-charcoal-light uppercase tracking-wider">Lives Empowered</span>
              </div>
            </div>

            <Link
              to="/about"
              className="bg-sage hover:bg-sage-dark text-white font-sans text-xs 2xl:text-sm font-bold uppercase tracking-wider py-3.5 sm:py-4 px-8 rounded-xl shadow-md transition-all duration-300 self-start hover:-translate-y-0.5 mt-2 whitespace-nowrap shrink-0"
            >
              Know My Journey
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Testimonials Section */}
      {(loading || testimonials.length > 0 || displayVideos.length > 0) && (
        <section className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center relative">
          <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
            <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">
              Devotee Experiences
            </span>
            <h2 className="font-serif text-3xl 2xl:text-4xl font-bold text-charcoal-dark mt-2 mb-3">
              Client Transformations & Stories
            </h2>
            <p className="font-serif italic text-xs sm:text-sm md:text-base text-charcoal-light max-w-xl mx-auto mb-8">
              Hear directly from seekers who have experienced deep energetic healing, emotional release, and spiritual ascension with Sonali Bhasin Kumar.
            </p>

            {/* Testimonials Switcher Tabs */}
            <div className="inline-flex items-center p-1.5 bg-cream/70 border border-cream-dark/80 rounded-full shadow-inner mb-10 gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setTestimonialTab('video')}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  testimonialTab === 'video'
                    ? 'bg-gold text-white shadow-md shadow-gold/25 scale-102'
                    : 'text-charcoal-dark hover:text-gold hover:bg-white/60'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Stories ({displayVideos.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setTestimonialTab('written')}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  testimonialTab === 'written'
                    ? 'bg-gold text-white shadow-md shadow-gold/25 scale-102'
                    : 'text-charcoal-dark hover:text-gold hover:bg-white/60'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Written Reviews ({writtenTestimonials.length})</span>
              </button>
            </div>

            {/* Video Testimonials Tab Content */}
            {testimonialTab === 'video' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl 2xl:max-w-5xl mx-auto items-stretch">
                  {displayVideos.map((item, idx) => {
                    const embedSrc = getInstagramEmbedUrl(item.videoUrl) || item.embedUrl;
                    const igDirectUrl = item.videoUrl || 'https://www.instagram.com/ascension_sonalibhasinkumar/';
                    return (
                      <div
                        key={item._id || idx}
                        className="bg-white rounded-[28px] p-4 sm:p-6 shadow-md hover:shadow-xl border border-cream-dark/60 transition-all duration-300 flex flex-col justify-between text-left"
                      >
                        {/* Card Top Details */}
                        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-cream-dark/40">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/15 text-gold-dark shrink-0">
                              <Video className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider block">
                                Verified Video Experience
                              </span>
                              <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal-dark leading-tight line-clamp-1">
                                {item.name}
                              </h3>
                            </div>
                          </div>
                          <div className="flex text-gold text-xs gap-0.5" title="5 Star Healing Experience">
                            {'★'.repeat(item.rating || 5)}
                          </div>
                        </div>

                        {/* Instagram Video Player Embed */}
                        <div className="relative w-full rounded-2xl overflow-hidden bg-cream/30 border border-cream-dark/50 shadow-inner flex justify-center items-center">
                          <iframe
                            src={embedSrc}
                            title={item.name}
                            className="w-full h-[520px] border-0"
                            scrolling="no"
                            allowTransparency="true"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          />
                        </div>

                        {/* Card Footer */}
                        <div className="mt-4 pt-3.5 border-t border-cream-dark/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                          <div className="flex-1 pr-2">
                            {item.designation && (
                              <p className="text-[10px] text-gold-dark font-bold uppercase tracking-wider">
                                {item.designation}
                              </p>
                            )}
                            <p className="text-xs text-charcoal-light line-clamp-2 mt-0.5 leading-relaxed">
                              {item.reviewText}
                            </p>
                          </div>
                          <a
                            href={igDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sage-dark hover:text-gold transition-colors self-start sm:self-auto shrink-0 bg-cream/70 hover:bg-cream-dark/40 px-3.5 py-2 rounded-full border border-cream-dark/70 shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                            </svg>
                            <span>Open on Instagram</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Switch to Written Tab Callout */}
                {writtenTestimonials.length > 0 && (
                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={() => setTestimonialTab('written')}
                      className="text-xs font-sans text-charcoal-light hover:text-gold transition-colors inline-flex items-center gap-1.5 underline decoration-gold/40 hover:decoration-gold cursor-pointer"
                    >
                      <span>Prefer to read words of gratitude? Browse our written devotee reviews</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Written Testimonials Tab Content */}
            {testimonialTab === 'written' && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[28px] shadow-md border border-cream-dark/40 min-h-[260px] flex flex-col justify-center items-center gap-4 relative">
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
                  ) : writtenTestimonials.length > 0 ? (
                    (() => {
                      const current = writtenTestimonials[activeTestimonial] || writtenTestimonials[0];
                      return (
                        <>
                          {/* Star Rating */}
                          <div className="flex text-gold text-sm gap-1 mb-2">
                            {'★'.repeat(current.rating || 5)}
                          </div>
                          <div className="h-[220px] sm:h-[180px] md:h-[140px] flex items-center justify-center overflow-y-auto py-2 w-full">
                            <p className="font-serif italic text-xs sm:text-sm md:text-base 2xl:text-lg text-charcoal-light leading-relaxed max-w-2xl text-center">
                              "{current.reviewText}"
                            </p>
                          </div>

                          <div className="flex items-center gap-3 mt-6 font-sans text-left">
                            {current.image ? (
                              <img
                                src={getImageUrl(current.image)}
                                alt={current.name}
                                className="w-12 h-12 rounded-full object-cover border border-cream-dark"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              style={{ display: current.image ? 'none' : 'flex' }}
                              className="w-12 h-12 rounded-full bg-gold/10 text-gold items-center justify-center border border-cream-dark font-serif font-bold text-sm"
                            >
                              {current.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="text-xs 2xl:text-sm font-bold text-charcoal-dark">{current.name}</p>
                              {current.designation && (
                                <p className="text-[10px] text-gold-dark uppercase tracking-wider font-bold mt-0.5">
                                  {current.designation}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Slider Arrows */}
                          {writtenTestimonials.length > 1 && (
                            <div className="absolute inset-y-0 w-full flex items-center justify-between pointer-events-none px-2 sm:px-4">
                              <button
                                type="button"
                                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? writtenTestimonials.length - 1 : prev - 1))}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white hover:bg-cream-light border border-cream-dark/50 flex items-center justify-center text-charcoal hover:text-gold transition-colors focus:outline-none shadow-sm cursor-pointer"
                                aria-label="Previous review"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveTestimonial((prev) => (prev === writtenTestimonials.length - 1 ? 0 : prev + 1))}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white hover:bg-cream-light border border-cream-dark/50 flex items-center justify-center text-charcoal hover:text-gold transition-colors focus:outline-none shadow-sm cursor-pointer"
                                aria-label="Next review"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <p className="text-charcoal-light italic">No written reviews yet.</p>
                  )}
                </div>

                {/* Testimonial Indicators */}
                {!loading && writtenTestimonials.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {writtenTestimonials.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonial(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                          idx === activeTestimonial ? 'bg-gold w-5' : 'bg-gold/30'
                        }`}
                        aria-label={`Go to review ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                )}

                {/* Switch to Video Tab Callout */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setTestimonialTab('video')}
                    className="text-xs font-sans text-charcoal-light hover:text-gold transition-colors inline-flex items-center gap-1.5 underline decoration-gold/40 hover:decoration-gold cursor-pointer"
                  >
                    <span>Watch real video transformations & Instagram stories</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Ascension Seva NGO */}
      <section ref={sevaRef} className="py-12 md:py-16 bg-[#FCFBF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full relative overflow-hidden flex items-center">
        {/* Subtle Mandala Watermark */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-[0.05] bg-contain bg-no-repeat bg-left z-0 mix-blend-multiply"
          style={{ backgroundImage: `url(${mandalaWatermark})` }}
        />

        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch w-full relative z-10">
          <div className={`flex flex-col justify-between h-full gap-4 text-left transition-all duration-[1s] transform ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col gap-2 md:gap-3">
              {/* Eyebrow */}
              <span className="font-sans text-xs 2xl:text-sm tracking-[0.25em] font-bold text-gold-dark uppercase select-none">
                Healing Humanity
              </span>

              {/* Logo */}
              <div className="flex justify-start w-full">
                <img 
                  src={`${sevaLogo}?v=3`} 
                  alt="Ascension Seva Logo" 
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-all duration-300 transform hover:scale-[1.02]" 
                />
              </div>

              {/* Mission Statement */}
              <p className="text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed font-sans max-w-[540px] my-1">
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
                      <h4 className="font-bold text-xs uppercase tracking-wide text-charcoal-dark font-sans group-hover:text-gold-dark transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-charcoal-light font-light text-[11px] 2xl:text-xs leading-relaxed mt-0.5 font-sans">
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
              <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-1 font-sans transition-all duration-700 delay-1000 ${sevaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <Link
                  to="/donate"
                  className="w-full sm:w-auto text-center bg-gradient-to-r from-gold via-gold-light to-gold-dark hover:brightness-[1.03] text-charcoal-dark font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all duration-300 shadow-md transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  Donate Now
                </Link>
                <Link
                  to="/ngo"
                  className="w-full sm:w-auto text-center bg-transparent hover:bg-cream-light/30 border border-cream-dark/80 text-charcoal-dark font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
          </div>

          <div className={`relative z-10 w-full flex items-center justify-center transition-all duration-[1.2s] transform ${sevaVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Image Wrapper */}
            <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl border border-cream-dark/50 bg-cream group">
              <img
                src={smallLearnersSeva}
                alt="Ascension Seva NGO - Small Learners Big Tomorrows"
                className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
              />
              
              {/* Floating Badge Top Left */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 backdrop-blur-md bg-white/75 border border-cream-dark/40 shadow-lg rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2.5 animate-float-slow select-none">
                <span className="text-lg sm:text-xl filter drop-shadow-xs">🍲</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] sm:text-xs font-bold text-charcoal-dark uppercase tracking-wider">Meals</span>
                  <span className="text-[9px] sm:text-[10px] text-sage font-semibold uppercase tracking-wide">Distributed</span>
                </div>
              </div>

              {/* Floating Badge Bottom Right */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 backdrop-blur-md bg-white/75 border border-cream-dark/40 shadow-lg rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2.5 animate-float-slower select-none">
                <span className="text-lg sm:text-xl filter drop-shadow-xs">❤️</span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] sm:text-xs font-bold text-charcoal-dark uppercase tracking-wider">500+</span>
                  <span className="text-[9px] sm:text-[10px] text-sage font-semibold uppercase tracking-wide">Volunteers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 8. Featured Shop (Optimized 2-column on mobile phones!) */}
      {(loading || products.length > 0) && (
        <section className="py-20 md:py-24 bg-cream/20 px-3 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
          <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto">
            <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Spiritual Tools</span>
            <h2 className="font-serif text-3xl 2xl:text-4xl font-bold text-charcoal-dark mt-2 mb-10 sm:mb-12">Sacred Intentions Shop</h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-cream-dark/50 p-3 sm:p-5 flex flex-col gap-3 animate-pulse h-[280px] sm:h-[360px]">
                    <div className="h-36 sm:h-56 bg-cream-light rounded-xl sm:rounded-2xl w-full"></div>
                    <div className="h-3 bg-cream-light rounded-full w-20 mt-1"></div>
                    <div className="h-4 bg-cream-light rounded-full w-3/4"></div>
                    <div className="mt-auto h-7 bg-cream-light rounded-lg w-full"></div>
                  </div>
                ))
              ) : (
                products.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-dark/50 hover:border-gold-dark/45 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left p-2.5 sm:p-4">
                    <div className="h-36 sm:h-52 2xl:h-56 overflow-hidden bg-cream-light rounded-xl sm:rounded-2xl relative mb-2">
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-xs rounded-full p-1.5 sm:p-2 text-gold shadow-sm">
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-sage font-bold font-sans">{product.category}</span>
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark mb-2 line-clamp-1 group-hover:text-gold transition-colors">{product.name}</h3>

                      <div className="mt-auto pt-2 border-t border-cream-dark/30 flex justify-between items-center font-sans text-xs">
                        <span className="font-serif font-bold text-gold-dark text-xs sm:text-sm 2xl:text-base">
                          ₹{product.pricing || product.price || (product.name && product.name.toLowerCase().includes('boat') ? 475 : 375)}
                        </span>
                        <Link
                          to={`/product/${product._id}`}
                          className="text-sage hover:text-gold font-bold uppercase tracking-wider flex items-center gap-0.5 text-[9px] sm:text-[10px]"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!loading && (
              <div className="mt-10 sm:mt-12">
                <Link to="/shop" className="bg-white hover:bg-cream-light text-gold-dark border border-gold/45 text-xs font-bold uppercase tracking-wider py-3.5 sm:py-4 px-8 rounded-xl transition-all duration-300 self-center hover:-translate-y-0.5 inline-block shadow-sm">
                  Explore Full Sacred Collection
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 10. Donation CTA Banner (Premium placement near bottom) */}
      <section className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center">
        <div
          className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto rounded-3xl text-white p-8 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center gap-6 sm:gap-8 animate-fade-in bg-cover bg-center border border-cream-dark/30"
          style={{ backgroundImage: `url(${foodSeva})` }}
        >
          {/* Dark Overlay for premium text contrast */}
          <div className="absolute inset-0 bg-charcoal-dark/75 z-0"></div>

          <div className="flex flex-col items-center max-w-2xl relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-gold mb-4 sm:mb-5">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gold fill-gold/15" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide text-white leading-tight">
              Your Contribution Creates Healing
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-cream-light/90 max-w-xl mt-3 leading-relaxed font-light">
              Every donation helps us provide healing workshops, food distribution, skill training, and vital support to those who need it most.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md relative z-10">
            <Link
              to="/donate"
              className="bg-gold hover:bg-gold-dark text-charcoal-dark rounded-xl py-3.5 sm:py-4 px-8 font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-xs uppercase tracking-wider shrink-0 font-sans flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              <span>Donate Now</span>
              <Heart className="w-4 h-4 text-charcoal-dark shrink-0 fill-charcoal-dark" />
            </Link>
          </div>

          {/* Luxury Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-white/15 pt-6 sm:pt-8 w-full max-w-3xl mt-2 font-sans text-xs relative z-10">
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
      <section className="py-20 md:py-24 bg-cream/20 px-4 sm:px-6 md:px-12 border-b border-cream-dark/30 w-full text-center relative overflow-hidden">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto px-2 sm:px-12 relative">
          <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Ascension Circles</span>
          <h2 className="font-serif text-3xl 2xl:text-4xl font-bold text-charcoal-dark mt-2 mb-10 sm:mb-12">Community Gallery</h2>

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
                  <div className="h-48 sm:h-64 rounded-2xl overflow-hidden shadow-sm border border-cream-dark/50 hover:shadow-md transition-shadow duration-300">
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 sm:-ml-4 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white border border-cream-dark/40 shadow-sm hover:shadow-md text-charcoal hover:scale-105 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
                </button>
                <button
                  onClick={nextGallerySlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 sm:-mr-4 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white border border-cream-dark/40 shadow-sm hover:shadow-md text-charcoal hover:scale-105 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
                </button>
              </>
            )}
          </div>

          {/* Indicator Dots */}
          {galleryMaxIndex > 0 && (
            <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
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
      <section className="py-20 md:py-24 bg-[#FFFDF7] px-4 sm:px-6 md:px-12 text-center w-full">
        <div className="max-w-xl 2xl:max-w-2xl mx-auto flex flex-col items-center gap-4 font-sans">
          <span className="font-sans text-xs 2xl:text-sm text-gold-dark tracking-[0.25em] font-bold uppercase">Stay Aligned</span>
          <h2 className="font-serif text-2xl 2xl:text-3xl font-bold text-charcoal-dark">Subscribe to the Ascension Newsletter</h2>
          <p className="text-xs sm:text-sm 2xl:text-base text-charcoal-light leading-relaxed max-w-sm">
            Receive monthly newsletters detailing full Moon rituals, energy forecasts, and upcoming retreats.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md mt-2">
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
          onClose={handleCloseWorkshop}
        />
      ) : activeWorkshop && (
        <RegisterWorkshopModal
          workshop={activeWorkshop}
          onClose={handleCloseWorkshop}
        />
      )}

      {/* Retreat Registration / Inquiry Modal */}
      {activeRetreat && (
        <BookRetreatModal
          retreat={activeRetreat}
          onClose={() => setActiveRetreat(null)}
        />
      )}

      {/* Service Booking & Details Modal */}
      {selectedService && (
        <BookSessionModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default Home;
