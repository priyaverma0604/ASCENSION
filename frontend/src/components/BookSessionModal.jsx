import React, { useState, useEffect, useContext } from 'react';
import { X, CheckCircle, Calendar, MessageSquare, Phone, AlertTriangle, UploadCloud, CreditCard, Compass, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const ORACLE_DECK_TIERS = [
  { decks: 3, label: '3 Decks', price: 999, desc: 'Introductory Clarity & Quick Focus' },
  { decks: 6, label: '6 Decks', price: 1599, desc: 'Dual-Dimension Insights (Love & Career)' },
  { decks: 9, label: '9 Decks', price: 1899, desc: 'Deeper Energy Alignment & Path Finding' },
  { decks: 12, label: '12 Decks', price: 2199, desc: 'Comprehensive Multi-Aspect Soul Reading' },
  { decks: 15, label: '15 Decks', price: 2499, desc: 'Advanced Karmic & Chakra Resonance' },
  { decks: 18, label: '18 Decks', price: 2799, desc: 'Profound Life Transformation & Destiny Map' },
  { decks: 21, label: '21 Decks', price: 2999, desc: 'Master Oracle Odyssey (Ultimate Clarity & Insights)', featured: true }
];

const TIME_SLOTS = [
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM'
];

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 28; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const day = d.getDay(); // 2: Tuesday, 3: Wednesday, 5: Friday
    if (day === 2 || day === 3 || day === 5) {
      const dayName = day === 2 ? 'Tuesday' : day === 3 ? 'Wednesday' : 'Friday';
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      dates.push(`${dayName}, ${formatted}`);
    }
  }
  return dates;
};

const BookSessionModal = ({ service, onClose }) => {
  const { user } = useContext(AuthContext);
  const isOracle = service.title?.toLowerCase().includes('oracle') || service.title?.toLowerCase().includes('card');
  const availableDates = getAvailableDates();
  const [step, setStep] = useState(1); // 1: Info form, 2: Payment page, 3: Success page
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'upi_qr'
  const [selectedDeckTier, setSelectedDeckTier] = useState(ORACLE_DECK_TIERS[0]);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedDate, setSelectedDate] = useState(availableDates[0] || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const effectivePrice = isOracle ? selectedDeckTier.price : (service.pricing || 0);
  const bookingServiceTitle = isOracle 
    ? `${service.title} (${selectedDeckTier.label})` 
    : service.title;

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const { data } = await axios.get('/api/contacts/booked-slots');
        if (data.success) {
          setBookedSlots(data.data);
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    };
    fetchBookedSlots();
  }, []);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedSlot) {
      alert('Please fill out all required fields and select an available slot.');
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

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay payment gateway failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const fullPhone = `${countryCode} ${phone.trim()}`;
      const { data } = await axios.post('/api/contacts/razorpay-order', {
        amount: effectivePrice,
        serviceTitle: bookingServiceTitle,
        name,
        email,
        phone: fullPhone,
        slot: selectedSlot
      });

      if (!data.success) {
        alert('Could not initiate payment order');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TZqxQy6crShQ65',
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Ascension by Sonali Bhasin Kumar',
        description: `Booking: ${bookingServiceTitle}`,
        image: '/logo.png',
        order_id: data.data.orderId,
        prefill: {
          name,
          email,
          contact: fullPhone
        },
        theme: {
          color: '#8A9A86'
        },
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await axios.post('/api/contacts/verify-booking', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                name,
                email,
                phone: fullPhone,
                serviceTitle: bookingServiceTitle,
                slot: selectedSlot,
                message,
                amount: effectivePrice
              }
            });

            if (verifyRes.data.success) {
              setConfirmedPaymentId(response.razorpay_payment_id);
              setStep(3); // Go to success confirmation
            }
          } catch (err) {
            alert(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
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
      
      const formattedMessage = `[SERVICE BOOKING REQUEST: ${bookingServiceTitle}]\nPreferred Date: ${selectedSlot}\nExchange: ₹${effectivePrice}\nMessage: ${message}`;
      formData.append('message', formattedMessage);

      const { data } = await axios.post('/api/contacts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setConfirmedPaymentId(cleanedTxId);
        setStep(3); // Success Screen
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Book Session
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5 max-w-[280px] truncate">
              {service.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {step === 1 && (
            /* Step 1: Info Form */
            <form onSubmit={handleInfoSubmit} className="flex flex-col gap-4 font-sans text-xs">
              
              {/* Oracle Special Hero Banner & Deck Selector */}
              {isOracle ? (
                <div className="flex flex-col gap-3">
                  {/* Spiritual Inspiration Tagline */}
                  <div className="bg-gradient-to-r from-cream via-cream-light to-cream p-3.5 rounded-2xl border border-gold/40 text-center shadow-xs flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
                    <span className="font-serif italic text-xs sm:text-sm text-charcoal-dark font-bold">
                      "Not a COINCIDENCE... Your Soul Brought You Here"
                    </span>
                    <span className="text-[10px] text-sage font-bold tracking-wider uppercase">
                      Unlock Messages Meant Only For You ✨
                    </span>
                    <p className="text-[9px] text-charcoal-light leading-snug mt-0.5">
                      1:1 Private Reading • Using 21+ Powerful Sacred Decks • Love, Career & Spiritual Clarity
                    </p>
                  </div>

                  {/* Choose Decks Section */}
                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-charcoal-dark uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Choose Decks & Energy Depth</span>
                      </label>
                      <span className="text-[9px] text-gold-dark font-bold bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30">
                        {selectedDeckTier.decks} Decks (₹{selectedDeckTier.price})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {ORACLE_DECK_TIERS.map((tier) => {
                        const isSelected = selectedDeckTier.decks === tier.decks;
                        return (
                          <button
                            key={tier.decks}
                            type="button"
                            onClick={() => setSelectedDeckTier(tier)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1 relative focus:outline-none cursor-pointer ${
                              isSelected
                                ? 'bg-white border-gold shadow-md ring-2 ring-gold/40 scale-[1.02]'
                                : 'bg-cream-light/60 border-cream-dark/60 hover:border-gold/50 hover:bg-cream-light'
                            }`}
                          >
                            {tier.featured && (
                              <span className="absolute -top-2 right-1.5 bg-gold-dark text-white text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow-2xs">
                                Master Tier
                              </span>
                            )}
                            <div className="flex justify-between items-center w-full">
                              <span className="font-serif font-bold text-xs text-charcoal-dark">
                                {tier.label}
                              </span>
                              {isSelected ? (
                                <span className="w-3.5 h-3.5 rounded-full bg-gold text-charcoal-dark flex items-center justify-center text-[9px] font-bold">
                                  ✓
                                </span>
                              ) : null}
                            </div>
                            <span className="font-serif font-bold text-sm text-gold-dark">
                              ₹{tier.price}
                            </span>
                            <span className="text-[8px] text-charcoal-light leading-tight line-clamp-2">
                              {tier.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Investment Banner */}
                  <div className="bg-sage/10 p-3 rounded-xl border border-sage/30 flex justify-between items-center text-charcoal">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-wider text-sage font-bold">Selected Reading Tier</span>
                      <span className="font-sans font-semibold text-xs text-charcoal-dark">
                        {selectedDeckTier.label} — {selectedDeckTier.desc}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-sm text-gold-dark whitespace-nowrap">
                      ₹{effectivePrice} <span className="text-[9px] font-sans font-normal text-charcoal-light">/ 30 mins</span>
                    </span>
                  </div>
                </div>
              ) : (
                /* Standard Price Banner */
                <div className="bg-cream p-3.5 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
                  <span className="text-charcoal-light font-medium">Session Investment</span>
                  <span className="font-serif font-bold text-sm text-gold-dark">
                    ₹{service.pricing} <span className="text-[10px] font-sans font-normal text-charcoal-light">/ {service.duration} mins</span>
                  </span>
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1.5 text-left">
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
              <div className="flex flex-col gap-1.5 text-left">
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
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
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
                    placeholder="10-digit number"
                    className="flex-1 bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
                  />
                </div>
              </div>

              {/* Available Slots Section */}
              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sage" />
                    <span>Select Day & Date (Tue, Wed, Fri only)</span>
                  </label>
                  <span className="text-[9px] text-sage font-semibold bg-sage/10 px-2 py-0.5 rounded-full border border-sage/20">
                    30 Mins / Session
                  </span>
                </div>

                {/* Date Dropdown */}
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (selectedTime) {
                      setSelectedSlot(`${e.target.value} (${selectedTime})`);
                    }
                  }}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal font-medium text-xs focus:outline-none focus:border-sage transition-all"
                >
                  {availableDates.map((dateStr) => (
                    <option key={dateStr} value={dateStr}>
                      {dateStr}
                    </option>
                  ))}
                </select>

                {/* 30-Min Time Slots (12:00 PM - 4:00 PM) */}
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[9px] font-bold text-charcoal-light uppercase tracking-wider">
                    Available Timings (12:00 PM - 4:00 PM)
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1.5 border border-cream-dark/60 rounded-xl bg-cream-light/40">
                    {TIME_SLOTS.map((time) => {
                      const slotValue = `${selectedDate} (${time})`;
                      const isSelected = selectedSlot === slotValue;
                      const isBooked = bookedSlots.some(
                        (b) => b.serviceTitle.toLowerCase() === service.title.toLowerCase() && b.slot === slotValue
                      );
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            setSelectedTime(time);
                            setSelectedSlot(slotValue);
                          }}
                          className={`py-2 px-2.5 rounded-lg border text-left transition-all duration-200 flex items-center justify-between gap-1 focus:outline-none ${
                            isBooked
                              ? 'bg-cream-dark/10 border-cream-dark/25 text-charcoal-light/40 cursor-not-allowed relative'
                              : isSelected
                                ? 'bg-sage border-sage text-white shadow-sm font-semibold scale-[1.01] cursor-pointer'
                                : 'bg-cream-light border-cream-dark/45 text-charcoal hover:bg-cream-dark/25 hover:border-sage/40 cursor-pointer'
                          }`}
                        >
                          <span className="text-[10px] font-sans">
                            {time}
                          </span>
                          {isBooked ? (
                            <span className="text-[8px] bg-cream-dark/40 text-charcoal-light/95 font-semibold px-1 rounded-sm uppercase scale-90">
                              Booked
                            </span>
                          ) : isSelected && (
                            <span className="text-[10px] text-white font-bold">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedSlot && (
                  <div className="bg-sage/10 border border-sage/30 p-2 rounded-xl text-[10px] text-sage font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Selected: <strong>{selectedSlot}</strong> (30 Mins)</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-sage" />
                  Special intentions / healing requests
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  placeholder="Let Sonali know if you have specific blockages, life questions, or areas of concern..."
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all text-center uppercase tracking-wider text-[9px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center uppercase tracking-wider text-[9px]"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            /* Step 2: Payment Options Form */
            <div className="flex flex-col gap-4 font-sans text-xs text-left">
              
              {/* Service details summary */}
              <div className="bg-cream/50 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-charcoal border-b border-cream-dark/50 pb-2">
                  <span className="font-bold font-serif text-[13px]">{bookingServiceTitle}</span>
                  <span className="font-serif font-bold text-gold-dark text-[13px]">₹{effectivePrice}</span>
                </div>
                <div className="text-[10px] text-charcoal-light flex flex-col gap-0.5 font-sans">
                  {isOracle && <p><strong>Deck Tier:</strong> {selectedDeckTier.label} ({selectedDeckTier.desc})</p>}
                  <p><strong>Duration:</strong> {service.duration || 30} mins</p>
                  <p><strong>Selected Slot:</strong> {selectedSlot}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="flex rounded-xl p-1 bg-cream border border-cream-dark/60 gap-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'razorpay'
                      ? 'bg-sage text-white shadow-xs'
                      : 'text-charcoal hover:bg-cream-light'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant Razorpay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'upi_qr'
                      ? 'bg-sage text-white shadow-xs'
                      : 'text-charcoal hover:bg-cream-light'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Manual UPI QR</span>
                </button>
              </div>

              {paymentMethod === 'razorpay' ? (
                /* Online Razorpay Option */
                <div className="flex flex-col gap-4">
                  <div className="bg-cream-light/60 border border-cream-dark/60 p-4 rounded-xl flex flex-col gap-2.5 text-charcoal">
                    <div className="flex items-center gap-2 text-sage font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-sage" />
                      <span>Razorpay Secure Online Checkout</span>
                    </div>
                    <p className="text-[11px] text-charcoal-light leading-relaxed">
                      Pay instantly via UPI (GPay, PhonePe, Paytm), Credit/Debit Card, Netbanking, or Wallets. Your session slot will be confirmed immediately.
                    </p>
                    <div className="flex justify-between items-center border-t border-cream-dark/40 pt-2 text-xs font-semibold">
                      <span>Payable Total:</span>
                      <span className="font-serif font-bold text-gold-dark text-sm">₹{effectivePrice}</span>
                    </div>
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
                      type="button"
                      disabled={loading}
                      onClick={handleRazorpayPayment}
                      className="w-2/3 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-[9px] border border-gold-dark/20"
                    >
                      {loading ? <Compass className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                      <span>{loading ? 'Opening Razorpay...' : `Pay ₹${effectivePrice} Online`}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* UPI Manual Payment Form */
                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-56 h-56 bg-white border border-cream-dark/80 p-3 rounded-xl overflow-hidden shadow-xs flex items-center justify-center">
                      <img 
                        src={getImageUrl('/uploads/default_upi_qr.jpg')} 
                        alt="UPI QR Code Scan" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 text-[11px] text-charcoal-dark font-sans leading-relaxed border-t border-cream-dark/45 pt-3 w-full">
                      <p className="flex justify-between border-b border-cream-dark/30 pb-1.5">
                        <span className="text-charcoal-light font-medium">Payee UPI ID:</span>
                        <strong className="select-all text-gold-dark">sonalibhasinkumar@ptaxis</strong>
                      </p>
                      <p className="flex justify-between pt-0.5">
                        <span className="text-charcoal-light font-medium">Amount to Pay:</span>
                        <strong className="text-charcoal-dark font-serif text-xs">₹{effectivePrice}</strong>
                      </p>
                    </div>

                    <div className="bg-lavender-light/40 border border-lavender p-3 rounded-xl flex gap-2 text-left text-[10px]">
                      <AlertTriangle className="w-4.5 h-4.5 text-lavender-dark shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-charcoal-light font-sans">
                        Scan the QR code above using any UPI app. After transferring ₹{effectivePrice}, enter the 12-digit transaction ID and upload the receipt screenshot below.
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
            </div>
          )}

          {step === 3 && (
            /* Step 3: Success Screen */
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
              <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
              <h4 className="font-serif text-lg font-bold text-charcoal-dark">
                {confirmedPaymentId.startsWith('pay_') ? 'Session Confirmed!' : 'Booking Submitted!'}
              </h4>
              <p className="text-xs text-charcoal-light leading-relaxed px-4 font-sans">
                Blessings, {name}! Your session booking for <strong>{bookingServiceTitle}</strong> (Exchange: ₹{effectivePrice}) has been {confirmedPaymentId.startsWith('pay_') ? 'paid online and confirmed' : 'submitted for verification'}. Slot: <strong>{selectedSlot}</strong>. Confirmation email sent to <strong>{email}</strong>!
              </p>
              <div className="flex flex-col gap-2 w-full mt-4 font-sans">
                <a
                  href={`https://wa.me/918929061557?text=Hi%20Sonali,%20I%20have%20booked%20a%20session%20for%20${encodeURIComponent(bookingServiceTitle)}%20(Exchange:%20₹${effectivePrice}).%20Payment%20Reference:%20${confirmedPaymentId || transactionId}.%20Looking%20forward%20to%20our%20session!`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>Message on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSessionModal;
