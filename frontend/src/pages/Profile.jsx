import React, { useState, useContext, useEffect } from 'react';
import { Compass, User, Mail, Lock, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [myPrograms, setMyPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      fetchEnrolledPrograms();
    }
  }, [user]);

  const fetchEnrolledPrograms = async () => {
    try {
      const { data } = await axios.get('/api/programs');
      if (data.success) {
        // Filter programs where user ID is in enrolledUsers
        const enrolled = data.data.filter(prog => 
          prog.enrolledUsers.some(u => u._id === user._id)
        );
        setMyPrograms(enrolled);
      }
    } catch (err) {
      console.error('Error fetching enrolled programs:', err.message);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, email };
      if (password) {
        payload.password = password;
      }
      
      const res = await updateProfile(payload);
      if (res.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Edit Form */}
        <div className="glass p-6 rounded-2xl border border-cream-dark/50 self-start text-left flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-cream-dark/60 pb-3">
            <span className="gold-gradient p-2 rounded-xl text-white">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider">Account Settings</h3>
              <p className="text-[9px] text-sage font-medium tracking-wide uppercase mt-0.5">Role: {user?.role}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-600 border border-red-500/20 text-[11px] p-2.5 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-sage/10 text-sage border border-sage/20 text-[11px] p-2.5 rounded-xl flex items-center gap-1 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="flex flex-col gap-3.5 text-xs text-charcoal">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Change Password */}
            <div className="flex flex-col gap-1.5 border-t border-cream-dark/60 pt-3 mt-1">
              <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-sage" />
                Change Password (Optional)
              </label>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-2"
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Right Side: Programs list & Orders summary */}
        <div className="lg:col-span-2 flex flex-col gap-8 text-left">
          
          {/* Section: My Programs */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
              Enrolled Programs
            </h3>
            
            {loadingPrograms ? (
              <div className="shimmer h-28 rounded-2xl"></div>
            ) : myPrograms.length > 0 ? (
              <div className="flex flex-col gap-4">
                {myPrograms.map((prog) => (
                  <div key={prog._id} className="glass p-5 rounded-2xl border border-cream-dark/50 flex items-center justify-between gap-4 font-sans text-xs text-charcoal">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-serif font-bold text-sm text-charcoal-dark">{prog.title}</h4>
                      <p className="text-charcoal-light line-clamp-1">{prog.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-sage">
                        <span className="font-semibold uppercase tracking-wider bg-sage/10 py-0.5 px-2 rounded">{prog.duration}</span>
                        <span>Enrolled successfully</span>
                      </div>
                    </div>
                    <span className="bg-sage/10 p-2 rounded-full inline-block shrink-0 text-sage">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center glass rounded-2xl">
                <p className="text-xs text-charcoal-light">You are not enrolled in any programs yet.</p>
              </div>
            )}
          </div>

          {/* Quick links to shop cart / orders */}
          <div className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs font-sans text-charcoal">
            <div className="flex flex-col gap-0.5">
              <h4 className="font-serif font-bold text-sm text-charcoal-dark">Spiritual E-Commerce Orders</h4>
              <p className="text-charcoal-light">View details and tracking links for crystals and candles purchased.</p>
            </div>
            <button
              onClick={() => window.location.href = '/shop?tab=orders'}
              className="bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2 px-5 rounded-xl transition-colors shrink-0"
            >
              View Order History
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
