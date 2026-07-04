import React, { useState, useContext } from 'react';
import { X, CheckCircle, Compass, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookRetreatModal = ({ retreat, onClose }) => {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState('choose'); // 'choose', 'inquiry', 'checkout'
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [simulationMode, setSimulationMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        message,
        userId: user ? user._id : null
      };

      const { data } = await axios.post(`/api/retreats/${retreat._id}/interest`, payload);
      if (data.success) {
        setSuccessMsg(`Blessings! Your interest in ${retreat.title} has been logged. We will reach out to you with brochure details and options.`);
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register interest');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to make a payment reservation.');
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/retreats/${retreat._id}/book`, { phone });
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
          description: `Retreat Booking: ${retreat.title}`,
          order_id: data.data.orderId,
          handler: async (response) => {
            setLoading(true);
            try {
              const verifyPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                phone,
                message: message || 'Retreat Booking Order'
              };
              const verification = await axios.post(`/api/retreats/${retreat._id}/verify`, verifyPayload);
              if (verification.data.success) {
                setSuccessMsg(`Congratulations, ${name}! Your slot in the ${retreat.title} is officially reserved! We will connect with you to plan travel arrangements.`);
                setSuccess(true);
              }
            } catch (verifyErr) {
              alert(verifyErr.response?.data?.message || 'Booking verification failed');
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
      alert(err.response?.data?.message || 'Failed to initiate booking payment');
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const verifyPayload = {
        razorpay_payment_id: `sim_pay_${Math.random().toString(36).substring(7)}`,
        razorpay_order_id: orderDetails.orderId,
        razorpay_signature: 'simulated_signature',
        phone,
        message: message || 'Simulated Retreat Booking Order'
      };

      const { data } = await axios.post(`/api/retreats/${retreat._id}/verify`, verifyPayload);
      if (data.success) {
        setSuccessMsg(`Congratulations, ${name}! (Simulation Mode) Your slot in the ${retreat.title} is officially reserved!`);
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Simulation verification failed');
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
              {mode === 'checkout' ? 'Book Participation' : mode === 'inquiry' ? 'Register Interest' : 'Retreat Booking'}
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5">
              {retreat.title}
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
              Confirmation Sent
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-4">
              {successMsg}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-4 animate-fade-in"
            >
              Close
            </button>
          </div>
        ) : mode === 'choose' ? (
          /* Selection Screen */
          <div className="p-6 flex flex-col gap-4 text-xs font-sans text-charcoal">
            <p className="text-charcoal-light leading-relaxed">
              How would you like to proceed with the **{retreat.title}**?
            </p>
            
            {/* Option 1: Inquiry */}
            <button
              onClick={() => setMode('inquiry')}
              className="w-full text-left p-4 rounded-xl border border-cream-dark bg-cream/40 hover:bg-cream hover:border-sage transition-all duration-300 flex flex-col gap-1"
            >
              <span className="font-bold text-charcoal-dark uppercase tracking-wider text-[10px]">Option A: Register Interest</span>
              <span className="text-[11px] text-charcoal-light">Send an inquiry. We will contact you with dates, full itinerary brochures, and answers to your questions.</span>
            </button>

            {/* Option 2: Payment booking */}
            <button
              onClick={() => {
                if (!user) {
                  alert('Please log in first.');
                } else {
                  setMode('checkout');
                }
              }}
              className="w-full text-left p-4 rounded-xl border border-cream-dark bg-cream/40 hover:bg-cream hover:border-gold transition-all duration-300 flex flex-col gap-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-charcoal-dark uppercase tracking-wider text-[10px] text-gold-dark">Option B: Confirm Booking</span>
                <span className="font-serif font-bold text-xs text-gold-dark">₹{retreat.pricing}</span>
              </div>
              <span className="text-[11px] text-charcoal-light">Submit payment. Reserve your room and guaranteed participation slot in this retreat instantly.</span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 mt-2 text-center"
            >
              Cancel
            </button>
          </div>
        ) : simulationMode ? (
          /* Simulation Mode Screen */
          <div className="p-6 flex flex-col gap-4 text-xs text-charcoal">
            <div className="bg-lavender-light/40 border border-lavender p-4 rounded-xl flex gap-3">
              <AlertTriangle className="w-6 h-6 text-lavender-dark shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">Payment Simulation</p>
                <p className="mt-1 leading-relaxed text-charcoal-light">
                  Confirm mock payment transaction below to book your spot in the retreat.
                </p>
              </div>
            </div>
            <div className="bg-cream p-3.5 rounded-xl border border-cream-dark flex justify-between items-center font-sans">
              <span className="text-charcoal-light">Total Fees</span>
              <span className="font-serif font-bold text-gold-dark text-sm">₹{retreat.pricing}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMode('choose')}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center"
              >
                {loading ? 'Booking...' : 'Confirm Simulation'}
              </button>
            </div>
          </div>
        ) : mode === 'inquiry' ? (
          /* Interest Form Screen */
          <form onSubmit={handleInquirySubmit} className="p-6 flex flex-col gap-4 font-sans text-xs">
            
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
                placeholder="Enter mobile"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Questions or travel notes</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                placeholder="Tell us about yourself, and if you are traveling with companions..."
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        ) : (
          /* Direct Payment Booking Form */
          <form onSubmit={handleStartBooking} className="p-6 flex flex-col gap-4 font-sans text-xs">
            <div className="bg-cream p-3 rounded-xl border border-cream-dark flex justify-between items-center text-charcoal">
              <span className="text-charcoal-light">Total Fees</span>
              <span className="font-serif font-bold text-sm text-gold-dark">₹{retreat.pricing}</span>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Billing Name</label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full bg-cream border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Contact Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter mobile"
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-gold hover:bg-gold-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                {loading && <Compass className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Initializing...' : 'Proceed to Pay'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookRetreatModal;
