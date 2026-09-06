import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await register(name, email, password);
      if (data) {
        navigate(data.role === 'admin' ? '/admin' : redirect);
      }
    } catch (err) {
      setError(err || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 font-sans">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl border border-cream-dark/50 p-6 md:p-8 animate-slide-up">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <img src={`${logo}?v=3`} alt="Ascension by Sonali Bhasin Kumar" className="h-16 w-auto object-contain" />
          <p className="text-[10px] text-sage font-bold tracking-widest uppercase mt-1">
            Join the Ascension Seva circle
          </p>
        </div>

        {error && (
          <div className="bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs p-4 rounded-xl text-left mb-4 shadow-sm">
            <p className="font-semibold text-red-600 mb-1">{error}</p>
            {error.toLowerCase().includes('already exist') && (
              <div className="mt-2.5 pt-2.5 border-t border-amber-300/40 flex flex-wrap gap-2 text-[11px]">
                <Link
                  to={`/login?email=${encodeURIComponent(email)}`}
                  className="bg-sage text-white px-3 py-1.5 rounded-lg font-bold hover:bg-sage-dark transition-colors shadow-xs"
                >
                  Log In Now
                </Link>
                <Link
                  to={`/forgot-password?email=${encodeURIComponent(email)}`}
                  className="bg-cream border border-cream-dark/60 text-charcoal px-3 py-1.5 rounded-lg font-bold hover:text-sage transition-colors shadow-xs"
                >
                  Reset Password
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs text-charcoal text-left">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 pl-9 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
              <User className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 pl-9 text-charcoal focus:outline-none focus:border-sage transition-all"
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                placeholder="Must be at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-4"
          >
            {submitting ? 'Registering Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-charcoal-light mt-6 text-center">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="font-bold text-sage hover:text-gold transition-colors">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
