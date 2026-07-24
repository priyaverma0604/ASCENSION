import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.success) {
        if (data.role === 'admin') {
          localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          onLoginSuccess(data);
        } else {
          setError('Access denied. Only administrators are permitted here.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-light py-12 px-6">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl border border-cream-dark/50 p-6 md:p-8 animate-slide-up">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <img src={logo} alt="Ascension by Sonali Bhasin Kumar" className="h-14 w-auto object-contain" />
          <div className="flex items-center gap-1.5 mt-2 bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-widest">Admin Workspace</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-150 mb-6 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans">
          
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-light">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-light">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ascension.ind.in"
                className="w-full bg-cream-light border border-cream-dark focus:border-gold rounded-xl py-3 pl-10 pr-4 text-xs outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-light">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-charcoal-light">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-light border border-cream-dark focus:border-gold rounded-xl py-3 pl-10 pr-10 text-xs outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-light hover:text-gold transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold hover:bg-gold-dark text-white rounded-xl py-3.5 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[1.0] flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
