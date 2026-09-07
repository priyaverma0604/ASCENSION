import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, ArrowRight, Share2, Copy, Check, 
  MessageCircle, Sparkles, ChevronRight, ShieldCheck, Video, 
  BookOpen, Star, Heart, ArrowLeft, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EnrollProgramModal from '../components/EnrollProgramModal';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const ProgramDetails = ({ autoProgram }) => {
  const params = useParams();
  const id = autoProgram || params.id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [program, setProgram] = useState(null);
  const [otherPrograms, setOtherPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/programs/${id}`);
      if (data.success && data.data) {
        setProgram(data.data);
        fetchOtherPrograms(data.data._id);
      } else {
        setError('Program not found.');
      }
    } catch (err) {
      console.error('Error loading program:', err);
      setError(err.response?.data?.message || 'Unable to load program details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherPrograms = async (currentId) => {
    try {
      const { data } = await axios.get('/api/programs');
      if (data.success) {
        setOtherPrograms(data.data.filter(p => p._id !== currentId).slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching other programs:', err);
    }
  };

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setSelectedProgram(program);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/program/${program?._id || id}`;
    }
    return `https://ascension.ind.in/program/${program?._id || id}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = `✨ *${program.title}* - Ascension by Sonali Bhasin Kumar\n\n${program.description?.substring(0, 160)}...\n\n🔗 View full program details & enroll here:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center font-sans">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <div className="shimmer h-8 w-48 rounded-xl"></div>
          <div className="shimmer h-96 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="shimmer h-40 rounded-2xl md:col-span-2"></div>
            <div className="shimmer h-40 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-[70vh] py-20 px-4 flex flex-col items-center justify-center text-center font-sans">
        <div className="max-w-md w-full glass p-8 rounded-3xl border border-cream-dark/60 flex flex-col items-center gap-4">
          <span className="text-4xl">🕊️</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-dark">Program Not Found</h2>
          <p className="text-xs text-charcoal-light leading-relaxed">
            The program you are looking for may have been moved, updated, or does not exist.
          </p>
          <Link
            to="/programs"
            className="mt-2 bg-sage hover:bg-sage-dark text-white text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Programs</span>
          </Link>
        </div>
      </div>
    );
  }

  const isUserEnrolled = user && program.enrolledUsers && (
    program.enrolledUsers.includes(user._id) || 
    program.enrolledUsers.some(eu => eu === user._id || (eu && eu._id === user._id))
  );

  const isAncestral = program.title && program.title.toLowerCase().includes('ancestral');
  const isComingSoon = ['guided meditations', '21 days mirror work for self love program', '21 days release work program'].includes(program.title.toLowerCase().trim());
  const effectivePrice = program.sellingPrice !== undefined ? program.sellingPrice : program.pricing;
  const originalPrice = program.originalPrice !== undefined ? program.originalPrice : effectivePrice;
  const hasDiscount = originalPrice > effectivePrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : 0;
  const shareUrl = getShareUrl();

  return (
    <div className="min-h-screen py-8 sm:py-14 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">

        {/* Top Breadcrumb & Share Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cream-dark/60 pb-4">
          <div className="flex items-center gap-2 text-xs text-charcoal-light flex-wrap">
            <Link to="/" className="hover:text-gold transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-sage" />
            <Link to="/programs" className="hover:text-gold transition-colors font-medium">Programs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-sage" />
            <span className="text-charcoal-dark font-semibold truncate max-w-[200px] sm:max-w-xs">{program.title}</span>
          </div>

          {/* Quick Share Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs py-2 px-3.5 rounded-xl border border-[#25D366]/40 transition-all flex items-center gap-1.5 shadow-xs"
              title="Share via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/30" />
              <span>Share WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className={`font-medium text-xs py-2 px-3.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
                copiedLink 
                  ? 'bg-emerald-500 text-white border-emerald-600' 
                  : 'bg-white hover:bg-cream border-cream-dark/80 text-charcoal-dark'
              }`}
              title="Copy Direct Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-charcoal-light" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Hero Section: Media + Key Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media (Video or Image) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="glass rounded-3xl overflow-hidden shadow-md border border-cream-dark/60 bg-cream/30 aspect-video relative flex items-center justify-center">
              {program.youtubeUrl ? (
                <iframe
                  src={program.youtubeUrl}
                  title={program.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={program.images && program.images[0] ? getImageUrl(program.images[0]) : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"} 
                  alt={program.title} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>

            {/* Direct Shareable Link Box */}
            <div className="bg-white/90 border border-cream-dark/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-charcoal-light overflow-hidden max-w-full">
                <Share2 className="w-4 h-4 text-gold-dark shrink-0" />
                <span className="font-semibold text-charcoal-dark shrink-0">Direct Link:</span>
                <span className="font-mono text-[11px] text-sage-dark bg-cream/70 px-2 py-1 rounded-lg border border-cream-dark/50 truncate max-w-[220px] sm:max-w-xs select-all">
                  {shareUrl}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyLink}
                  className="bg-cream-dark/30 hover:bg-cream-dark/50 text-charcoal-dark text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Key Overview & Pricing Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Title & Badges */}
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-sage/15 text-sage-dark border border-sage/30 font-bold py-1 px-3 rounded-full text-[10px] uppercase tracking-wider">
                  {isAncestral ? '10 Sacred Sessions' : (program.duration || 'Transformative Program')}
                </span>
                {(program.startDate || isAncestral) && (
                  <span className="bg-gold/15 text-gold-dark font-bold py-1 px-3 rounded-full text-[10px] tracking-wider flex items-center gap-1 border border-gold/30">
                    <Calendar className="w-3 h-3 text-gold-dark" />
                    <span>Starts {program.startDate || '24 September'}</span>
                  </span>
                )}
                <span className="text-[10px] text-charcoal-light flex items-center gap-1 font-medium bg-cream/70 py-1 px-2.5 rounded-full border border-cream-dark/40">
                  <Users className="w-3 h-3 text-sage shrink-0" />
                  <span>
                    {program.enrolledCount !== undefined && program.enrolledCount > 0 
                      ? program.enrolledCount 
                      : (isAncestral ? 10 : (program.enrolledUsers?.length || 0))} / {program.enrollmentCapacity} Enrolled
                  </span>
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-dark leading-snug">
                {program.title}
              </h1>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-sage uppercase tracking-widest font-bold">About the Program</span>
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line font-sans">
                  {program.description}
                </p>
              </div>
            </div>

            {/* Pricing & CTA Card */}
            <div className="glass rounded-3xl p-5 sm:p-6 border border-gold/30 bg-white/95 shadow-sm flex flex-col gap-5 text-left">
              <div className="flex justify-between items-baseline border-b border-cream-dark/60 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-light font-bold block mb-1">
                    Total Energy Investment
                  </span>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-gold-dark">
                      ₹{new Intl.NumberFormat('en-IN').format(effectivePrice)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="relative inline-block font-serif font-bold text-base sm:text-lg text-rose-500 select-none">
                          ₹{new Intl.NumberFormat('en-IN').format(originalPrice)}
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-full h-[2px] bg-rose-500/90 transform -rotate-12 rounded-full"></span>
                          </span>
                        </span>
                        <span className="text-emerald-700 bg-emerald-100 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-lg uppercase tracking-wide">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-sage font-bold bg-sage/10 py-1 px-2.5 rounded-full border border-sage/20 block">
                    Verified Cohort
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {isUserEnrolled ? (
                  <button
                    onClick={() => navigate(`/programs/${program._id}/dashboard`)}
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark font-bold uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all duration-300 text-xs shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Go to Program Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : isComingSoon ? (
                  <button
                    disabled
                    className="w-full bg-charcoal-light/15 text-charcoal-light/50 border border-cream-dark/60 font-bold uppercase tracking-wider py-3.5 px-6 rounded-2xl text-xs cursor-not-allowed text-center"
                  >
                    Enrollment Opening Soon
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all duration-300 text-xs shadow-md flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Enroll in Program Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <div className="flex items-center justify-center gap-4 text-[11px] text-charcoal-light pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                    <span>Safe & Verified UPI</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Live Guidance</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Curriculum Breakdown (Sessions Schedule) */}
        {program.sessions && program.sessions.length > 0 && (
          <div className="flex flex-col gap-6 text-left mt-4">
            <div className="flex flex-col gap-1 border-b border-cream-dark/60 pb-3">
              <span className="text-[10px] sm:text-xs text-sage font-bold uppercase tracking-widest">Curriculum Roadmap</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark">
                Session-by-Session Breakdown
              </h2>
              <p className="text-xs text-charcoal-light">
                Complete progression flow and spiritual milestones covered throughout this journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {program.sessions.map((session, index) => (
                <div 
                  key={index}
                  className="glass rounded-2xl p-4 sm:p-5 border border-cream-dark/60 hover:border-gold/50 bg-white/80 transition-all shadow-xs flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span className="bg-sage/15 text-sage-dark font-bold text-[10px] uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                      Session {session.sessionNumber || index + 1}
                    </span>
                    {session.date && (
                      <span className="text-[11px] text-gold-dark font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal-dark">
                    {session.title}
                  </h3>

                  {session.description && (
                    <p className="text-xs text-charcoal-light leading-relaxed">
                      {session.description}
                    </p>
                  )}

                  {session.time && (
                    <div className="flex items-center gap-1 text-[11px] text-charcoal-light/80 font-mono mt-1 pt-2 border-t border-cream-dark/40">
                      <Clock className="w-3 h-3 text-sage" />
                      <span>{session.time}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why Ascension & Mentorship Banner */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-cream-dark/70 bg-[#FCFBF7] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-[10px] text-sage uppercase tracking-widest font-bold">Personalized Energetic Alignment</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-dark">
              Guided by Sonali Bhasin Kumar
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Ascension programs provide deep subconscious clearing, karmic integration, and live energy work. You will also receive guidance inside our private community cohort.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share with a Friend</span>
            </button>
            <Link
              to="/programs"
              className="bg-white hover:bg-cream border border-cream-dark/80 text-charcoal-dark font-medium py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <span>View Other Programs</span>
            </Link>
          </div>
        </div>

        {/* Other Transformative Programs */}
        {otherPrograms.length > 0 && (
          <div className="flex flex-col gap-6 text-left mt-6">
            <div className="flex justify-between items-baseline border-b border-cream-dark/60 pb-3">
              <div>
                <span className="text-[10px] text-sage font-bold uppercase tracking-widest">More Offerings</span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-dark">
                  Other Transformative Programs
                </h3>
              </div>
              <Link to="/programs" className="text-xs font-bold text-gold-dark hover:text-gold flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherPrograms.map((prog) => (
                <div
                  key={prog._id}
                  onClick={() => navigate(`/program/${prog._id}`)}
                  className="glass rounded-2xl overflow-hidden border border-cream-dark/60 hover:border-gold/60 hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  <div className="h-40 bg-cream relative overflow-hidden">
                    <img 
                      src={prog.images && prog.images[0] ? getImageUrl(prog.images[0]) : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"} 
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <span className="text-[10px] text-sage font-bold uppercase tracking-wider block mb-1">
                        {prog.duration || 'Structured Program'}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-charcoal-dark group-hover:text-gold transition-colors line-clamp-1">
                        {prog.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-light line-clamp-2 mt-1">
                        {prog.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-cream-dark/40 text-xs font-bold">
                      <span className="text-gold-dark">
                        ₹{new Intl.NumberFormat('en-IN').format(prog.sellingPrice || prog.pricing)}
                      </span>
                      <span className="text-sage flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Enrollment Bar on Mobile */}
      <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-dark/70 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-charcoal-light uppercase tracking-wider block">Investment</span>
          <span className="font-serif font-bold text-lg text-gold-dark leading-none">
            ₹{new Intl.NumberFormat('en-IN').format(effectivePrice)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl border border-cream-dark/80 bg-cream/50 text-charcoal-dark"
            title="Copy Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          {isUserEnrolled ? (
            <button
              onClick={() => navigate(`/programs/${program._id}/dashboard`)}
              className="bg-gold text-charcoal-dark font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs"
            >
              Dashboard
            </button>
          ) : isComingSoon ? (
            <button
              disabled
              className="bg-charcoal-light/20 text-charcoal-light/50 font-bold text-xs py-2.5 px-4 rounded-xl cursor-not-allowed"
            >
              Coming Soon
            </button>
          ) : (
            <button
              onClick={handleEnrollClick}
              className="bg-sage text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-1"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Enroll Program Modal */}
      {selectedProgram && (
        <EnrollProgramModal 
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default ProgramDetails;
