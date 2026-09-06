import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, RefreshCw, Eye, EyeOff, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email Form, 2: Code + New Password Form, 3: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Pre-fill email from query param if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send Reset Code
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/forgotpassword', { email });
      if (data.success) {
        setSuccessMsg(data.message || 'Verification code sent to your email.');
        setStep(2);
        setResendCooldown(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send recovery code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password with 6-digit code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!code || code.trim().length !== 6) {
      setError('Please enter the valid 6-digit verification code sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/resetpassword', {
        email,
        code: code.trim(),
        newPassword
      });

      if (data.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 font-sans py-12">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl border border-cream-dark/50 p-6 sm:p-8 animate-slide-up relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sage/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header / Brand */}
        <div className="flex flex-col items-center gap-3 mb-6 text-center">
          <img src={`${logo}?v=3`} alt="Ascension by Sonali Bhasin Kumar" className="h-14 sm:h-16 w-auto object-contain" />
          <h1 className="text-xl sm:text-2xl font-serif text-charcoal font-bold mt-1">
            {step === 1 && 'Account Recovery'}
            {step === 2 && 'Set New Password'}
            {step === 3 && 'Password Reset Complete'}
          </h1>
          <p className="text-[11px] text-charcoal-light max-w-xs">
            {step === 1 && 'Enter your registered email address and we will send you a 6-digit verification code.'}
            {step === 2 && `Enter the 6-digit code sent to ${email} along with your new password.`}
            {step === 3 && 'Your password has been successfully updated. You can now access your account.'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 text-red-600 border border-red-500/20 text-xs p-3.5 rounded-xl text-left mb-5">
            {error}
          </div>
        )}

        {successMsg && step === 2 && (
          <div className="bg-sage/10 text-sage-dark border border-sage/30 text-xs p-3.5 rounded-xl text-left mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sage flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4 text-xs text-charcoal text-left">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-3 px-3.5 pl-9 text-charcoal focus:outline-none focus:border-sage transition-all text-xs"
                />
                <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-dark/40 text-xs">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-charcoal-light hover:text-charcoal transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
              <Link to="/register" className="font-bold text-sage hover:text-gold transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Enter 6-digit Code & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 text-xs text-charcoal text-left">
            {/* 6-Digit Code */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleSendCode}
                  className="text-[10px] font-bold text-sage hover:text-gold transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="e.g. 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-3 px-3.5 pl-9 text-charcoal font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-sage transition-all"
                />
                <KeyRound className="w-4 h-4 text-charcoal/40 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  autoComplete="new-password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 pl-9 pr-9 text-charcoal focus:outline-none focus:border-sage transition-all"
                />
                <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-charcoal/40 hover:text-charcoal focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 pl-9 pr-9 text-charcoal focus:outline-none focus:border-sage transition-all"
                />
                <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-charcoal/40 hover:text-charcoal focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-2 disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="inline-flex items-center justify-center gap-1.5 text-charcoal-light hover:text-charcoal transition-colors mt-2 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Use a different email address
            </button>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-4 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-sage/15 border border-sage/30 rounded-full flex items-center justify-center text-sage mb-2 shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <p className="text-xs text-charcoal-light leading-relaxed">
              Your password has been updated securely. You can now log into your Ascension account with your new credentials.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md uppercase tracking-wider mt-4"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
