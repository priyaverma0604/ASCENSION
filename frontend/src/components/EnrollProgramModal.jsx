import React, { useState, useContext } from 'react';
import { 
  X, CheckCircle, Compass, UploadCloud, Smartphone, Video, ExternalLink, 
  MessageCircle, Copy, Check, CreditCard, ShieldCheck, Zap 
} from 'lucide-react';
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

const EnrollProgramModal = ({ program, onClose }) => {
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'upi_qr'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState('');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedVideo, setCopiedVideo] = useState(false);

  // Form fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const programPrice = Number(program.sellingPrice || program.pricing) || 0;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleRazorpayPayment = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please provide your name, email, and phone number.');
      return;
    }

    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay payment gateway failed to load. Please check your connection.');
        setLoading(false);
        return;
      }

      const { data } = await axios.post(`/api/programs/${program._id}/enroll-order`, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });

      if (!data.success) {
        alert(data.message || 'Could not initiate enrollment order');
        setLoading(false);
        return;
      }

      if (data.free) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TZqxQy6crShQ65',
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Ascension by Sonali Bhasin Kumar',
        description: `Enrollment: ${program.title}`,
        image: '/logo.png',
        order_id: data.data.orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim()
        },
        theme: {
          color: '#D4AF37'
        },
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await axios.post(`/api/programs/${program._id}/enroll-verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userDetails: {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                userId: user?._id || null
              }
            });

            if (verifyRes.data.success) {
              setConfirmedPaymentId(response.razorpay_payment_id);
              setSuccess(true);
            }
          } catch (err) {
            alert(err.response?.data?.message || 'Enrollment payment verification failed');
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

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim() || !screenshot) {
      alert('Please enter your transaction ID and upload payment screenshot');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('transactionId', transactionId.trim());
      formData.append('phone', phone.trim());
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('paymentScreenshot', screenshot);

      const { data } = await axios.post(`/api/programs/${program._id}/enroll-qr`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setConfirmedPaymentId(transactionId.trim());
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit enrollment request');
    } finally {
      setLoading(false);
    }
  };

  const isAncestral = (program.title && program.title.toLowerCase().includes('ancestral')) || (program.name && program.name.toLowerCase().includes('ancestral'));
  const whatsappLink = program.whatsappGroupLink || (isAncestral ? 'https://chat.whatsapp.com/J4nXj2mznEfLCj2YZd1v16' : '');
  const videoLink = isAncestral ? 'https://youtu.be/jIs3IH-brtg' : (program.introVideoUrl || program.videoUrl || '');

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up text-left max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-cream-dark shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Program Enrollment
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5 max-w-[280px] truncate">
              {program.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success Screen */
          <div className="p-5 sm:p-7 flex flex-col items-center justify-center text-center gap-3 overflow-y-auto flex-1">
            <CheckCircle className="w-11 h-11 text-gold animate-pulse" />
            <h4 className="font-serif text-lg font-bold text-charcoal-dark">
              {confirmedPaymentId.startsWith('pay_') ? 'Enrollment Confirmed!' : 'Request Submitted!'}
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-2 border-b border-cream-dark/50 pb-2.5">
              Thank you, <strong>{name || user?.name || 'Devotee'}</strong>! Your enrollment for <strong>{program.title}</strong> has been {confirmedPaymentId.startsWith('pay_') ? 'confirmed and activated' : 'submitted for verification'}. Reference ID: <strong>{confirmedPaymentId || transactionId}</strong>.
            </p>

            {/* WhatsApp Group Banner */}
            {whatsappLink && (
              <div className="w-full bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 my-1">
                <div className="flex items-center gap-1.5 text-[#128C7E] font-bold text-xs">
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                  <span>Join Program WhatsApp Group</span>
                </div>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Please join our official WhatsApp community group for live class links, reminders, and cohort updates.
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
                  Please watch this video before starting the program.
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
              className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-3 uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          /* Checkout Screen */
          <div className="p-4 sm:p-5 flex flex-col gap-4 text-xs text-charcoal overflow-y-auto flex-1">
            
            {/* Price Box */}
            <div className="flex justify-between items-center bg-cream/70 p-3 rounded-xl border border-cream-dark font-sans">
              <span className="text-charcoal-light font-medium">Program Investment</span>
              <span className="font-serif font-bold text-sm text-gold-dark">
                ₹{new Intl.NumberFormat('en-IN').format(programPrice)}
              </span>
            </div>

            {/* User Info Inputs */}
            <div className="flex flex-col gap-2.5 font-sans">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex rounded-xl p-1 bg-cream border border-cream-dark/60 gap-1 mt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'razorpay'
                    ? 'bg-gold text-charcoal-dark shadow-xs'
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
                    ? 'bg-gold text-charcoal-dark shadow-xs'
                    : 'text-charcoal hover:bg-cream-light'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Manual UPI QR</span>
              </button>
            </div>

            {paymentMethod === 'razorpay' ? (
              /* Online Razorpay Flow */
              <div className="flex flex-col gap-3.5">
                <div className="bg-cream-light/60 border border-cream-dark/60 p-3.5 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gold-dark font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-gold-dark" />
                    <span>Instant Program Access via Razorpay</span>
                  </div>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">
                    Pay securely using UPI Apps (Google Pay, PhonePe, Paytm), Cards, or Netbanking. Your program access will be unlocked instantly.
                  </p>
                </div>

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRazorpayPayment}
                    className="w-2/3 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-[10px] border border-gold-dark/20"
                  >
                    {loading ? <Compass className="w-4 h-4 animate-spin text-charcoal-dark" /> : <Zap className="w-4 h-4" />}
                    <span>{loading ? 'Opening Gateway...' : `Pay ₹${new Intl.NumberFormat('en-IN').format(programPrice)}`}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Manual UPI Form */
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-3.5">
                <div className="bg-cream/60 border border-cream-dark/60 p-3 rounded-xl flex gap-3 text-charcoal-light font-sans leading-relaxed">
                  <Smartphone className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[9px] text-charcoal-dark">Scan & Pay via UPI</p>
                    <p className="text-[10px] mt-0.5">
                      Pay to UPI ID: <strong className="text-charcoal-dark">sonalibhasinkumar@ptaxis</strong>. Then enter reference ID and upload receipt below.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center py-2 bg-white/40 rounded-xl border border-cream-dark/40 max-w-[180px] mx-auto">
                  <img 
                    src={getImageUrl('/uploads/default_upi_qr.jpg')} 
                    alt="Payment QR Code" 
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Transaction Reference ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 12-digit transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Upload Receipt Screenshot</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-cream-dark/60 rounded-xl py-3 px-4 bg-cream-light hover:bg-cream cursor-pointer transition-colors duration-200">
                      <UploadCloud className="w-5 h-5 text-gold-dark mb-1" />
                      <span className="text-[10px] text-charcoal-light">
                        {screenshot ? screenshot.name : 'Choose image file'}
                      </span>
                      <input 
                        type="file" 
                        required
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                    {screenshotPreview && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-cream-dark shrink-0">
                        <img src={screenshotPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-[10px] border border-gold-dark/20"
                  >
                    {loading && <Compass className="w-4 h-4 animate-spin text-charcoal-dark" />}
                    <span>{loading ? 'Submitting...' : 'Submit Receipt'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollProgramModal;
