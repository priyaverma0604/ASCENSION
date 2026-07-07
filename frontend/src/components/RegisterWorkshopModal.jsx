import React, { useState, useContext } from 'react';
import { X, CheckCircle, Compass, AlertTriangle, UploadCloud, CreditCard } from 'lucide-react';
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
  const [step, setStep] = useState(1); // 1: Info form, 2: Payment page, 3: Success page
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // If workshop price is 0 (Free), we submit immediately without showing QR code
    if (workshop.pricing === 0) {
      handleFreeSubmit();
    } else {
      setStep(2); // Go to Payment Page
    }
  };

  const handleFreeSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', `${countryCode} ${phone.trim()}`);
      if (user) {
        formData.append('userId', user._id);
      }

      const { data } = await axios.post(`/api/workshops/${workshop._id}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setStep(3); // Success page
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Workshop registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Workshop Registration
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5 max-w-[280px] truncate">
              {workshop.title}
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
                  {workshop.pricing === 0 ? 'FREE' : `₹${workshop.pricing}`}
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
                  className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-all text-center uppercase tracking-wider text-[9px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center uppercase tracking-wider text-[9px] gap-2"
                >
                  {loading && <Compass className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Processing...' : workshop.pricing === 0 ? 'Register Now (Free)' : 'Proceed to Payment'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            /* Step 2: UPI Manual Payment Form */
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 font-sans text-xs text-left">
              
              {/* Workshop info details summary */}
              <div className="bg-cream/50 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                <div className="flex justify-between items-center text-charcoal border-b border-cream-dark/50 pb-2">
                  <span className="font-bold font-serif text-[13px]">{workshop.title}</span>
                  <span className="font-serif font-bold text-gold-dark text-[13px]">₹{workshop.pricing}</span>
                </div>
                <div className="text-[10px] text-charcoal-light flex flex-col gap-0.5">
                  <p><strong>Date & Time:</strong> {formattedDate} at {workshop.time}</p>
                </div>
              </div>

              {/* UPI Details Display */}
              <div className="flex flex-col items-center text-center gap-3">
                <h4 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider flex items-center gap-1.5 justify-center">
                  <CreditCard className="w-4 h-4 text-gold-dark" />
                  <span>Manual UPI Payment</span>
                </h4>
                
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
                </div>

                <div className="bg-lavender-light/40 border border-lavender p-3 rounded-xl flex gap-2 text-left text-[10px]">
                  <AlertTriangle className="w-4.5 h-4.5 text-lavender-dark shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-charcoal-light">
                    Scan the QR code above using GPay, PhonePe, Paytm, or BHIM. After making the payment, enter the 12-digit transaction ID and upload the receipt screenshot below.
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
            <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
              <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
              <h4 className="font-serif text-lg font-bold text-charcoal-dark">
                Registration Submitted!
              </h4>
              <p className="text-xs text-charcoal-light leading-relaxed px-4">
                Blessings! Your registration request for <strong>{workshop.title}</strong> has been submitted. Our team will verify your transaction ID shortly and confirm your seat via email!
              </p>
              <button
                onClick={onClose}
                className="w-full bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-4"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWorkshopModal;
