import React, { useState, useEffect, useContext } from 'react';
import { X, CheckCircle, Compass, HelpCircle, AlertTriangle } from 'lucide-react';
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

const EnrollProgramModal = ({ program, onClose }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const startEnrollment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const { data } = await axios.post(`/api/programs/${program._id}/enroll-order`);
      
      if (data.free) {
        // Free enrollment completed immediately
        setSuccess(true);
        setLoading(false);
        return;
      }

      setOrderDetails(data.data);

      // Check if order is simulated or mock
      if (data.data.orderId.startsWith('mock_order_')) {
        setSimulationMode(true);
        setLoading(false);
      } else {
        // 2. Load script & run Razorpay
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK. Check your internet connection.');
          setLoading(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ascensionKeyId123',
          amount: data.data.amount,
          currency: data.data.currency,
          name: 'Ascension by Sonali',
          description: `Enrollment: ${program.title}`,
          order_id: data.data.orderId,
          handler: async (response) => {
            setLoading(true);
            try {
              const verifyPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              };
              const verification = await axios.post(`/api/programs/${program._id}/enroll-verify`, verifyPayload);
              if (verification.data.success) {
                setSuccess(true);
              }
            } catch (err) {
              alert(err.response?.data?.message || 'Payment verification failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: data.data.user.name,
            email: data.data.user.email
          },
          theme: {
            color: '#D4AF37' // Brand Gold
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate enrollment');
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const verifyPayload = {
        razorpay_payment_id: `sim_pay_${Math.random().toString(36).substring(7)}`,
        razorpay_order_id: orderDetails.orderId,
        razorpay_signature: 'simulated_signature'
      };
      
      const { data } = await axios.post(`/api/programs/${program._id}/enroll-verify`, verifyPayload);
      if (data.success) {
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
              Enroll in Program
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5">
              {program.title}
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
              Enrollment Confirmed!
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-4">
              Thank you, {user?.name}! You have successfully enrolled in **{program.title}**. You will receive an email confirmation with scheduling details shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-sage hover:bg-sage-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-4"
            >
              Back to Programs
            </button>
          </div>
        ) : simulationMode ? (
          /* Simulation Mode Screen */
          <div className="p-6 flex flex-col gap-4">
            <div className="bg-lavender-light/40 border border-lavender p-4 rounded-xl flex gap-3 text-xs text-charcoal">
              <AlertTriangle className="w-6 h-6 text-lavender-dark shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">Razorpay Sandbox Mode</p>
                <p className="mt-1 leading-relaxed text-charcoal-light">
                  Razorpay credentials are not set on this server. We will mock the payment process so you can test enrollment.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center bg-cream p-4 rounded-xl border border-cream-dark font-sans text-xs">
              <span className="text-charcoal-light">Program Investment</span>
              <span className="font-serif font-bold text-sm text-gold-dark">₹{program.pricing}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center text-xs"
              >
                {loading ? 'Processing...' : 'Confirm Simulated Payment'}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Details Screen */
          <div className="p-6 flex flex-col gap-5 text-xs text-charcoal">
            <div className="flex flex-col gap-2 font-sans">
              <div className="flex justify-between items-center py-2 border-b border-cream-dark">
                <span className="text-charcoal-light">Duration</span>
                <span className="font-medium">{program.duration}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-cream-dark">
                <span className="text-charcoal-light">Capacity Limit</span>
                <span className="font-medium">{program.enrollmentCapacity} seats</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-cream px-3 rounded-xl border border-cream-dark mt-2">
                <span className="text-charcoal-light font-medium">Total Fees</span>
                <span className="font-serif font-bold text-sm text-gold-dark">₹{program.pricing}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={startEnrollment}
                disabled={loading}
                className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                {loading && <Compass className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Initializing...' : 'Proceed to Payment'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollProgramModal;
