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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RegisterWorkshopModal = ({ workshop, onClose }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Custom UPI QR States
  const [transactionId, setTransactionId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        userId: user ? user._id : null
      };

      const { data } = await axios.post(`/api/workshops/${workshop._id}/register`, payload);

      if (data.free) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      setOrderDetails(data.data);

      if (data.data.orderId.startsWith('mock_order_')) {
        setSimulationMode(true);
        setLoading(false);
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ascensionKeyId123',
          amount: data.data.amount,
          currency: data.data.currency,
          name: 'Ascension by Sonali',
          description: `Registration: ${workshop.title}`,
          order_id: data.data.orderId,
          handler: async (response) => {
            setLoading(true);
            try {
              const verifyPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_details: {
                  name,
                  email,
                  phone,
                  userId: user ? user._id : null
                }
              };
              const verification = await axios.post(`/api/workshops/${workshop._id}/verify`, verifyPayload);
              if (verification.data.success) {
                setSuccess(true);
              }
            } catch (err) {
              alert(err.response?.data?.message || 'Verification failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: { name, email, contact: phone },
          theme: { color: '#D4AF37' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (e) => {
    if (e) e.preventDefault();
    if (!transactionId || !selectedFile) {
      alert('Please upload your payment screenshot and enter the 12-digit transaction ID.');
      return;
    }
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
      formData.append('phone', phone);
      formData.append('transactionId', cleanedTxId);
      formData.append('paymentScreenshot', selectedFile);
      if (user) {
        formData.append('userId', user._id);
      }

      const { data } = await axios.post(`/api/workshops/${workshop._id}/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit payment verification request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-cream-dark">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Register for Workshop
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5">
              {workshop.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success Screen */
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <CheckCircle className="w-12 h-12 text-sage animate-pulse-subtle" />
            <h4 className="font-serif text-lg font-bold text-charcoal-dark">
              Registration Confirmed!
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-4">
              Blessings! You are successfully registered for **{workshop.title}** on **{new Date(workshop.date).toLocaleDateString()}** at **{workshop.time}**. Look out for a confirmation email/message!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-4"
            >
              Close
            </button>
          </div>
        ) : simulationMode ? (
          /* Custom UPI QR code Payment Screen */
          <form onSubmit={handleSimulatePayment} className="p-6 flex flex-col gap-4 text-xs text-charcoal max-h-[75vh] overflow-y-auto scrollbar-thin">
            
            <div className="bg-cream p-3 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
              <span className="text-charcoal-light">Registration Fees</span>
              <span className="font-serif font-bold text-gold-dark text-sm">₹{workshop.pricing}</span>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <h4 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider flex items-center gap-1.5 justify-center">
                <CreditCard className="w-4 h-4 text-gold-dark" />
                <span>UPI QR Code Payment</span>
              </h4>
              
              <div className="w-56 h-56 bg-white border border-cream-dark/80 p-3 rounded-xl overflow-hidden shadow-xs flex items-center justify-center">
                <img 
                  src={getImageUrl('/uploads/default_upi_qr.jpg')} 
                  alt="UPI QR Code Scan" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-charcoal-dark font-sans leading-relaxed border-t border-cream-dark/45 pt-3 w-full text-left">
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
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Choose receipt screenshot"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 uppercase tracking-wider text-[9px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider text-[9px]"
              >
                {loading ? 'Submitting...' : 'Submit Payment Details'}
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form Screen */
          <form onSubmit={handleRegister} className="p-6 flex flex-col gap-4 font-sans text-xs">
            
            <div className="bg-cream p-3.5 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
              <span className="text-charcoal-light">Registration Fee</span>
              <span className="font-serif font-bold text-sm text-gold-dark">
                {workshop.pricing === 0 ? 'FREE' : `₹${workshop.pricing}`}
              </span>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter name"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter WhatsApp mobile"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                {loading && <Compass className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Processing...' : workshop.pricing === 0 ? 'Register Now (Free)' : 'Pay & Register'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterWorkshopModal;
