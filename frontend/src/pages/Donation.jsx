import React, { useState } from 'react';
import { Heart, CheckCircle, ShieldCheck, Sparkles, Compass, Lock, Gift, Users, CreditCard } from 'lucide-react';
import axios from 'axios';
import sevaLogo from '../assets/seva_logo.png';
import foodDistributionImg from '../assets/gallery/mahabhoj_4.png';
import shikshaEducationImg from '../assets/gallery/shiksha_kendra_1.png';
import womenDignityImg from '../assets/gallery/women_hygiene_2.jpg';
import shikshaHeroBanner from '../assets/gallery/shiksha_hero_banner.jpg';

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
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1100');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const presetAmounts = [500, 1100, 2100, 5100, 11000];

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
          setSuccessMsg('Blessings! Your donation was completed successfully. Thank you for supporting Ascension Seva!');
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
          key: import.meta.env.VITE_RAZORPAY_SEVA_KEY_ID || 'rzp_live_TZyjJGoSABoWsa',
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
                setSuccessMsg('Blessings! Your donation transaction has been completed successfully. We deeply appreciate your generosity!');
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

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAmount('1100');
    setMessage('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14">

        {/* Header Section */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Make an Impact</span>
          <h1 className="flex flex-col items-center gap-1">
            <span className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-widest text-charcoal-dark select-none">SUPPORT</span>
            <img src={`${sevaLogo}?v=3`} alt="Ascension Seva" className="h-10 md:h-14 w-auto object-contain" />
          </h1>
          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed">
            Every contribution directly funds our local Delhi food distribution campaigns, underprivileged children tutoring drives, women confidence workshops, and health outreach circles.
          </p>
        </div>

        {/* Seva Visual Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-xs flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-40 sm:h-44 overflow-hidden bg-cream">
              <img
                src={foodDistributionImg}
                alt="Delhi Food Distribution Drive"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Food Distribution Seva</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Distributing warm, hygienic, and nutritious meals daily to neglected street elders and underprivileged children in Delhi community areas.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-xs flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-44 overflow-hidden bg-cream">
              <img
                src={shikshaEducationImg}
                alt="Shiksha Kendra Seva"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Shiksha Kendra Seva</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Providing tutoring support, stationery supplies, creative arts, and foundational learning circles for underprivileged children.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] overflow-hidden border border-cream-dark/50 shadow-xs flex flex-col group transition-all duration-300 hover:shadow-lg">
            <div className="h-44 overflow-hidden bg-cream">
              <img
                src={womenDignityImg}
                alt="Women Dignity & Hygiene Drive"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 text-left flex-1 bg-white/40 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs font-bold text-charcoal-dark uppercase tracking-wider">Women Dignity & Hygiene</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed mt-2">
                  Distributing free sanitary kits and dignity care packs directly to women in need, breaking taboos and fostering empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Form with NGO Photo Backdrop */}
        {success ? (
          /* Thank You Screen */
          <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-14 border border-gold/40 shadow-xl max-w-2xl mx-auto w-full text-center flex flex-col items-center justify-center gap-5 bg-white/95 backdrop-blur-md animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center">
              <Heart className="w-8 h-8 text-sage fill-current animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-dark">
              Thank You for Your Generosity!
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed max-w-md">
              {successMsg}
            </p>
            <div className="border-t border-cream-dark/60 pt-4 w-full flex justify-center">
              <button
                onClick={clearForm}
                className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-3 px-10 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all duration-300"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-[32px] overflow-hidden border border-gold/35 shadow-xl bg-charcoal-dark text-left">
            {/* Authentic NGO Photo Background with Warm Atmosphere */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center opacity-25 scale-105"
              style={{ backgroundImage: `url(${shikshaHeroBanner})` }}
            />
            {/* Ambient gradients for high readability and premium feel */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-charcoal-dark/95 via-charcoal-dark/85 to-charcoal-dark/95" />
            <div className="absolute inset-0 z-0 bg-radial from-transparent via-charcoal-dark/40 to-charcoal-dark/90" />

            <div className="relative z-10 p-6 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left Column: Mission & Impact Promise */}
              <div className="lg:col-span-5 flex flex-col gap-5 text-white">
                <span className="font-sans text-[10px] sm:text-xs text-gold-light tracking-[0.25em] font-bold uppercase bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-xs border border-white/15">
                  ✨ 100% Direct Impact Seva
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  Transform Lives with Your Contribution
                </h2>

                <p className="text-xs sm:text-sm text-cream-light leading-relaxed font-sans opacity-90">
                  Every rupee goes straight towards daily nutritious food seva, children's education kits, women's menstrual health essentials, and patient wellness support across Delhi.
                </p>

                {/* Trust Points */}
                <div className="flex flex-col gap-3 pt-2 text-xs text-cream-light font-sans">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                    <ShieldCheck className="w-5 h-5 text-gold-light shrink-0" />
                    <span>Instant Payment Confirmation & Verification</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                    <CreditCard className="w-5 h-5 text-gold-light shrink-0" />
                    <span>Supports GPay, PhonePe, Paytm, BHIM, Cards & NetBanking</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
                    <Lock className="w-5 h-5 text-gold-light shrink-0" />
                    <span>Encrypted & 100% Safe Payments via Razorpay</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Donation Form */}
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl">
                <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3 mb-5">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-dark">
                      Contribute to Seva
                    </h3>
                    <p className="text-[11px] text-charcoal-light font-medium">Select or enter your desired donation amount</p>
                  </div>
                  <Heart className="w-6 h-6 text-gold-dark" />
                </div>

                <form onSubmit={handleRazorpayDonation} className="flex flex-col gap-4 font-sans text-xs text-charcoal text-left">
                  
                  {/* Quick Amount Pills */}
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Select Amount (INR)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmount(preset.toString())}
                          className={`py-2 px-2 text-center rounded-xl border font-bold text-xs transition-all duration-200 ${
                            amount === preset.toString()
                              ? 'bg-gold text-charcoal-dark border-gold shadow-xs'
                              : 'bg-cream-light border-cream-dark/70 text-charcoal hover:border-gold/60'
                          }`}
                        >
                          ₹{preset.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Or Enter Custom Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-charcoal-light">₹</span>
                      <input
                        type="number"
                        required
                        min="50"
                        placeholder="Enter amount (min ₹50)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 pl-8 pr-3.5 focus:outline-none focus:border-gold transition-colors font-medium text-charcoal-dark"
                      />
                    </div>
                  </div>

                  {/* Donor Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Donor Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Your name (or leave blank)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="For digital payment receipt"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-cream-light/60 border border-cream-dark rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Blessing / Dedication Note (Optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="2"
                      placeholder="Add a prayer, dedication, or heartfelt blessing message..."
                      className="w-full bg-cream-light/60 border border-cream-dark rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-wider mt-2 disabled:opacity-50"
                  >
                    {loading && <Compass className="w-4 h-4 animate-spin" />}
                    <span>
                      {loading 
                        ? 'Processing Donation...' 
                        : `Proceed to Donate ${amount ? `₹${Number(amount).toLocaleString('en-IN')}` : ''}`}
                    </span>
                  </button>

                  <p className="text-[10px] text-center text-charcoal-light mt-1">
                    Accepts UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards & NetBanking
                  </p>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Donation;
