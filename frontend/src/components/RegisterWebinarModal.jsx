import React, { useState, useContext } from 'react';
import { X, CheckCircle, Compass, AlertTriangle, Upload, CreditCard, MessageCircle, Copy, Check, Video, ExternalLink } from 'lucide-react';
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

const RegisterWebinarModal = ({ webinar, onClose }) => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Info form, 2: Payment page, 3: Success page
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);

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

      const { data } = await axios.post(`/api/webinars/${webinar._id}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setStep(3); // Success Screen
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Webinar registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(webinar.date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Webinar Registration
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5 max-w-[280px] truncate">
              {webinar.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {step === 1 && (
            /* Step 1: User Info Form */
            <form onSubmit={handleInfoSubmit} className="flex flex-col gap-4 font-sans text-xs">
              <div className="bg-cream p-3.5 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
                <span className="text-charcoal-light">Investment Fees</span>
                <span className="font-serif font-bold text-sm text-gold-dark">
                  ₹{webinar.price}
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
                  placeholder="Enter full name"
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
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
                  placeholder="Enter email address"
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-2 text-charcoal focus:outline-none focus:border-sage transition-all w-20 shrink-0"
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
                    placeholder="10-digit mobile"
                    className="flex-1 bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            /* Step 2: UPI Manual Payment Form */
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 font-sans text-xs text-left">
              
              {/* Webinar info details summary */}
              <div className="bg-cream/50 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-charcoal border-b border-cream-dark/50 pb-2">
                  <span className="font-bold font-serif text-[13px]">{webinar.title}</span>
                  <span className="font-serif font-bold text-gold-dark text-[13px]">₹{webinar.price}</span>
                </div>
                <div className="text-[10px] text-charcoal-light flex flex-col gap-0.5">
                  <p><strong>Speaker:</strong> {webinar.speakerName}</p>
                  <p><strong>Date & Time:</strong> {formattedDate} at {webinar.time}</p>
                </div>
              </div>

              {/* UPI Details Display */}
              <div className="flex flex-col items-center text-center gap-3">
                <h4 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider flex items-center gap-1.5 justify-center">
                  <CreditCard className="w-4 h-4 text-gold-dark" />
                  <span>Manual UPI Payment</span>
                </h4>
                
                {webinar.upiQrCodeImage ? (
                  <div className="w-56 h-56 bg-white border border-cream-dark/80 p-3 rounded-xl overflow-hidden shadow-xs">
                    <img 
                      src={getImageUrl(webinar.upiQrCodeImage)} 
                      alt="UPI QR Code Scan" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 bg-cream border border-dashed border-cream-dark flex flex-col items-center justify-center text-[10px] text-charcoal-light p-4 rounded-xl">
                    <span>QR Code scanner fallback</span>
                  </div>
                )}
                
                <div className="flex flex-col gap-1 text-[11px] text-charcoal-dark font-sans leading-relaxed border-t border-cream-dark/45 pt-3 w-full">
                  <p className="flex justify-between border-b border-cream-dark/30 pb-1.5">
                    <span className="text-charcoal-light font-medium">Payee UPI ID:</span>
                    <strong className="select-all text-gold-dark">{webinar.upiId}</strong>
                  </p>
                </div>

                <div className="bg-lavender-light/40 border border-lavender p-3 rounded-xl flex gap-2 text-left mt-1 text-[10px]">
                  <AlertTriangle className="w-4.5 h-4.5 text-lavender-dark shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-charcoal-light">
                    Scan the QR code above or pay using the UPI ID. Once paid, please upload the receipt screenshot and enter the reference transaction ID below to verify your seat.
                  </span>
                </div>
              </div>

              {/* UPI Transaction ID input */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">UPI Transaction Reference ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="Enter 12-digit transaction ID"
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all font-mono"
                />
              </div>

              {/* Screenshot Upload Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Upload Payment Screenshot</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-cream-dark/80 hover:border-sage rounded-xl py-4 bg-cream-light cursor-pointer transition-colors text-charcoal/50 select-none">
                    <Upload className="w-5 h-5 mb-1 text-charcoal/60 animate-bounce-subtle" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Select file</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      required
                      className="hidden" 
                    />
                  </label>
                  {screenshotPreview && (
                    <div className="w-16 h-16 rounded-xl border border-cream-dark overflow-hidden shrink-0">
                      <img src={screenshotPreview} alt="Screenshot Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {loading && <Compass className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Submitting...' : 'Submit Verification'}</span>
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
                Thank you, <strong>{name}</strong>! Your manual payment proof has been successfully submitted and is pending admin validation.
              </p>

              {/* WhatsApp Community Group Banner */}
              {(() => {
                const isAncestral = (webinar.title && webinar.title.toLowerCase().includes('ancestral')) || (webinar.name && webinar.name.toLowerCase().includes('ancestral'));
                const whatsappLink = webinar.whatsappGroupLink || (isAncestral ? 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16' : '');

                if (!whatsappLink) return null;

                return (
                  <div className="w-full bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 my-1">
                    <div className="flex items-center gap-1.5 text-[#128C7E] font-bold text-xs">
                      <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                      <span>Join Webinar WhatsApp Group</span>
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
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2500);
                        }}
                        className="bg-white hover:bg-cream border border-cream-dark/80 text-charcoal-dark font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5 text-charcoal-light" />}
                        <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Introduction to Ancestral Healing Video Banner */}
              {(() => {
                const isAncestral = (webinar.title && webinar.title.toLowerCase().includes('ancestral')) || (webinar.name && webinar.name.toLowerCase().includes('ancestral'));
                const videoLink = isAncestral ? 'https://youtu.be/jIs3IH-brtg' : (webinar.introVideoUrl || webinar.videoUrl || '');

                if (!videoLink) return null;

                return (
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
                );
              })()}

              <div className="text-[11px] text-charcoal-light leading-relaxed px-2 flex flex-col gap-1 mt-1">
                <p>Once approved, a confirmation email will also be sent to your email.</p>
                <p className="font-semibold text-gold-dark">Your Zoom Link will be emailed exactly 1 hour before the webinar starts.</p>
              </div>

              <p className="text-[10px] text-sage font-semibold uppercase tracking-wide bg-sage/10 px-3 py-1 rounded-full border border-sage/20 mt-1">
                Status: Pending Approval
              </p>
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

export default RegisterWebinarModal;
