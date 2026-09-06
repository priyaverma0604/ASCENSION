import React, { useState, useContext } from 'react';
import { 
  X, CheckCircle, Compass, AlertTriangle, UploadCloud, CreditCard, MessageCircle, 
  Video, ExternalLink, Copy, Check, Calendar, Clock, Sparkles, User, CheckCircle2 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const RegisterWorkshopModal = ({ workshop, onClose }) => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Info form & details, 2: Payment page, 3: Success page
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Please fill out all fields');
      return;
    }
    
    // Check that phone number consists of exactly 10 digits
    const cleanedPhone = phone.trim().replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    setStep(2); // Go to Payment Page
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot || !transactionId) {
      alert('Please upload your payment screenshot and enter the transaction reference ID.');
      return;
    }

    const cleanedPhone = phone.trim().replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    // Validate that transactionId is exactly 12 digits
    const cleanedTxId = transactionId.trim();
    if (!/^\d{12}$/.test(cleanedTxId)) {
      alert('Please enter a valid 12-digit transaction ID.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', `${countryCode} ${phone.trim()}`);
      formData.append('transactionId', cleanedTxId);
      formData.append('paymentScreenshot', screenshot);
      if (user) {
        formData.append('userId', user._id);
      }

      const { data } = await axios.post(`/api/workshops/${workshop._id}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setStep(3); // Success Screen
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Workshop registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(workshop.date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isAncestral = (workshop.title && workshop.title.toLowerCase().includes('ancestral')) || (workshop.name && workshop.name.toLowerCase().includes('ancestral'));
  const whatsappLink = workshop.whatsappGroupLink || (isAncestral ? 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16' : '');
  const videoLink = isAncestral ? 'https://youtu.be/jIs3IH-brtg' : (workshop.introVideoUrl || workshop.videoUrl || '');
  const fullDescription = workshop.description || workshop.shortDescription || (isAncestral ? "Join Sonali Bhasin Kumar for a powerful live introductory Ancestral Healing Webinar. Discover the foundations of healing family karma, clearing intergenerational trauma, and receiving sacred ancestral blessings." : "");

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="glass max-w-lg sm:max-w-xl md:max-w-2xl w-full rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] flex flex-col border border-cream-dark/60 bg-white/95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-cream-dark/50 bg-[#FCFBF7] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold-dark" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal-dark uppercase tracking-wider">
                {step === 1 ? 'Workshop Details & Registration' : step === 2 ? 'Payment Verification' : 'Registration Confirmation'}
              </h3>
              <p className="text-[10px] sm:text-xs text-sage font-semibold tracking-wide truncate max-w-[220px] sm:max-w-md">
                {workshop.title}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-charcoal hover:text-gold hover:bg-cream/60 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 flex flex-col gap-5">
          
          {step === 1 && (
            /* Step 1: Full Workshop Details + User Info Form */
            <div className="flex flex-col gap-5 font-sans">
              
              {/* Optional Cover Banner */}
              {(workshop.coverImage || workshop.image) && (
                <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-sm border border-cream-dark/60 shrink-0 bg-cream">
                  <img
                    src={getImageUrl(workshop.coverImage || workshop.image)}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/90 via-charcoal-dark/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold-light bg-charcoal/70 backdrop-blur-md px-2.5 py-0.5 rounded-full w-fit mb-1.5 border border-white/10">
                      Live Workshop Gathering
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold leading-tight drop-shadow-xs">
                      {workshop.title}
                    </h4>
                  </div>
                </div>
              )}

              {/* Quick Info Grid Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-cream/50 border border-cream-dark/60 p-2.5 sm:p-3 rounded-xl flex flex-col text-left">
                  <span className="text-[9px] font-bold text-charcoal-light uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-gold-dark" />
                    <span>Instructor</span>
                  </span>
                  <span className="text-xs font-semibold text-charcoal-dark mt-0.5 truncate">
                    {workshop.instructor || workshop.speakerName || 'Sonali Bhasin Kumar'}
                  </span>
                </div>

                <div className="bg-cream/50 border border-cream-dark/60 p-2.5 sm:p-3 rounded-xl flex flex-col text-left">
                  <span className="text-[9px] font-bold text-charcoal-light uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-sage" />
                    <span>Date</span>
                  </span>
                  <span className="text-xs font-semibold text-charcoal-dark mt-0.5">
                    {formattedDate}
                  </span>
                </div>

                <div className="bg-cream/50 border border-cream-dark/60 p-2.5 sm:p-3 rounded-xl flex flex-col text-left">
                  <span className="text-[9px] font-bold text-charcoal-light uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-dark" />
                    <span>Timing</span>
                  </span>
                  <span className="text-xs font-semibold text-charcoal-dark mt-0.5 truncate">
                    {workshop.time || 'Live Session'}
                  </span>
                </div>

                <div className="bg-cream/50 border border-cream-dark/60 p-2.5 sm:p-3 rounded-xl flex flex-col text-left">
                  <span className="text-[9px] font-bold text-charcoal-light uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>Investment</span>
                  </span>
                  <span className="text-xs font-serif font-bold text-gold-dark mt-0.5">
                    ₹{workshop.pricing || workshop.price}
                  </span>
                </div>
              </div>

              {/* Complete Full Description Section */}
              <div className="bg-[#FFFDF7] border border-cream-dark/70 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 text-left shadow-xs">
                <div className="flex items-center gap-2 border-b border-cream-dark/50 pb-2">
                  <Sparkles className="w-4 h-4 text-gold-dark shrink-0" />
                  <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal-dark">
                    About This Workshop
                  </h4>
                </div>

                {/* Full Description Text */}
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans font-normal">
                  {fullDescription}
                </p>
              </div>

              {/* User Info Form */}
              <form onSubmit={handleInfoSubmit} className="flex flex-col gap-4 font-sans text-xs pt-2">
                <div className="flex items-center justify-between border-b border-cream-dark/60 pb-2">
                  <div className="flex flex-col text-left">
                    <span className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider">
                      Reserve Your Spot
                    </span>
                    <span className="text-[10px] text-charcoal-light">
                      Fill out your details to proceed to secure manual UPI payment.
                    </span>
                  </div>
                  <span className="font-serif font-bold text-gold-dark text-sm bg-gold/10 px-3 py-1 rounded-full border border-gold/25 shrink-0">
                    ₹{workshop.pricing || workshop.price}
                  </span>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all text-xs"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all text-xs"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-2 text-charcoal focus:outline-none focus:border-sage transition-all w-24 shrink-0 text-xs"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+971">+971 (AE)</option>
                      <option value="+65">+65 (SG)</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="10-digit mobile number"
                      className="flex-1 bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-3 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-3 rounded-xl transition-all text-center uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center uppercase tracking-wider text-[10px] gap-1.5"
                  >
                    <span>Proceed to Payment (₹{workshop.pricing || workshop.price})</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            /* Step 2: Payment Page */
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 font-sans text-xs">
              
              {/* Fee summary */}
              <div className="bg-cream p-3 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
                <span className="text-charcoal-light font-medium">Payable Amount</span>
                <span className="font-serif font-bold text-base text-gold-dark">₹{workshop.pricing}</span>
              </div>

              {/* QR and Instruction */}
              <div className="bg-white/60 p-4 rounded-2xl border border-cream-dark flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider">Scan & Pay via UPI</span>
                <div className="w-44 h-44 bg-cream rounded-xl border border-cream-dark/80 p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageUrl('/uploads/default_upi_qr.jpg')}
                    alt="Workshop Payment QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex justify-between items-center bg-cream/70 p-2.5 px-3.5 rounded-xl border border-cream-dark/60 w-full text-xs">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-charcoal-light font-bold uppercase tracking-wider">Payee UPI ID</span>
                    <strong className="select-all text-gold-dark font-mono text-xs mt-0.5">sonalibhasinkumar@ptaxis</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('sonalibhasinkumar@ptaxis');
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="bg-white hover:bg-cream border border-cream-dark text-charcoal-dark font-medium py-1.5 px-2.5 rounded-lg text-[10px] flex items-center gap-1 transition-all shadow-xs"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-sage" /> : <Copy className="w-3 h-3 text-charcoal-light" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                  </button>
                </div>
                <div className="bg-lavender-light/40 border border-lavender p-3 rounded-xl flex gap-2 text-left text-[10px]">
                  <AlertTriangle className="w-4.5 h-4.5 text-lavender-dark shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-charcoal-light">
                    Scan the QR code above. Enter the 12-digit transaction ID and upload the receipt screenshot below.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">UPI Transaction ID</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit UPI reference number"
                  className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-colors text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Upload Receipt Screenshot</label>
                <div className="border border-dashed border-cream-dark/80 rounded-xl p-3 bg-cream-light/30 flex flex-col items-center gap-1 text-center cursor-pointer hover:bg-cream-light/60 transition-colors relative">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-5 h-5 text-gold-dark" />
                  <span className="text-[10px] text-charcoal-light font-medium">
                    {screenshot ? `Selected: ${screenshot.name}` : "Choose receipt screenshot"}
                  </span>
                </div>
                {screenshotPreview && (
                  <div className="mt-2 border rounded-xl overflow-hidden h-28 bg-white flex items-center justify-center p-1">
                    <img src={screenshotPreview} alt="Receipt preview" className="h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all uppercase tracking-wider text-[9px] text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center uppercase tracking-wider text-[9px]"
                >
                  {loading ? 'Submitting...' : 'Submit Payment Details'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            /* Step 3: Success Screen */
            <div className="p-6 flex flex-col items-center justify-center text-center gap-3.5">
              <CheckCircle className="w-11 h-11 text-sage animate-pulse-subtle" />
              <h4 className="font-serif text-lg font-bold text-charcoal-dark">
                Registration Submitted!
              </h4>
              <p className="text-xs text-charcoal-light leading-relaxed px-2 border-b border-cream-dark/50 pb-2.5">
                Blessings! Your registration request for <strong>{workshop.title}</strong> has been submitted. Our team will verify your transaction ID shortly and confirm your seat via email!
              </p>

              {/* WhatsApp Community Group Banner */}
              {whatsappLink && (
                <div className="w-full bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 my-1">
                  <div className="flex items-center gap-1.5 text-[#128C7E] font-bold text-xs">
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                    <span>Join Workshop WhatsApp Group</span>
                  </div>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">
                    Please join our official WhatsApp group for live meeting links, session preparation updates, and announcements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-1">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Join WhatsApp Group</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(whatsappLink);
                        setCopiedWhatsapp(true);
                        setTimeout(() => setCopiedWhatsapp(false), 2500);
                      }}
                      className="bg-white hover:bg-cream border border-cream-dark/80 text-charcoal-dark font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedWhatsapp ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5 text-charcoal-light" />}
                      <span>{copiedWhatsapp ? 'Copied Link' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Introduction to Ancestral Healing Video Banner */}
              {videoLink && (
                <div className="w-full bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 my-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>Introduction to Ancestral Healing</span>
                  </div>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">
                    Please watch this video before the webinar.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-1">
                    <a
                      href={videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Watch Introduction Video</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(videoLink);
                        setCopiedVideo(true);
                        setTimeout(() => setCopiedVideo(false), 2500);
                      }}
                      className="bg-white hover:bg-cream border border-cream-dark/80 text-charcoal-dark font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedVideo ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5 text-charcoal-light" />}
                      <span>{copiedVideo ? 'Copied Video' : 'Copy Video Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-3"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWorkshopModal;
