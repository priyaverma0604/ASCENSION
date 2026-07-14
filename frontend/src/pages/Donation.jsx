import React, { useState } from 'react';
import { Copy, Heart, CheckCircle, Smartphone, HelpCircle, ArrowRight, DollarSign, Compass } from 'lucide-react';
import axios from 'axios';
import sevaLogo from '../assets/seva_logo.png';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Donation = () => {
  const [activeMode, setActiveMode] = useState('razorpay'); // 'razorpay', 'upi_qr'
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState(''); // for manual UPI reference

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const upiId = 'info@ascension.ind.in';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRazorpayDonation = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Please specify a valid donation amount');
      return;
    }
    setLoading(true);

    try {
      // 1. Create order
      const { data } = await axios.post('/api/donations/razorpay-order', {
        amount, name, email, phone, message
      });

      if (data.data.orderId.startsWith('mock_order_')) {
        // Simulation mode
        const verifyPayload = {
          razorpay_payment_id: `sim_don_pay_${Math.random().toString(36).substring(7)}`,
          razorpay_order_id: data.data.orderId,
          razorpay_signature: 'simulated_signature',
          donor_details: {
            name: name || 'Anonymous',
            email: email || '',
            phone: phone || '',
            amount,
            message: message || ''
          }
        };

        const verify = await axios.post('/api/donations/verify', verifyPayload);
        if (verify.data.success) {
          setSuccessMsg('Blessings! Your simulated donation transaction was completed successfully. Thank you for supporting Ascension Seva!');
          setSuccess(true);
        }
        setLoading(false);
      } else {
        // Load Live Razorpay
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
          name: 'Ascension Seva NGO',
          description: 'Charitable Donation Support',
          order_id: data.data.orderId,
          handler: async (response) => {
            setLoading(true);
            try {
              const verifyPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                donor_details: {
                  name,
                  email,
                  phone,
                  amount,
                  message
                }
              };
              const verification = await axios.post('/api/donations/verify', verifyPayload);
              if (verification.data.success) {
                setSuccessMsg('Blessings! Your donation transaction has been completed successfully. We appreciate your generosity!');
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
      alert(err.response?.data?.message || 'Initiating donation failed');
      setLoading(false);
    }
  };

  const handleManualUpiSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Please specify a valid donation amount');
      return;
    }
    if (!transactionId) {
      alert('Please provide the UPI Transaction Reference ID');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        name: name || 'Anonymous',
        email,
        phone,
        amount,
        transactionId,
        message
      };

      const { data } = await axios.post('/api/donations/log-upi', payload);
      if (data.success) {
        setSuccessMsg('Blessings! Your UPI donation log has been received. Our admin will verify the funds transfer and update the status in our dashboard records. Thank you!');
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log UPI transaction');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAmount('');
    setMessage('');
    setTransactionId('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">

        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">Make an Impact</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark leading-tight flex justify-center items-center gap-2 flex-wrap">
            <span>Support</span>
            <img src={sevaLogo} alt="Ascension Seva" className="h-16 md:h-20 w-auto object-contain inline-block" />
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed">
            Every contribution directly funds our local Delhi food distribution campaigns, underprivileged children tutoring drives, women confidence workshops, and stray animal care circles.
          </p>
        </div>

        {/* Seva Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-sm flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-44 overflow-hidden bg-cream">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
                alt="Delhi Food Distribution Drive"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Food Distribution Seva</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Distributing warm, hygienic, and nutritious meals daily to neglected street elders and underprivileged children in Delhi slum areas.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-sm flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-44 overflow-hidden bg-cream">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
                alt="Children Education and Welfare"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Shiksha Education</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Providing tutoring support, stationary supplies, creative arts, and mindfulness camps for underprivileged children to inspire healing.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-sm flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-44 overflow-hidden bg-cream">
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80"
                alt="Elderly Welfare Support"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Elderly Care & Support</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Supporting local elders with health aids, hygiene kits, clothing, and blankets, ensuring they are cared for with dignity and warmth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {success ? (
          /* Thank You Screen */
          <div className="glass max-w-lg mx-auto w-full p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center gap-4 border border-sage/40 animate-fade-in">
            <Heart className="w-14 h-14 text-red-500 fill-current animate-pulse-subtle" />
            <h2 className="font-serif text-xl font-bold text-charcoal-dark">
              Thank You for Your Generosity!
            </h2>
            <p className="text-xs text-charcoal-light leading-relaxed px-4">
              {successMsg}
            </p>
            <button
              onClick={clearForm}
              className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-8 rounded-xl text-xs uppercase tracking-wider mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Left: Donation Mode Options */}
            <div className="flex flex-col gap-6 text-left">
              <div className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col gap-4">
                <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider border-b border-cream-dark pb-2">
                  Select Donation Method
                </h3>

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveMode('razorpay')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${activeMode === 'razorpay'
                        ? 'bg-sage text-white border-sage shadow-sm'
                        : 'bg-cream/40 border-cream-dark/60 text-charcoal hover:bg-cream'
                      }`}
                  >
                    Online Cards / UPI
                  </button>
                  <button
                    onClick={() => setActiveMode('upi_qr')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${activeMode === 'upi_qr'
                        ? 'bg-sage text-white border-sage shadow-sm'
                        : 'bg-cream/40 border-cream-dark/60 text-charcoal hover:bg-cream'
                      }`}
                  >
                    UPI QR Code
                  </button>
                </div>

                {activeMode === 'upi_qr' && (
                  /* UPI QR code contents */
                  <div className="flex flex-col items-center gap-4 mt-2 bg-cream p-4 rounded-xl border border-cream-dark/60">
                    <p className="text-[10px] text-center text-charcoal-light font-sans max-w-[180px] leading-relaxed">
                      Scan QR code below using GPay, PhonePe, Paytm, or any BHIM UPI App.
                    </p>

                    {/* Simulated High Quality QR code */}
                    <div className="w-40 h-40 bg-white border border-cream-dark p-2 rounded-xl flex items-center justify-center relative">
                      <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal-dark/5 via-charcoal-dark/30 to-charcoal-dark/70 rounded flex flex-col items-center justify-center gap-1">
                        <Smartphone className="w-8 h-8 text-charcoal" />
                        <span className="font-bold text-[10px] tracking-wide text-charcoal">UPI QR CODE</span>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-1 font-sans text-xs">
                      <span className="text-[9px] uppercase text-charcoal-light text-center">UPI Address</span>
                      <div className="flex justify-between items-center bg-cream-light border border-cream-dark/80 rounded-xl py-2 px-3">
                        <span className="font-mono font-bold select-all text-charcoal-dark truncate">{upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 hover:text-gold transition-colors focus:outline-none"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      {copied && (
                        <span className="text-[10px] text-sage font-bold text-center mt-1 animate-pulse">
                          UPI ID Copied to clipboard!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Donation Forms details */}
            <div className="glass p-6 rounded-2xl border border-cream-dark/50">

              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider text-left border-b border-cream-dark pb-2 mb-4">
                Donation Details
              </h3>

              {activeMode === 'razorpay' ? (
                /* Razorpay Donation Form */
                <form onSubmit={handleRazorpayDonation} className="flex flex-col gap-4 font-sans text-xs text-left text-charcoal">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Donation Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min="50"
                      placeholder="₹ Enter amount (min ₹50)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Donor Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter name (or blank for Anonymous)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="Enter email for receipts"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="Enter phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Blessing message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                      placeholder="Add a prayer, blessing message, or dedication note..."
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider mt-2"
                  >
                    {loading && <Compass className="w-4 h-4 animate-spin" />}
                    <span>{loading ? 'Processing...' : 'Donate via Online Cards/UPI'}</span>
                  </button>
                </form>
              ) : (
                /* Manual UPI Logging Form */
                <form onSubmit={handleManualUpiSubmit} className="flex flex-col gap-4 font-sans text-xs text-left text-charcoal">

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Transferred Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="₹ Enter amount transferred"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">UPI Transaction ID / Reference No.</label>
                    <input
                      type="text"
                      required
                      placeholder="12-digit UPI reference number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter donor name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Blessing message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                      placeholder="Add a prayer, blessing message, or dedication note..."
                      className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-2"
                  >
                    {loading ? 'Logging Transaction...' : 'Verify & Log Donation'}
                  </button>

                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Donation;
