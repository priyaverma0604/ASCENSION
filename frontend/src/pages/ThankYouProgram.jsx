import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, MessageCircle, Copy, Check, ExternalLink, 
  Sparkles, ArrowRight, ShieldCheck, Heart, Headphones, 
  Calendar, Flame, BookOpen, Clock, HelpCircle, PhoneCall
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import navratriBanner from '../assets/navratri_9_days_banner.jpg';

const ThankYouProgram = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeProgramId } = useParams();
  const { user } = useContext(AuthContext);

  const searchParams = new URLSearchParams(location.search);
  const paymentRef = searchParams.get('ref') || searchParams.get('paymentId') || searchParams.get('orderId') || '';
  const customerName = searchParams.get('name') || user?.name || 'Devotee';
  const queryProgramId = searchParams.get('programId') || routeProgramId || '';

  const isNavratriRoute = location.pathname.includes('navratri') || queryProgramId === '6a4963f49e941f93f91f5ac5';
  
  const [program, setProgram] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const navratriProgramId = '6a4963f49e941f93f91f5ac5';
  const activeProgramId = queryProgramId || (isNavratriRoute ? navratriProgramId : '');

  const whatsappLink = isNavratriRoute || !program?.whatsappGroupLink
    ? 'https://chat.whatsapp.com/DT05P5k7uviAV0Yuw1ySb7'
    : (program.whatsappGroupLink || 'https://chat.whatsapp.com/DT05P5k7uviAV0Yuw1ySb7');

  const dashboardUrl = activeProgramId
    ? `/programs/${activeProgramId}/dashboard`
    : `/programs/${navratriProgramId}/dashboard`;

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        if (activeProgramId) {
          const { data } = await axios.get(`/api/programs/${activeProgramId}`);
          if (data.success) {
            setProgram(data.data);
          }
        }
      } catch (e) {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [activeProgramId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-10 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Spiritual Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-gold/15 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8 relative z-10">
        
        {/* Divine Celebration Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 text-gold-dark px-4 py-1.5 rounded-full border border-gold/40 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-gold-dark animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {isNavratriRoute ? 'Jai Mata Di • Sacred Enrollment Confirmed' : 'Payment Successful • Enrollment Confirmed'}
          </span>
        </div>

        {/* Main Hero Card */}
        <div className="w-full glass rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-xl flex flex-col items-center text-center gap-6 bg-white/80 backdrop-blur-md">
          
          {/* Animated Success Icon with Aura */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg relative border-4 border-white">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-dark leading-tight">
              {isNavratriRoute ? (
                <>
                  Jai Mata Di, <span className="text-gold-dark">{customerName}</span>!
                  <br />
                  <span className="text-xl sm:text-2xl font-normal text-charcoal">
                    Your 9-Day Navratri Sadhana is Unlocked
                  </span>
                </>
              ) : (
                <>
                  Thank You, <span className="text-gold-dark">{customerName}</span>!
                  <br />
                  <span className="text-xl sm:text-2xl font-normal text-charcoal">
                    {program?.title || 'Your Sacred Journey Has Begun'}
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-light max-w-xl mx-auto leading-relaxed">
              {isNavratriRoute ? (
                'We have confirmed your enrollment for the 9-Day Sacred Navratri Program with Sonali Bhasin Kumar. Please join the official WhatsApp group below to receive daily sadhana alerts, audiobooks, and live links.'
              ) : (
                `Your registration for ${program?.title || 'the program'} is successfully confirmed. Get ready to embark on a powerful transformational experience.`
              )}
            </p>
          </div>

          {/* Navratri Special Banner if applicable */}
          {isNavratriRoute && (
            <div className="w-full rounded-2xl overflow-hidden border border-gold/30 shadow-md relative group">
              <img 
                src={navratriBanner} 
                alt="9 Days Navratri Transformation" 
                className="w-full h-44 sm:h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-left text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-gold" /> 9 Sacred Manifestation Days
                </span>
                <p className="text-sm sm:text-base font-bold font-serif">
                  Navratri Sadhana & Maa Durga 9 Swaroop Audiobooks
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PRIMARY ACTION: JOIN OFFICIAL WHATSAPP GROUP */}
          {/* ========================================================================= */}
          <div className="w-full bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-7 flex flex-col items-center text-center gap-4 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-300/30 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base uppercase tracking-wider">
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
              <span>Step 1: Join Official WhatsApp Community</span>
            </div>

            <p className="text-xs sm:text-sm text-charcoal leading-relaxed max-w-lg">
              {isNavratriRoute ? (
                <span>
                  Connect directly with <strong>Sonali Bhasin Kumar</strong> & fellow devotees. Get <strong>daily Maa Durga audiobook notifications</strong>, morning sadhana prompts, sacred mantras, and live Zoom links.
                </span>
              ) : (
                <span>
                  Join our official WhatsApp group for live session links, cohort announcements, and direct guidance from Sonali Ma'am.
                </span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-1">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="tracking-wide uppercase text-xs">Join WhatsApp Group Now</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-white hover:bg-cream border border-emerald-300 text-charcoal-dark font-semibold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-charcoal-light" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECONDARY ACTION: DIRECT ACCESS TO PROGRAM DASHBOARD */}
          {/* ========================================================================= */}
          <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
            <Link
              to={dashboardUrl}
              className="w-full sm:w-auto flex-1 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5"
            >
              <Headphones className="w-4 h-4" />
              <span>Enter 9-Day Program Dashboard ↗</span>
            </Link>

            <Link
              to="/profile"
              className="w-full sm:w-auto bg-cream hover:bg-cream-dark border border-cream-dark text-charcoal font-bold py-3 px-5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View In My Profile</span>
            </Link>
          </div>

          {/* Reference / Transaction Info */}
          {paymentRef && (
            <div className="w-full bg-cream/40 rounded-2xl p-3 sm:p-4 border border-cream-dark/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-light text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Reference / Transaction ID:</span>
              </div>
              <span className="font-mono font-bold text-charcoal-dark bg-white px-2.5 py-1 rounded-lg border border-cream-dark text-[11px] select-all">
                {paymentRef}
              </span>
            </div>
          )}

        </div>

        {/* 3-Step Journey Roadmap Card */}
        <div className="w-full glass rounded-3xl p-6 sm:p-8 border border-cream-dark/60 shadow-sm flex flex-col gap-5 text-left bg-white/60">
          <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-dark flex items-center gap-2 border-b border-cream-dark/50 pb-3">
            <BookOpen className="w-4 h-4 text-sage" /> Next Steps for Your Sadhana
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-cream/40 p-4 rounded-2xl border border-cream-dark/50 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center text-[11px]">
                1
              </span>
              <h4 className="font-bold text-charcoal-dark text-sm">Join WhatsApp Group</h4>
              <p className="text-charcoal-light text-[11px] leading-relaxed">
                Click the green button above to join immediately so you never miss daily morning audio drops and session announcements.
              </p>
            </div>

            <div className="bg-cream/40 p-4 rounded-2xl border border-cream-dark/50 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-sage/20 text-sage-dark font-bold flex items-center justify-center text-[11px]">
                2
              </span>
              <h4 className="font-bold text-charcoal-dark text-sm">Listen to Day 1 Audio</h4>
              <p className="text-charcoal-light text-[11px] leading-relaxed">
                Head into your <strong>Program Dashboard</strong> to stream the high-fidelity Maa Shailputri audiobook, mantras & reflections.
              </p>
            </div>

            <div className="bg-cream/40 p-4 rounded-2xl border border-cream-dark/50 flex flex-col gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[11px]">
                3
              </span>
              <h4 className="font-bold text-charcoal-dark text-sm">Daily Daily Sadhana</h4>
              <p className="text-charcoal-light text-[11px] leading-relaxed">
                Follow the 9 divine days step-by-step. Submit reflections and journal prompts directly on your student dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Assistance / Contact Helpline */}
        <div className="w-full bg-cream/40 rounded-2xl p-4 sm:p-5 border border-cream-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-charcoal-dark">Need assistance with your enrollment?</p>
              <p className="text-charcoal-light text-[11px]">Our team is here to support your spiritual journey.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hello%20Sonali%20Ma'am,%20I%20have%20enrolled%20in%20the%20Navratri%20Program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage font-bold hover:underline flex items-center gap-1 text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat with Support</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default ThankYouProgram;
